<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row>
                    <v-col cols="3">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                            clearable @click:clear="clearSearch" @change="handleSearchChange"
                            @keyup="handleSearchChange"></v-text-field>

                        <v-select v-model="selectedSearchSuggestions" :items="searchSuggestions" item-title="name"
                            return-object label="Show expertise for" multiple clearable ref="searchSuggestionSelect"
                            :item-props="selectItemProps" @click:chip="removeItem">
                            <template v-slot:selection="{ item, index }">
                                <v-chip @click.stop="removeItem(item, index)">
                                    {{ item.title }}
                                </v-chip>
                            </template>
                            <template v-slot:prepend-item>
                                <v-list-item title="Select All" @click="toggle"></v-list-item>
                                <v-divider class="mt-2"></v-divider>
                            </template>
                        </v-select>
                        <v-checkbox v-model="showZeroCountTags" label="Show tags without any company expertise" dense
                            hide-details class="mt-0 mb-0" />
                        <v-checkbox v-model="showZeroCountExpertise" label="Show topics without any company expertise"
                            dense hide-details class="mt-0" />

                        <!-- TODO search in notes? author? domein/company? -->
                    </v-col>
                    <v-col cols="7" offset="0">

                        <!-- TODO add toggle: AND / OR (at least one tag must apply or all selected tags must apply) -->
                        <v-chip-group v-model="checkedTags" column multiple>
                            <div v-for="tag in availableTags">
                                <v-chip :key="tag" :text="tag" filter variant="outlined"
                                    :size="tag.toLowerCase().includes(search.toLowerCase()) ? (search.length > 0 ? 'default' : 'small') : (checkedTagStrings.includes(tag) ? 'large' : 'x-small')"
                                    :style="!showZeroCountTags && !(tagClaimMap[tag]?.companyCount > 0) ? 'display:none' : tag.toLowerCase().includes(search.toLowerCase()) ? (search.length > 0 ? '' : '') : (checkedTagStrings.includes(tag) ? '' : 'display:none')"></v-chip>
                            </div>
                        </v-chip-group>
                        <v-btn @click="checkedTags = []" icon="mdi-cancel" title="Clear all tags"></v-btn> </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" offset="1">
                        <div id="app">

                            <ExpertiseUnit
                                :unit="suggestion.type == 'expertise' ? initializeExpertiseStructureForExpertise(suggestion.expertise) : initializeExpertiseStructureForTag(suggestion.tag)"
                                v-for="suggestion in selectedSearchSuggestions" :key="changeIndicator"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested"
                                @showExpertiseMapRequested="handleShowExpertiseMapRequested"
                                @showExpertiseDetailsRequested="handleShowExpertiseDetailsRequested" />
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

    <v-dialog v-model="openExpertiseClaimDialog" width="1400">
        <v-card>
            <v-card-title>
                <!-- <v-btn @click="saveOrganizationExpertise">Opslaan</v-btn> -->
            </v-card-title>
            <EditExpertiseClaim :expertiseClaim="expertiseClaimToEdit"
                @singleExpertiseClaimChanged="handleSingleExpertiseClaimChanged" />
        </v-card>
    </v-dialog>
    <v-dialog v-model="expertiseDialog" width="1000" @afterLeave="editExpertise = false">
        <v-card>
            <!-- <v-card-title>
                <v-btn @click="editExpertise = true" v-if="!editExpertise && !appStore.getReadOnly()">Bewerken</v-btn>
                <v-btn @click="saveExpertise" v-if="editExpertise">Opslaan</v-btn>
            </v-card-title> -->
            <ExpertiseDetails :expertise="expertiseToShow" v-if="!editExpertise" />
            <!-- <EditExpertise :expertise="expertiseToShow" @expertiseChanged="handleExpertiseUpdate"
                v-if="editExpertise" /> -->
        </v-card>
    </v-dialog>
    <v-dialog v-model="organizationDialog" width="1000">
        <v-card>
            <OrganizationDetails :organization="organizationToShow" />
        </v-card>
    </v-dialog>
</template>


<script setup>

const props = defineProps({
    organization: {
        type: Array,
        required: true
    },
    initialExpertise: {
        type: String,
    },
    initialTag: {
        type: String
    }
})
import { useAppStore } from "@/stores/app";
import EditExpertiseMultiOrganizationClaim from "./EditExpertiseMultiOrganizationClaim.vue";
const appStore = useAppStore()

import { useRouter } from 'vue-router'

const router = useRouter()

const expertiseToShow = ref(null)
const expertiseDialog = ref(false)
const generateExpertiseDialog = (expertise) => {
    expertiseToShow.value = { ...expertise }
    expertiseDialog.value = true
}
const editExpertise = ref(false)


const organizationToShow = ref(null)
const organizationDialog = ref(false)


const availableTags = computed(() => {
    return allTags.value //.filter(tag =>  tag.toLowerCase().includes(search.value.toLowerCase())) 
})

