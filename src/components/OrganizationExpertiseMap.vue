<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                            @click:clear="clearSearch" @change="handleSearchChange" @keyup="handleSearchChange"
                            clearable></v-text-field>

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
                        <v-checkbox v-model="showZeroCountTags" label="Show tags without any expertise in company" dense
                            hide-details class="mt-0" />
                        <div id="app">
                            <ExpertiseUnit :unit="expertiseStructure" v-if="selectedSearchSuggestions.length == 0"
                                @showExpertiseMapRequested="handleShowExpertiseMapRequested"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested"
                                @showExpertiseDetailsRequested="handleShowExpertiseDetailsRequested" />

                            <ExpertiseUnit v-if="selectedSearchSuggestions.length > 0"
                                :unit="suggestion.type == 'expertise' ? initializeExpertiseStructureForExpertise(suggestion.expertise) : initializeExpertiseStructureForTag(suggestion.tag)"
                                v-for="suggestion in selectedSearchSuggestions" :key="changeIndicator"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested"
                                @showExpertiseMapRequested="handleShowExpertiseMapRequested" 
                                @showExpertiseDetailsRequested="handleShowExpertiseDetailsRequested"/>
                        </div>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>
    <v-dialog v-model="editOrganizationExpertiseDialog" width="1400">
        <v-card>
            <v-card-title>
                <!-- <v-btn @click="saveOrganizationExpertise">Opslaan</v-btn> -->
            </v-card-title>
            <EditOrganizationMultiExpertise :organizationUnit="organizationUnit" :tag="tagToEditExpertiseFor"
                @expertiseChanged="handleExpertiseChanged" />
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
</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()
import { useRouter } from 'vue-router'
const router = useRouter()

const editOrganizationExpertiseDialog = ref(false)
const tagToEditExpertiseFor = ref(null)

const organizationUnit = ref(null)
const openExpertiseClaimDialog = ref(false)
const expertiseClaimToEdit = ref(null)

const expertiseToShow = ref(null)
const expertiseDialog = ref(false)
const generateExpertiseDialog = (expertise) => {
    expertiseToShow.value = { ...expertise }
    expertiseDialog.value = true
}
const editExpertise = ref(false)
const handleShowExpertiseDetailsRequested = (expertise) => {
    console.log('handleShowExpertiseDetailsRequested - show popup with expertise details', expertise)
    generateExpertiseDialog(expertise.expertise)
}

import { useIconsLibrary } from '@/composables/useIconsLibrary';
import { readonly } from "vue";
const { companyLogos } = useIconsLibrary();
const changeIndicator = ref(0)

const props = defineProps({
    organizationUnit: {
        type: Object,
        required: true
    }
})

const emits = defineEmits(['expertiseChanged'])
const showZeroCountTags = ref(false)


watch(showZeroCountTags, async (newValue, oldValue) => {
    await initializeExpertiseStructure()
})

const search = ref('')
const searchSuggestions = ref([])
const selectedSearchSuggestions = ref([])
const searchSuggestionSelect = ref(null)
const allTags = ref([])

const removeItem = (item, index) => {
    selectedSearchSuggestions.value.splice(index, 1)
    if (selectedSearchSuggestions.value.length == 0) {
        console.log('selectedSearchSuggestions has been cleared')
        initializeExpertiseStructure()
    }
}

const clearSearch = () => {
    search.value = ''
}
watch(selectedSearchSuggestions, (newValue, oldValue) => {
    if (oldValue.length > 0 && newValue.length == 0) {
        console.log('selectedSearchSuggestions has been cleared')
        initializeExpertiseStructure()
    }
})
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

        const filteredTags = allTags.value.filter(tag => tag.toLowerCase().includes(search.value.toLowerCase()))

        if (filteredTags.length > 0) {
            searchSuggestions.value = searchSuggestions.value.concat(filteredTags.map(tag => { return { name: tag, type: 'tag', tag: tag } }))
        }

        searchSuggestionSelect.value.menu = true
    }

}

const initializeExpertiseStructureForExpertise = (expertise) => {
    const expertiseStructure = {
        name: expertise.name, count: 0,
        children: [], expertise: expertise, type: 'expertiseClaim', logo: expertise.logoURL, readOnly: appStore.getReadOnly()
    }
    const e = expertiseClaimMap[expertise.id]
    if (e) {
        expertiseStructure.count = e.count
        expertiseStructure.claim = e.claim
        expertiseStructure.ambition = e.claim.ambition

    }

    return expertiseStructure
}

