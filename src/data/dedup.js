const expertiseDB = require('../data/expertiseCatalog.json')
const expertise = expertiseDB.expertise
const nameCounts = {}
expertise.forEach(expertiseObj => {
  const name = expertiseObj.name
  nameCounts[name] = (nameCounts[name] || []).concat({id: expertiseObj.id})
})

const duplicates = Object.entries(nameCounts).filter(([name, ids]) => ids.length > 1).map(([name, ids]) => ({name, ids}))
console.log('duplicate names in expertiseDB', duplicates)
