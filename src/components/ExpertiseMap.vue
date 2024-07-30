<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row>
                    <v-col cols="3">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                            @change="handleSearchChange" @keyup="handleSearchChange"></v-text-field>

                        <v-select v-model="selectedSearchSuggestions" :items="searchSuggestions" item-title="name"
                            return-object label="Show expertise for" multiple clearable ref="searchSuggestionSelect"
                            :item-props="selectItemProps">
                            <template v-slot:prepend-item>
                                <v-list-item title="Select All" @click="toggle">

                                </v-list-item>

                                <v-divider class="mt-2"></v-divider>
                            </template>


                        </v-select>


                        <!-- TODO search in notes? author? domein/company? -->
                    </v-col>
                    <v-col cols="7" offset="0">
                        <!-- TODO add toggle: AND / OR (at least one tag must apply or all selected tags must apply) -->
                        <v-chip-group v-model="checkedTags" column multiple>
                            <v-chip v-for="tag in availableTags" :key="tag" :text="tag" filter></v-chip>
                        </v-chip-group>
                        <v-btn @click="checkedTags = []" icon="mdi-cancel" title="Clear all tags"></v-btn> </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" offset="1">
                        <div id="app">
                            <ExpertiseUnit :unit="initializeExpertiseStructureForTag(tag)"
                                v-for="tag in checkedTags.map(tag => availableTags[tag])" :key="changeIndicator"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested" />
                        </div>
                        <div id="app2">
                            <ExpertiseUnit
                                :unit="suggestion.type == 'expertise' ? initializeExpertiseStructureForExpertise(suggestion.expertise) : initializeExpertiseStructureForTag(suggestion.tag)"
                                v-for="suggestion in selectedSearchSuggestions" :key="changeIndicator"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested" />
                        </div>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>
    <v-dialog v-model="editExpertiseClaimsDialog" width="1400">
        <v-card>
            <v-card-title>
                <!-- <v-btn @click="saveOrganizationExpertise">Opslaan</v-btn> -->
            </v-card-title>
            <EditExpertiseMultiOrganizationClaim :expertise="expertiseToEditClaimsFor"
                @expertiseChanged="handleExpertiseClaimsChanged" />
        </v-card>
    </v-dialog>


</template>


<script setup>

const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})
import { useAppStore } from "@/stores/app";
import EditExpertiseMultiOrganizationClaim from "./EditExpertiseMultiOrganizationClaim.vue";
const appStore = useAppStore()

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();


const selectedTags = ref(appStore.expertiseTags)
let expertiseClaimMap = ref({})
let tagClaimMap = ref({})
const checkedTags = ref([])
const availableTags = ref([])
const search = ref('')
const searchSuggestions = ref([])
const selectedSearchSuggestions = ref([])

const searchSuggestionSelect = ref(null)
const editExpertiseClaimsDialog = ref(false)
const expertiseToEditClaimsFor = ref(null)
const changeIndicator = ref(0)

watch(selectedSearchSuggestions   , (newValue, oldValue) => {
    console.log('selectedSearchSuggestions', newValue, oldValue)
    // make sure that any entries in the newValue array of type tag are included in checkTags (but first find their index in avaialbleTags)
    for (const suggestion of newValue) {
            console.log('search suggestion', suggestion.type, suggestion.tag)
            if (suggestion.type == 'tag') {
                
                const index = availableTags.value.indexOf(suggestion.tag)
                if (index > -1) {
                    if (!checkedTags.value.includes(index))
                        checkedTags.value.push(index)
                }
            }
    }
})

const
    headers = ref([
        { title: 'Name', value: 'name', sortable: true, width: '180px' },
        { title: 'Type', value: 'type', width: '100px' }
    ])


const toggle = () => {
    if (selectedSearchSuggestions.value.length > 0) {
        selectedSearchSuggestions.value = []
    } else {
        selectedSearchSuggestions.value = searchSuggestions.value
    }
}
const selectItemProps = (item) => {
    return {
        title: item.name,
        subtitle: item.type,
    }
}

const handleEditOrganizationExpertiseRequested = (e) => {
    console.log('handleEditOrganizationExpertiseRequested', e)
    // TODO open edit dialog for editing the expertise e.expertise (in case e.type == 'expertise'))
    // show all organizations that have a claim already and add new empty claims for other organizations
    if (e.type == 'expertise') {


        expertiseToEditClaimsFor.value = e.expertise
        editExpertiseClaimsDialog.value = true
    }

}