const initializeExpertiseStructureForTag = (tag) => {
    const newExpertiseNode = { name: tag, children: [], logo: null, count: 0, type: 'tag', readOnly: appStore.getReadOnly() }
    if (tagClaimMap[tag]) {
        newExpertiseNode.count = tagClaimMap[tag].total
        if (tagClaimMap[tag].expertise && tagClaimMap[tag].expertise.length > 0) {
            for (const expertise of tagClaimMap[tag].expertise) {
                newExpertiseNode.children.push({
                    name: expertise.expertise.name, children: []
                    , logo: expertise.expertise.logoURL, count: expertise.count, type: 'expertiseClaim', expertise: expertise.expertise
                    , claim: expertise.claim, readOnly: appStore.getReadOnly(), ambition: expertise.claim.ambition
                })
            }
            newExpertiseNode.children.sort((a, b) => {
                return b.count - a.count
            })
        }
    }

    return newExpertiseNode
}


const prepareExpertiseClaimData = (expertiseNode, organizationUnit) => {
    buildExpertiseClaimMap(organizationUnit)
    // create childnodes for all tags - and set the count from the tagClaimMap
    let tagsToProcess
    if (selectedSearchSuggestions.value.length > 0) {
        tagsToProcess = selectedSearchSuggestions.value.filter(suggestion => suggestion.type === 'tag').map(suggestion => suggestion.tag)

    } else {
        tagsToProcess = allTags.value
    }


    for (const tag of tagsToProcess) {
        const newExpertiseNode = { name: tag, children: [], logo: null, count: 0, type: 'tag', readOnly: appStore.getReadOnly() }
        if (tagClaimMap[tag]) {
            newExpertiseNode.count = tagClaimMap[tag].total
            if (tagClaimMap[tag].expertise && tagClaimMap[tag].expertise.length > 0) {
                for (const expertise of tagClaimMap[tag].expertise) {
                    newExpertiseNode.children.push({ name: expertise.expertise.name, children: [], logo: expertise.expertise.logoURL
                        , count: expertise.count, type: 'expertiseClaim', expertise: expertise.expertise
                        , claim: expertise.claim, readOnly: appStore.getReadOnly(), ambition: expertise.claim.ambition })
                }
                newExpertiseNode.children.sort((a, b) => {
                    return b.count - a.count
                })
            }
        }
        // check if filter allows inclusion of this tag - depending on the tag, the total and the ( number of) children
        if (newExpertiseNode.count > 0 || showZeroCountTags.value) {
            expertiseNode.children.push(newExpertiseNode)
        }
    }
    // sort 
    expertiseNode.children.sort((a, b) => {
        return b.count - a.count
    })
}

let expertiseClaimMap = {}
let tagClaimMap = {}


const buildExpertiseClaimMap = (organizationUnit) => {
    expertiseClaimMap = {}
    tagClaimMap = {}
    if (organizationUnit?.expertiseClaims && organizationUnit.expertiseClaims.length > 0) {
        for (const claim of organizationUnit?.expertiseClaims) {
            if (!expertiseClaimMap[claim.expertiseId]) {
                expertiseClaimMap[claim.expertiseId] = { count: ensureNumeric(claim.count), claim: claim }
            } else {
                console.error('Duplicate Expertise Claim for expertise ' + claim.expertiseId)
                expertiseClaimMap[claim.expertiseId].count += ensureNumeric(claim.count)
            }
            if (!claim.expertise) {
                const E = appStore.getExpertise()
                const Exp = E.value.expertise
                claim.expertise = Exp.find(e => e.id === claim.expertiseId)
            }
            if (claim.expertise.tags && claim.expertise.tags.length > 0) {
                for (const tag of claim.expertise.tags) {
                    if (!tagClaimMap[tag]) {
                        tagClaimMap[tag] = { total: ensureNumeric(claim.count), expertise: [{ expertise: claim.expertise, count: ensureNumeric(claim.count), claim: claim, ambition: claim.ambition }] }
                    } else {
                        tagClaimMap[tag].total += claim.count
                        tagClaimMap[tag].expertise.push({ expertise: claim.expertise, count: ensureNumeric(claim.count), claim: claim, ambition: claim.ambition })
                    }
                }
            }
        }
    }
}


const expertiseStructure = ref(null)

const initializeExpertiseStructure = () => {
    expertiseStructure.value = {
        name: 'Expertise van ' + organizationUnit.value.name, logo: companyLogos[organizationUnit.value.name], count: null,
        children: [], readOnly: true
    }

    // whenever the filter is changed:

    // prepare claims for all tags (and all expertises that have that tag) that are not disqualified
    // depending on toggle: include tags with no expertise claims

    prepareExpertiseClaimData(expertiseStructure.value, organizationUnit.value)

}

