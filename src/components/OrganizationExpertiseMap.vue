<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">

                        <div id="app">
                            <ExpertiseUnit :unit="expertiseStructure"
                                @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested" />
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

</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const editOrganizationExpertiseDialog = ref(false)
const tagToEditExpertiseFor = ref(null)

const organizationUnit = ref(null)


import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();


const props = defineProps({
    organizationUnit: {
        type: Object,
        required: true
    }
})

const emits = defineEmits(['expertiseChanged'])

const prepareExpertiseClaimData = (expertiseNode, organizationUnit) => {
    buildExpertiseClaimMap(organizationUnit)
    // create childnodes for all tags - and set the count from the tagClaimMap
    const allTags = appStore.expertiseTags
    for (const tag of allTags) {
        const newExpertiseNode = { name: tag, children: [], logo: null, count: 0, type: 'tag' }
        if (tagClaimMap[tag]) {
            newExpertiseNode.count = tagClaimMap[tag].total
            if (tagClaimMap[tag].expertise && tagClaimMap[tag].expertise.length > 0) {
                for (const expertise of tagClaimMap[tag].expertise) {
                    newExpertiseNode.children.push({ name: expertise.expertise.name, children: [], logo: expertise.expertise.logoURL, count: expertise.count, type: 'expertise', expertise: expertise.expertise })
                }
            }
        }
        // TODO check if filter allows inclusion of this tag - depending on the tag, the total and the ( number of) children
        expertiseNode.children.push(newExpertiseNode)
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
                expertiseClaimMap[claim.expertiseId] = claim.count
            } else {
                expertiseClaimMap[claim.expertiseId] = expertiseClaimMap[claim.expertiseId] + claim.count
            }
            if (claim.expertise.tags && claim.expertise.tags.length > 0) {
                for (const tag of claim.expertise.tags) {
                    if (!tagClaimMap[tag]) {
                        tagClaimMap[tag] = { total: claim.count, expertise: [{ expertise: claim.expertise, count: claim.count }] }
                    } else {
                        tagClaimMap[tag].total += claim.count
                        tagClaimMap[tag].expertise.push({ expertise: claim.expertise, count: claim.count })
                    }
                }
            }
        }
    }
    console.log('expertiseClaimMap', expertiseClaimMap)
    console.log('tagClaimMap', tagClaimMap)
}


const expertiseStructure = ref(null)

const initializeExpertiseStructure = () => {
    expertiseStructure.value = {
        name: 'Expertise van ' + organizationUnit.value.name, logo: companyLogos[organizationUnit.value.name], count: 0,
        children: []
    }

    // whenever the filter is changed:

    // prepare claims for all tags (and all expertises that have that tag) that are not disqualified
    // depending on toggle: include tags with no expertise claims

    prepareExpertiseClaimData(expertiseStructure.value, organizationUnit.value)

}

onMounted(() => {
    organizationUnit.value = props.organizationUnit
    initializeExpertiseStructure()

})


const handleEditOrganizationExpertiseRequested = (expertise) => {
    console.log('editOrganizationExpertiseRequested', expertise)

    //TODO handle case of the expertise.type == expertise i/o tag
    if (expertise.type == 'tag') {


        tagToEditExpertiseFor.value = expertise.name
        editOrganizationExpertiseDialog.value = true
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
            } else {
                organizationUnit.value.expertiseClaims.push({ expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise })
            }
        } else {
            if (!organizationUnit.value.expertiseClaims) {
                organizationUnit.value.expertiseClaims=[]
            }
            organizationUnit.value.expertiseClaims.push({ expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise })
        }
    }
    // TODO update the expertiseClaimMap
    // TODO update the expertiseStructure
    // TODO emit the change in the organization unit
    emits('expertiseChanged', organizationUnit.value)
    initializeExpertiseStructure() // question: should we refresh? or leave it to the parent to rerender the child component?
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
<style scoped></style>