const checkedTagStrings = computed(() => {
    return checkedTags.value.map(key => allTags.value[key])

})

const clearSearch = () => {
    search.value = ''
}

const removeItem = (item, index) => {
    selectedSearchSuggestions.value.splice(index, 1)
    synchronizeSelectedSearchSuggestionsToCheckedTags(selectedSearchSuggestions.value)
}

import { useIconsLibrary } from '@/composables/useIconsLibrary';

const { companyLogos } = useIconsLibrary();

const showZeroCountTags = ref(false)
const showZeroCountExpertise = ref(false)
const selectedTags = ref(appStore.expertiseTags)
let expertiseClaimMap = ref({})
let tagClaimMap = ref({})
const checkedTags = ref([])
const allTags = ref([])
const search = ref('')
const searchSuggestions = ref([])
const selectedSearchSuggestions = ref([])

const searchSuggestionSelect = ref(null)
const editExpertiseClaimsDialog = ref(false)
const expertiseToEditClaimsFor = ref(null)
const changeIndicator = ref(0)

const openExpertiseClaimDialog = ref(false)
const expertiseClaimToEdit = ref(null)
const handleSingleExpertiseClaimChanged = (expertiseClaim) => {
    openExpertiseClaimDialog.value = false
    console.log('handleSingleExpertiseClaimChanged', expertiseClaim)
    const existingClaim = expertiseClaimToEdit.value.organization.expertiseClaims.find(claim => claim.expertiseId === expertiseClaim.expertise.id)
    // update existing claim from expertiseClaim
    if (existingClaim) {
        console.log(`found existing claim`, existingClaim)
        existingClaim.count = ensureNumeric(expertiseClaim.count)
        existingClaim.notes = expertiseClaim.notes
        existingClaim.author = expertiseClaim.author
        if (expertiseClaim.asOf) {
            existingClaim.asOf = expertiseClaim.asOf
        }

        existingClaim.ambition = expertiseClaim.ambition

        buildExpertiseClaimMap()
        changeIndicator.value++
    }
}

watch([showZeroCountTags, showZeroCountExpertise], async (newValue, oldValue) => {
    changeIndicator.value++
})

const synchronizeSelectedSearchSuggestionsToCheckedTags = (searchSuggestions) => {
    for (const suggestion of searchSuggestions) {
        console.log('search suggestion', suggestion.type, suggestion.tag)
        if (suggestion.type == 'tag') {
            const index = allTags.value.indexOf(suggestion.tag)
            if (index > -1) {
                // TODO if tag is selected should it also be checked??
                if (!checkedTags.value.includes(index))
                    checkedTags.value.push(index)
            }
        }
    }

    // find and remove all tags from checkedTags for which there is no entry in selectedSearchSuggestions
    const toRemove = checkedTags.value.filter(tag => !searchSuggestions.map(suggestion => suggestion.tag).includes(allTags.value[tag]))
    for (const tag of toRemove) {
        checkedTags.value.splice(checkedTags.value.indexOf(tag), 1)
    }
}

watch(selectedSearchSuggestions, (newValue, oldValue) => {
    console.log('selectedSearchSuggestions', newValue, oldValue)
    // make sure that any entries in the newValue array of type tag are included in checkTags (but first find their index in availableTags)
    synchronizeSelectedSearchSuggestionsToCheckedTags(newValue)
})

