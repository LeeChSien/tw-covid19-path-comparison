import * as Papa from 'papaparse'

function fetchSelfMantainPathData() {
  const uri = 'https://gist.githubusercontent.com/LeeChSien/841d69870fb457a253f7a28318034860/raw/path.csv'
  return new Promise(resolve => {
    const items = []
    Papa.parse(uri, {
      download: true,
      complete: results => {
        results.data.forEach(row => {
          items.push({
            date: new Date(row[0]),
            name: row[1],
            address: row[2],
            location: {
              lat: row[3],
              lng: row[4]
            }
          })
        })
        resolve(items)
      }
    })
  })
}

export default fetchSelfMantainPathData
