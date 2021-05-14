import { getDistance } from 'geolib'

function compare(myHistory, pathSetA, pathSetB) {
  const closePoints = {}
  for (const myPoint of myHistory.items) {
    const myLat =
      myPoint.raw.geometry.coordinates[0].length > 0
        ? myPoint.raw.geometry.coordinates[0][1]
        : myPoint.raw.geometry.coordinates[1]
    const myLng =
      myPoint.raw.geometry.coordinates[0].length > 0
        ? myPoint.raw.geometry.coordinates[0][0]
        : myPoint.raw.geometry.coordinates[0]

    for (const riskPoint of pathSetA) {
      if (!riskPoint.location.lat || !riskPoint.location.lng) {
        continue
      }
      const distance = getDistance(
        { latitude: myLat, longitude: myLng },
        { latitude: riskPoint.location.lat, longitude: riskPoint.location.lng }
      )

      if (distance < 300 && myPoint.timeBegin > riskPoint.date) {
        closePoints[riskPoint.name] = {
          entry: {
            ...riskPoint
          }
        }
      }
    }

    for (const riskPoint of pathSetB) {
      if (!riskPoint.location.lat || !riskPoint.location.lng) {
        continue
      }
      const distance = getDistance(
        { latitude: myLat, longitude: myLng },
        { latitude: riskPoint.location.lat, longitude: riskPoint.location.lng }
      )

      if (riskPoint.location.lat === '34.990000699999996') {
        console.log(riskPoint.date)
        console.log(myPoint.timeBegin)
      }

      if (distance < 300 && myPoint.timeBegin > riskPoint.date) {
        closePoints[riskPoint.name] = {
          entry: {
            ...(closePoints[riskPoint.name] ? closePoints[riskPoint.name].entry : {}),
            ...riskPoint
          }
        }
      }
    }
  }
  return closePoints
}

export default compare
