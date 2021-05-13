const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
const axios = require('axios')

async function main() {
  const data = []
  fs.createReadStream(path.resolve(__dirname, '../data', 'source.csv'))
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => data.push(row))
    .on('end', async () => {
      const csvStream = csv.format({ headers: true })
      csvStream.pipe(process.stdout).on('end', () => process.exit())
      for (const row of data) {
        try {
          const resp = await axios.get(
            encodeURI(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${
                row[2] ? row[2] : row[1]
              }&key=xxxxxxxxxxxxxxxxxxxx`
            )
          )
          if (resp.data.results.length > 0) {
            csvStream.write({
              date: row[0],
              name: row[1],
              address: row[2],
              lat: resp.data.results[0].geometry.location.lat,
              lng: resp.data.results[0].geometry.location.lng
            })
          } else {
            csvStream.write({ date: row[0], name: row[1], address: row[2] })
          }
          // console.log(resp.data)
        } catch (err) {
          // Handle Error Here
          console.error(err)
        }
      }

      csvStream.end()
    })
}

main()
