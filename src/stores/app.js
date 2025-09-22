// Utilities
import { defineStore } from 'pinia'

//import expertiseDB from '../data/expertise.json'
//import expertiseCatalogDB from '../data/expertiseCatalog.json'
import {getData} from './dataService.js'


export const useAppStore = defineStore('app', () => {

  const expertiseTags = ref(new Set([]))
  const readOnly = ref(true)  // TODO Default should be true!

  const toggleReadOnly = () => {
    readOnly.value = !readOnly.value
  }
  const getReadOnly = () => {
    return readOnly.value
  }

  const preAuthenticatedRequestURL = ref(null)

  const setPAR = (par) => {
    preAuthenticatedRequestURL.value = par
    console.log(`PAR = `, preAuthenticatedRequestURL.value)
    initializeExpertise()
  }


  const getJSONFile = (filename) => {
    return new Promise((resolve, reject) => {
      const targetURL = preAuthenticatedRequestURL.value + filename
      fetch(targetURL, { method: 'GET' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          resolve(response.json())
        })
        .catch(err =>
          resolve(1)
        );
    })
  }

  const getListOfFiles = () => {
    return new Promise((resolve, reject) => {
      const targetURL = preAuthenticatedRequestURL.value
      fetch(targetURL, { method: 'GET' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          resolve(response.json()) // should be a list of all files that needs to be filtered by prefix directory+'/'
        })
        .catch(err =>
          resolve(1)
        );
    })
  }


  const saveFile = async (blob, filename) => {
    const fetchOptions = {
      method: 'PUT',
      body: blob,
    };

    const targetURL = preAuthenticatedRequestURL.value + filename
    fetch(targetURL, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.status;
      })
      .then(data => {
        return 0
      })
      .catch(error => {
        return 1
      });
  }

  //const expertiseJSON = ref(expertiseDB)
const expertiseJSON = ref(null)


  const loadDeltaFiles = async () => {
    // get list of files in delta directory

    const files = await getListOfFiles()
    if (!files || !files.objects || files.objects.length == 0) return
    const deltaFiles = files.objects.filter(file => file.name.startsWith(DELTA_DIRECTORY + '/')).sort((a, b) => a.name.localeCompare(b.name))

    if (!deltaFiles || deltaFiles.length == 0) return
    const lastConsolidation = await getJSONFile(CONSOLIDATION_MARKER_FILE)
    let deltaToProcess = deltaFiles
    if (lastConsolidation != 1) {
      console.log('DEBUG last consolidation log read from file ', lastConsolidation)
      console.log('DEBUG remove from delta files any file less than or equal to ', DELTA_DIRECTORY + '/' + lastConsolidation.lastDeltaTimestamp + '.json')
      try {
        deltaToProcess = deltaFiles.filter(file => file.name > DELTA_DIRECTORY + '/' + lastConsolidation.lastDeltaTimestamp + '.json')
      } catch (error) {
        console.log('ERROR in filtering delta files to deltaToProcess', error)
      }


    }
    // for each file, load it and merge it into the dataset
    console.log('delta files to process', deltaToProcess)
    for (const file of deltaToProcess) {
      const delta = await getJSONFile(file.name)
      if (delta) {
        console.log('processing delta', delta.type, file.name)

        // if (delta.type == 'tip') {
        //   const index = expertiseJSON.value.tips.findIndex(t => t.id === delta[delta.type].id)
        //   if (index > -1) {
        //     expertiseJSON.value.tips[index] = delta[delta.type]
        //   } else {
        //     expertiseJSON.value.tips.push(delta[delta.type])
        //   }
        // }

      }
    }
    return deltaFiles
  }

  //const MAIN_EXPERTISE_FILE = 'expertise.json'
  //const MAIN_DATA_FILE = 'expertiseMonitor.json'

  // assume that expertiseJSON  already has been loaded when this function is called
  const initializeExpertise = async () => {
// TODO create fresh expertiseJSON
//    expertiseJSON.value = await getJSONFile(MAIN_EXPERTISE_FILE)
    console.log(expertiseJSON.value)
    // if not found, create it
    if (expertiseJSON.value == 1) {
      expertiseJSON.value = { organization: [], expertise: [] }
      // save it
      // saveFile(JSON.stringify(expertiseJSON.value), MAIN_EXPERTISE_FILE)

    } else {

     // await loadDeltaFiles()
    }
    // if (expertiseCatalogDB) {
    //   expertiseJSON.value.expertise =
    //     expertiseJSON.value.expertise.concat(expertiseCatalogDB.expertise)
    // }
    dataIsPrepared = false
    prepareData(expertiseJSON.value)

    dataIsPrepared = true

    return expertiseJSON
  }

  let dataIsPrepared = false
  const prepareData = () => {
    // TODO - prepare data : create memberOrganizations under all organizations for the organizations that are members of them
    console.log('TODO prepare data : create memberOrganizations under all organizations for the organizations that are members of them')
    // loop over all organization units; if they have organizationMemberships, then create an entry in memberOrganizations under the organization they are a member of
    //    const expertiseObject = getExpertise().value
    const organization = expertiseJSON.value.organization
    for (const org of organization) {
      if (org.organizationMemberships && org.organizationMemberships.length > 0) {
        for (const membership of org.organizationMemberships) {
          //"organizationMemberships": [ { "organizationId": "3", "description": "onderdeel van domein" } ] },
          const index = organization.findIndex(o => o.id === membership.organizationId)
          if (index > -1) {
            membership.organization = organization[index]
            if (!organization[index].memberOrganizations) {
              organization[index].memberOrganizations = []
            }
            organization[index].memberOrganizations.push({
              ...membership, organization: org
            })
          }

        }
      }
      if (org.expertiseClaims && org.expertiseClaims.length > 0) {
        for (const claim of org.expertiseClaims) {
          claim.expertise = expertiseJSON.value.expertise.find(e => e.id === claim.expertiseId)
        }
      }
      
      if (org.vendorRelations && org.vendorRelations.length > 0) {
        for (const relation of org.vendorRelations) {
          const vendor = expertiseJSON.value.vendors.find(v => v.id === relation.vendorId)
          if (vendor) {
            relation.vendor = vendor
          }
        }
      }
      if (org.certifications && org.certifications.length > 0) {
        for (const certification of org.certifications) {
          const vendor = expertiseJSON.value.vendors.find(v => v.id === certification.vendorId)
          if (vendor) {
            certification.vendor = vendor
          }
        }
      }
    }

    initializeTags()
  }


  const tagExpertiseMap = ref({}) // mapping tag to an array of all expertises that have that tag
  const initializeTags = () => {
    // loop over all expertise
    tagExpertiseMap.value = {}
    expertiseTags.value = new Set(['database'])
    for (const expertise of expertiseJSON.value.expertise) {
      try {
        for (const tag of expertise.tags) {
          expertiseTags.value.add(tag)

          if (!tagExpertiseMap.value[tag]) {
            tagExpertiseMap.value[tag] = []
          }
          tagExpertiseMap.value[tag].push(expertise)
        }
      } catch (error) {
        console.log("caught tags error", error)
      }
    }
    console.log('tagExpertiseMap',  tagExpertiseMap.value)

    expertiseTags.value = Array.from(expertiseTags.value).sort()
  }

  const getExpertise = () => {
    if (!dataIsPrepared) {
      dataIsPrepared = true
      // if (expertiseCatalogDB) {
      //   expertiseJSON.value.expertise =
      //     expertiseJSON.value.expertise.concat(expertiseCatalogDB.expertise)
      //     expertiseJSON.value.vendors = expertiseCatalogDB.vendors
      // }
      prepareData(expertiseJSON.value)

    }
    return expertiseJSON
  }

  const saveExpertise = (expertise) => {
    const expertiseData = getExpertise()
    if (expertise.id) {
      const index = expertiseData.value.expertise.findIndex(e => e.id === expertise.id)
      if (index > -1) {
        expertiseData.value.expertise[index] = expertise
      } else {
        // weird: id is set but expertise is not found. TODO error
      }
    } else {
      expertise.id = new Date().getTime()
      expertiseData.value.expertise.push(expertise)
    }
    // TODO update expertise under tags 

    initializeTags()
  }

  const saveOrganization = (organization) => {
    const expertiseData = getExpertise()
    if (organization.id) {
      const index = expertiseData.value.organization.findIndex(o => o.id === organization.id)
      if (index > -1) {
        for (let prop in organization) {
          if (organization.hasOwnProperty(prop) && prop !== 'expertiseClaims' && prop !== 'id') {
            expertiseData.value.organization[index][prop] = organization[prop]
          }
        }

      } else {
        // weird: id is set but organiztion is not found. TODO error
      }
    } else {
      organization.id = new Date().getTime()
      organization.expertiseClaims = []
      expertiseData.value.organization.push(organization)
    }
  }

  const DELTA_DIRECTORY = 'delta'
  const CONSOLIDATION_MARKER_FILE = 'lastExpertiseDeltaConsolidated.json'

  const consolideerDeltafiles = async () => {
    console.log('consolidating delta files in appstore')

   // expertiseJSON.value = await getJSONFile(MAIN_EXPERTISE_FILE)
    const deltaFiles = await loadDeltaFiles()

    // write lastDeltaConsolidated.json with fileid/timestamp of most recent delta that was processed
    const lastDeltaFileProcessed = deltaFiles[deltaFiles.length - 1]
    const timestamp = lastDeltaFileProcessed.name.substring(0, lastDeltaFileProcessed.name.length - 5).substring(DELTA_DIRECTORY.length + 1) // strip .json at the end and strip delta/ at the beginning
    const lastConsolidation = { consolidationTimestamp: new Date().getTime(), lastDeltaTimestamp: timestamp }
    expertiseJSON.value.lastConsolidation = lastConsolidation
   // const _ = await saveFile(JSON.stringify(expertiseJSON.value), MAIN_EXPERTISE_FILE)

    saveFile(JSON.stringify(lastConsolidation), CONSOLIDATION_MARKER_FILE)
  }

/**
 * Fetch data using the account info (like email) to get the PAR URL from a backend service
 * @param {Object} account - The account object to fetch data with
 */
const fetchDataUsingAccount = (account)=> {
  // TODO fetch data using the account info (like email) to get the PAR URL from a backend service
  console.log('TODO fetch data using the account info (like email) to get the PAR URL from a backend service', account)
  getData(account).then( data => {
    console.log('fetched', data)
    expertiseJSON.value = data
    initializeExpertise(expertiseJSON.value)
  })
};

  return {
    setPAR, getExpertise, consolideerDeltafiles, saveExpertise, expertiseTags, tagExpertiseMap, saveOrganization, getReadOnly, toggleReadOnly, fetchDataUsingAccount
  }
})