onMounted(() => {
    allTags.value = [...appStore.expertiseTags]
    organizationUnit.value = props.organizationUnit
    initializeExpertiseStructure()

})

const handleShowExpertiseMapRequested = (e) => {
    console.log('handleShowExpertiseMapRequested', e)
    if (e.type == 'tag') {
        router.push({ name: 'expertiseBrowseTag', params: { tag: e.name } });
    } else if (e.type == 'expertise' || e.type == 'expertiseClaim') {
        router.push({ name: 'expertiseBrowseSpecific', params: { expertiseId: e.expertise.id } });

    }
}


const handleEditOrganizationExpertiseRequested = (expertise) => {
    console.log('editOrganizationExpertiseRequested', expertise)

    //TODO handle case of the expertise.type == expertise i/o tag
    if (expertise.type == 'tag') {


        tagToEditExpertiseFor.value = expertise.name
        editOrganizationExpertiseDialog.value = true
    } else if (expertise.type == 'expertise' || expertise.type == 'expertiseClaim') {
        expertiseClaimToEdit.value = expertise.claim || { expertise: expertise }
        expertiseClaimToEdit.value.organization = props.organizationUnit
        openExpertiseClaimDialog.value = true
    }

}

const handleExpertiseChanged = (newAndUpdatedClaims) => {
    console.log('newAndUpdatedClaims', newAndUpdatedClaims)
    editOrganizationExpertiseDialog.value = false // close dialog

    const organizationHasAnyClaims = organizationUnit.value.expertiseClaims && organizationUnit.value.expertiseClaims.length > 0
    for (const item of newAndUpdatedClaims) {
        if (organizationHasAnyClaims) {
            const existingClaim = organizationUnit.value.expertiseClaims.find(claim => claim.expertiseId === item.expertiseId)
            // // TODO update timestamp and author
            if (existingClaim) {
                existingClaim.count = ensureNumeric(item.count) // item.count
                existingClaim.notes = item.notes
                existingClaim.author = item.author
                existingClaim.ambition = item.ambition
                existingClaim.asOf = item.asOf

            } else {
                organizationUnit.value.expertiseClaims.push({
                    expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise,
                    author: item.author,
                    ambition: item.ambition,
                    asOf: item.asOf
                })
            }
        } else {
            if (!organizationUnit.value.expertiseClaims) {
                organizationUnit.value.expertiseClaims = []
            }
            organizationUnit.value.expertiseClaims.push({
                expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise,
                author: item.author,
                ambition: item.ambition,
                asOf: item.asOf
            })
        }
    }
    // TODO update the expertiseClaimMap
    // TODO update the expertiseStructure
    // TODO emit the change in the organization unit
    emits('expertiseChanged', organizationUnit.value)
    initializeExpertiseStructure() // question: should we refresh? or leave it to the parent to rerender the child component?
    changeIndicator.value++
}

const handleSingleExpertiseClaimChanged = (expertiseClaim) => {
    openExpertiseClaimDialog.value = false
    console.log('handleSingleExpertiseClaimChanged', expertiseClaim)
    let theClaim
    if (expertiseClaimToEdit.value.organization.expertiseClaims) {
        theClaim = expertiseClaimToEdit.value.organization.expertiseClaims.find(claim => claim.expertiseId === expertiseClaim.expertise.id)
    }
    // update existing claim from expertiseClaim
    if (!theClaim) {
        // create new claim
        theClaim = {
            expertiseId: expertiseClaim.expertise.expertise.id,
            expertise: expertiseClaim.expertise.expertise
        }
        if (!expertiseClaim.organization.expertiseClaims) {
            expertiseClaim.organization.expertiseClaims = []
        }
        expertiseClaim.organization.expertiseClaims.push(theClaim)
    }

    if (theClaim) {
        console.log(`found existing claim`, theClaim)
        theClaim.count = ensureNumeric(expertiseClaim.count)
        theClaim.notes = expertiseClaim.notes
        theClaim.author = expertiseClaim.author
        if (expertiseClaim.asOf) {
            theClaim.asOf = expertiseClaim.asOf
        }
        theClaim.ambition = expertiseClaim.ambition

        emits('expertiseChanged', organizationUnit.value)
        initializeExpertiseStructure() // question: should we refresh? or leave it to the parent to rerender the child component?
        changeIndicator.value++
    }
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