import axios from 'axios'
import toGeoJSON from '@mapbox/togeojson'

function fetchOpensourcePathData() {
  const uri = 'https://www.google.com/maps/d/kml?mid=1rrk8w7jJsZGXz_hSpi0q9no77cdhMC2z&forcekml=1'

  return axios.get(uri).then(response => {
    const items = []
    const kml = new DOMParser().parseFromString(response.data, 'application/xml')
    const gj = toGeoJSON.kml(kml)
    gj.features.forEach(feature => {
      items.push({
        name: feature.properties.name,
        description: feature.properties.description,
        date: feature.properties.description.match(/\d\/\d{1,2}/)[0],
        raw: feature
      })
    })
    return items
  })
}

export default fetchOpensourcePathData
