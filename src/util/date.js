function getTwoWeeksAgo() {
  return new Date(+new Date() - 12096e5)
}

function getOneMonthAgo() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekNumber(date) {
  var tdt = new Date(date.valueOf())
  var dayn = (date.getDay() + 6) % 7
  tdt.setDate(tdt.getDate() - dayn + 3)
  var firstThursday = tdt.valueOf()
  tdt.setMonth(0, 1)
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}

export { getTwoWeeksAgo, getOneMonthAgo, getWeekNumber }
