const expertiseDB = require('../data/expertiseCatalog.json')

const findDuplicatesInExpertiseNames = () => {
  const expertise = expertiseDB.expertise
  const nameCounts = {}
  expertise.forEach(expertiseObj => {
    const name = expertiseObj.name
    nameCounts[name] = (nameCounts[name] || 0) + 1
  })

  const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1).map(([name, count]) => name)
  return duplicates
}

const expertiseDBDuplicateNames = findDuplicatesInExpertiseNames()
console.log('duplicate names in expertiseDB', expertiseDBDuplicateNames)
