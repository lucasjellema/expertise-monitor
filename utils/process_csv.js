/*
Script to process CSV data and update expertise and organization claims.

Make sure the files expertise.json and amis.csv are in the same folder as this script. Run the script with node process_csv.js.


The expected csv file has columns Thema and Keyword. The thema becomes a tag in the expertise entry, and the keyword is the name of the expertise entry.
for example:
Thema,Keyword
AI & Data Science,AI Ethics
AI & Data Science,AI Governance
Microsoft,Azure DevOps
Microsoft,Azure Event Grid
Microsoft,Azure Functions
Microsoft,Azure Key Vault

*/

const fs = require('fs');
const csv = require('csvtojson');


const loadCSV = async (filename) => {
  const data = await csv().fromFile(filename);
  return data;
};

const loadJSONFile = async (filename) => {
  const data = JSON.parse(await fs.promises.readFile(filename, 'utf8'));
  return data;
};

const loadExpertise = async () => {
  const expertise = await loadJSONFile('expertise.json');
  return expertise;
};

const loadAmisCSV = async () => {
  const amis = await loadCSV('amis.csv');
  return amis;
};

module.exports = { loadExpertise, loadAmisCSV };
const countRecordsInAmisCSV = async () => {
  const amis = await loadCSV('data/amis.csv');
  return amis.length;
};


function updateExpertise(expertise, X) {
  const expertiseMap = new Map(
    expertise.expertise.map((item) => [item.name.toLowerCase(), item])
  );

  // Find the highest existing ID
  let maxId = 0;
  expertise.expertise.forEach((item) => {
    const idAsNumber = parseInt(item.id, 10);
    if (!isNaN(idAsNumber) && idAsNumber > maxId) {
      maxId = idAsNumber;
    }
  });

  let newIdCounter = maxId + 1;

  for (const itemX of X) {
    const keywordLower = itemX.Keyword.toLowerCase();
    const themaLower = itemX.Thema.toLowerCase();

    if (expertiseMap.has(keywordLower)) {
      // Entry exists, add tag if it's new
      const existingExpertise = expertiseMap.get(keywordLower);
      if (themaLower && !existingExpertise.tags.includes(themaLower)) {
        existingExpertise.tags.push(themaLower);
        console.log(`Added tag '${themaLower}' to '${existingExpertise.name}'`);
      }
    } else {
      // Entry does not exist, create a new one
      const newEntry = {
        id: `${newIdCounter}`,
        name: itemX.Keyword,
        description: "",
        icon: "",
        webpage: "",
        logoURL: "",
        tags: themaLower ? [themaLower] : [],
      };
      expertise.expertise.push(newEntry);
      expertiseMap.set(keywordLower, newEntry);
      newIdCounter++;
      console.log(`Added new expertise entry: '${newEntry.name}' `, themaLower ? `with tag '${themaLower}'` : '');
    }
  }

  return expertise;
}

function updateOrganizationClaims(expertise, orgName, X, author) {
    console.log(`Updating claims for organization: ${orgName}`);
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString();
  const asOf = `${currentYear}${currentMonth}`;
  
  // Find the organization
  const organization = expertise.organization.find(org => org.name === orgName);

  if (!organization) {
    console.log(`Organization "${orgName}" not found.`);
    return expertise;
  }

  const claims = organization.expertiseClaims;

  // Create a map of expertise names to IDs for quick lookups
  const expertiseIdMap = new Map(
    expertise.expertise.map(item => [item.name.toLowerCase(), item.id])
  );
  
  // Create a set of existing expertise IDs for fast lookups
  const existingExpertiseIds = new Set(claims.map(claim => claim.expertiseId));




  X.forEach(expertiseItem => {
     const keywordLower = expertiseItem.Keyword.toLowerCase();
    const expertiseId = expertiseIdMap.get(keywordLower);
    // Assuming expertiseItem has a property like 'id' that matches expertiseId
    
    // Check if the expertise exists and if a claim for it does not
    if (expertiseId && !existingExpertiseIds.has(expertiseId)) {
      const newClaim = {
        expertiseId: expertiseId,
        count: 1,
        asOf: asOf,
        author: "HANK"
      };
      claims.push(newClaim);
      existingExpertiseIds.add(expertiseId); // Add new ID to the set
      console.log(`Added new claim for expertise ID: ${expertiseId}`);
    }
  });

  return expertise;
}


const main = async () => {
  let expertise = await loadExpertise();
  console.log('Loaded expertise:');
  const amis = await loadAmisCSV();
  console.log('Loaded amis:', amis.length);
  expertise = updateExpertise(expertise, amis);
  console.log('Updated expertise:');
  console.log(expertise.expertise.length);
  expertise = updateOrganizationClaims(expertise, 'AMIS', amis, "Robbrecht");

};
main();


/* generated with

a JavaScript coding challenge.

I have a variable expertise with this structure:
```
{
  "expertise": [
    {
      "id": "494",
      "name": "Neo4j",
      "description": "Neo4j is a graph database management system developed by Neo4j, Inc. It is designed to store, manage, and query data in a graph structure.",
      "icon": "mdi-database",
      "webpage": "https://neo4j.com",
      "logoURL": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Neo4j-logo.png",
      "tags": [
        "database",
        "nosql"
      ]
    },
    {
      "id": "495",
      "name": "Memcached",
      "description": "Memcached is a free and open-source, high-performance, distributed memory object caching system, generic in nature, but intended for use in speeding up dynamic web applications by alleviating database load.",
      "icon": "mdi-memory",
      "webpage": "https://memcached.org",
      "logoURL": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Memcached_logo.png",
      "tags": [
        "performance",
        "open source"
      ]
    },...
```
and I have a variable X that contains :
```
[
  { Thema: 'AI & Data Science', Keyword: 'AI Ethics' },
  { Thema: 'AI & Data Science', Keyword: 'AI Governance' },
  { Thema: 'AI & Data Science', Keyword: 'BLOOM' },...
```

I want code that does the following:
* check for each object in X if an entry exists in expertise where Keyword == name (case insensitive)
* if an entry does not exist, create one - with a unique value for id property and with the lower case value in X of Thema added as a tag ; Find the highest current value for id and start increasing from there
* if the entry exists, add the lower case value in X of Thema as a tag (if that does not already exist)


and:

the variable expertise also contains a property organizations:
```
,    
"organization": [
        {
            "id": "1",
            "name": "Conclusion Low Code Company",
            "type": "company",
            "url": "https://www.conclusion.nl/en/low-code-company",
            "expertiseClaims": [
                {
                    "expertiseId": "9",
                    "description": "R&D",
                    "asOf": "246",
                    "count": 0,
                    "author": "Anthony Dickinson"
                },
                {
                    "expertiseId": "15",
                    "count": 0,
                    "notes": "",
                    "asOf": "246",
                    "author": "Anthony Dickinson"
                },
```

generate code to :
* find the organization with the name XXX
* get the expertiseclaims for the organization as claims
* for every expertise in X , check if an expertise claim already exists in claims ; if it does not: create an expertise claim in claims; set count to 1, set asOf to the current year and month (yym, for example 246 or 2511); set author to HANK; 


*/