const handleSearchChange = (e) => {
    console.log('new search on ', search.value, e)
    console.log(selectedSearchSuggestions.value, searchSuggestions.value)
    // find all expertises (lower case) who contain the search string
    // add them to the list
    searchSuggestions.value = []
    searchSuggestionSelect.value.menu = false
    // TODO remove all search suggestions that are not selected
    if (search.value.length > 1) {

        const filteredExpertise = []
        appStore.getExpertise().value.expertise.filter(expertise => expertise.name.toLowerCase().includes(search.value.toLowerCase())).forEach(expertise => {
            filteredExpertise.push(expertise)
        })
        console.log(filteredExpertise)
        if (filteredExpertise.length > 0) {
            searchSuggestions.value = filteredExpertise.map(expertise => { return { name: expertise.name, expertise: expertise, type: 'expertise' } })
        }

        const filteredTags = availableTags.value.filter(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
        console.log("filtered, checked", filteredTags, checkedTags.value)
        //  checkedTags.value = filteredTags
        if (filteredTags.length > 0) {
            searchSuggestions.value = searchSuggestions.value.concat(filteredTags.map(tag => { return { name: tag, type: 'tag', tag: tag } }))
        }

        searchSuggestionSelect.value.menu = true
    }
}

// build a map with all expertise claims of all organizations 
const buildExpertiseClaimMap = () => {
    expertiseClaimMap.value = {}
    tagClaimMap = {}
    for (const org of props.organization) {
        if (org?.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {
                if (!expertiseClaimMap.value[claim.expertiseId]) {
                    expertiseClaimMap.value[claim.expertiseId] = { total: ensureNumeric(claim.count), expertise: [{ ...claim, organization: org }] } // claim.count
                } else {
                    expertiseClaimMap.value[claim.expertiseId].total += ensureNumeric(claim.count)
                    expertiseClaimMap.value[claim.expertiseId].expertise.push({ ...claim, organization: org })

                }
                // if (claim.expertise.tags && claim.expertise.tags.length > 0) {
                //     for (const tag of claim.expertise.tags) {
                //         if (!tagClaimMap[tag]) {
                //             tagClaimMap[tag] = { total: claim.count, expertise: [{ expertise: claim.expertise, count: claim.count }] }
                //         } else {
                //             tagClaimMap[tag].total += claim.count
                //             tagClaimMap[tag].expertise.push({ expertise: claim.expertise, count: claim.count })
                //         }
                //     }
                // }
            }
        }
    }
    console.log('expertiseClaimMap', expertiseClaimMap.value)
    console.log('tagClaimMap', tagClaimMap)
}


const expertiseStructure = ref(null)
const initializeExpertiseStructureForTag = (tag) => {
    const expertiseStructure = ref(null)
    expertiseStructure.value = {
        name: tag, count: 0,
        children: []
    }
    // loop over all expertises in tag
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[tag]
    if (expertisesUnderTag) {
        let countForTag = 0;
        for (const expertise of expertisesUnderTag) {
            const e = expertiseClaimMap.value[expertise.id]
            if (e) {
                const node = { name: expertise.name, children: [], count: e.total, type: 'expertise', expertise: expertise , logo:expertise.logoURL}
                countForTag += ensureNumeric(e.total)
                expertiseStructure.value.children.push(node)
                for (const claim of e.expertise) {
                    const orgNode = { name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization 
                    ,logo: companyLogos[claim.organization.name]

                    }
                    node.children.push(orgNode)
                }
            }
            // else no claims for this expertise, not currently available in the ecosystem; include a node for this expertise?
            else {
                const node = { name: expertise.name, children: [], count: 0, type: 'expertise', expertise: expertise }
                expertiseStructure.value.children.push(node)
            }
        }
        expertiseStructure.value.count = countForTag
    }
    return expertiseStructure.value
}

const initializeExpertiseStructureForExpertise = (expertise) => {
    const expertiseStructure = ref(null)
    expertiseStructure.value = {
        name: expertise.name, count: 0,
        children: [], expertise: expertise, type: 'expertise', logo:expertise.logoURL
    }
    const e = expertiseClaimMap.value[expertise.id]
    if (e) {
        expertiseStructure.value.count = e.total
        for (const claim of e.expertise) {
            const orgNode = { name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization 
                ,logo: companyLogos[claim.organization.name]
            }
            expertiseStructure.value.children.push(orgNode)
        }
    }

    return expertiseStructure.value
}


onMounted(() => {
    availableTags.value = [...appStore.expertiseTags]
    buildExpertiseClaimMap()
})

const handleExpertiseClaimsChanged = (newAndUpdatedClaims) => {
    console.log('handleExpertiseClaimsChanged from the multi row table editor', newAndUpdatedClaims)
    editExpertiseClaimsDialog.value = false

    for (const claim of newAndUpdatedClaims) {
        if (claim.new) {
            const newClaim = { ...claim }
            // remove properties updated, new, organization, name
            delete newClaim.new
            delete newClaim.updated
            delete newClaim.organization
            delete newClaim.name
            newClaim.count = ensureNumeric(claim.count) 
            if (!claim.organization.expertiseClaims) claim.organization.expertiseClaims=[]
            claim.organization.expertiseClaims.push(newClaim)
        } else {
            claim.originalClaim.count = ensureNumeric(claim.count) 
            claim.originalClaim.notes = claim.notes
        }
    }

    buildExpertiseClaimMap()
    changeIndicator.value++ 

}

function ensureNumeric(value) {
    // Check if the value is a string and if it represents a valid number
    if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        // Convert the string to a number
        return Number(value);
    }
    // If the value is already a number, or it's not a valid number string, return it as is
    return value;
}


</script>
<style scoped>
.always-open-select .v-input__control {
    pointer-events: none;
    /* Disable pointer events to prevent clicks */
}

.always-open-select .v-select__selections {
    display: none;
    /* Hide the default selection display */
}
</style>