watch(checkedTags, (newValue, oldValue) => {
    const tags = checkedTags.value.map(tag => allTags.value[tag])
    selectedSearchSuggestions.value = selectedSearchSuggestions.value.filter(suggestion => tags.includes(suggestion.tag) || suggestion.type == 'expertise') // remove suggestions for which the tag is no longer selected

    // find all tags for which there is no entry in selectedSearchSuggestions
    const newTags = tags.filter(tag => !selectedSearchSuggestions.value.map(suggestion => suggestion.tag).includes(tag))
    // add entries to selectSearchSuggestions for new checked tags 
    if (newTags.length > 0) {
        for (const tag of newTags) {
            selectedSearchSuggestions.value.push({ name: tag, type: 'tag', tag: tag })
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

    if (e.type == 'expertise') {
        expertiseToEditClaimsFor.value = e.expertise
        editExpertiseClaimsDialog.value = true
    }
    if (e.type == 'expertiseClaim') {
        expertiseClaimToEdit.value = e.claim
        openExpertiseClaimDialog.value = true
    }

}

const handleShowExpertiseDetailsRequested = (expertise) => {
    console.log('handleShowExpertiseDetailsRequested - show popup with expertise details', expertise)
    if (expertise.organization) {
        console.log('details for org', expertise.organization)
        organizationToShow.value = expertise.organization
        organizationDialog.value = true
    } else { // details for expertise
        generateExpertiseDialog(expertise.expertise)
    }
}


const handleSearchChange = (e) => {
    // console.log('new search on ', search.value, e)
    // console.log(selectedSearchSuggestions.value, searchSuggestions.value)
    // // find all expertises (lower case) who contain the search string
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

        const filteredTags = allTags.value.filter(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
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
                if (claim.expertise.tags && claim.expertise.tags.length > 0) {
                    for (const tag of claim.expertise.tags) {
                        if (!tagClaimMap[tag]) {
                            tagClaimMap[tag] = { total: claim.count, companyCount: 1, expertise: [{ expertise: claim.expertise, count: claim.count }] }
                        } else {
                            tagClaimMap[tag].total += claim.count
                            tagClaimMap[tag].companyCount++
                            tagClaimMap[tag].expertise.push({ expertise: claim.expertise, count: claim.count })
                        }
                    }
                }
            }
        }
    }
}


const expertiseStructure = ref(null)

const tagHasExpertise = (tag) => {
    let hasExpertise = false
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[tag]
    if (expertisesUnderTag) {
        let countForTag = 0;
        for (const expertise of expertisesUnderTag) {
            const e = expertiseClaimMap.value[expertise.id]
            if (e) {
                if (e.total > 0) {
                    hasExpertise = true
                    break
                }
            }
        }
    }
    return hasExpertise
}
const initializeExpertiseStructureForTag = (tag) => {
    //const expertiseStructure = ref(null)
    const expertiseStructure = {
        name: tag, count: 0,
        children: [], readOnly: true
    }
    // loop over all expertises in tag
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[tag]
    if (expertisesUnderTag) {
        let countForTag = 0;
        for (const expertise of expertisesUnderTag) {
            const e = expertiseClaimMap.value[expertise.id]
            if (e) {
                const node = { name: expertise.name, children: [], count: e.total, type: 'expertise', expertise: expertise, logo: expertise.logoURL, readOnly: appStore.getReadOnly() }
                countForTag += ensureNumeric(e.total)
                expertiseStructure.children.push(node)
                for (const claim of e.expertise) {
                    const orgNode = {
                        name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization
                        , logo: companyLogos[claim.organization.name], claim: claim, readOnly: appStore.getReadOnly(), ambition: claim.ambition

                    }
                    node.children.push(orgNode)
                }
                node.children.sort((a, b) => {
                    return b.count - a.count
                })
            }
            // else no claims for this expertise, not currently available in the ecosystem; include a node for this expertise?
            else if (showZeroCountExpertise.value) {
                const node = { name: expertise.name, children: [], count: 0, type: 'expertise', expertise: expertise }
                expertiseStructure.children.push(node)
            }
        }
        expertiseStructure.count = countForTag
        expertiseStructure.children.sort((a, b) => {
            return b.count - a.count
        })
    }
    return expertiseStructure
}

const initializeExpertiseStructureForExpertise = (expertise) => {
    const expertiseStructure = {
        name: expertise.name, count: 0,
        children: [], expertise: expertise, type: 'expertise', logo: expertise.logoURL, readOnly: appStore.getReadOnly()
    }
    const e = expertiseClaimMap.value[expertise.id]
    if (e) {
        expertiseStructure.count = e.total
        for (const claim of e.expertise) {
            const orgNode = {
                name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization
                , logo: companyLogos[claim.organization.name], claim: claim, readOnly: appStore.getReadOnly(), ambition: claim.ambition
            }
            expertiseStructure.children.push(orgNode)
        }
        expertiseStructure.children.sort((a, b) => {
            return b.count - a.count
        })
    }

    return expertiseStructure
}


onMounted(() => {
    allTags.value = [...appStore.expertiseTags]
    buildExpertiseClaimMap()
    if (props.initialTag) {
        selectedSearchSuggestions.value.push({ name: props.initialTag, type: 'tag', tag: props.initialTag })
        synchronizeSelectedSearchSuggestionsToCheckedTags(selectedSearchSuggestions.value)
    }
    if (props.initialExpertise) {
        const ex = appStore.getExpertise().value.expertise
        const expertise = appStore.getExpertise().value.expertise.find(e => e.id === props.initialExpertise)
        if (expertise) selectedSearchSuggestions.value.push({ name: expertise.name, expertise: expertise, type: 'expertise' })
    }
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
            if (!claim.organization.expertiseClaims) claim.organization.expertiseClaims = []
            claim.organization.expertiseClaims.push(newClaim)
        } else {
            claim.originalClaim.count = ensureNumeric(claim.count)
            claim.originalClaim.notes = claim.notes
            claim.originalClaim.author = claim.author
            claim.originalClaim.ambition = claim.ambition
            claim.originalClaim.asOf = claim.asOf
        }
    }

    buildExpertiseClaimMap()
    changeIndicator.value++

}

const handleShowExpertiseMapRequested = (expertise) => {
    console.log('handleShowExpertiseMapRequested', expertise)
    if (expertise.type === 'expertiseClaim')
        router.push({ name: 'organizationExpertise', params: { organizationId: expertise.organization.id } })
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