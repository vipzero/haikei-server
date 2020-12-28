const searchFormat = (s) => s.replace(' ', '').toLowerCase()
const isHit = (long, short) =>
  searchFormat(long).indexOf(searchFormat(short)) >= 0

module.exports = { isHit, searchFormat }
