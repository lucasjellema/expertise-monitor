<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row >
                    <v-col cols="10" offset="1">

                        <div id="app" >
                            <ExpertiseUnit :unit="initializeExperiseStructure(tag)" v-for="tag in selectedTags" :key="tag"/>
                        </div>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>

</template>


<script setup>

const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const selectedTags = ref (appStore.expertiseTags)
let expertiseClaimMap = {}
let tagClaimMap = {}

// build a map with all expertise claims of all organizations 
const buildExpertiseClaimMap = () => {
    expertiseClaimMap = {}
    tagClaimMap = {}
    for (const org of props.organization) {
        if (org?.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {
                if (!expertiseClaimMap[claim.expertiseId]) {
                    expertiseClaimMap[claim.expertiseId] = { total: ensureNumeric(claim.count), expertise: [{ ...claim, organization: org }] } // claim.count
                } else {
                    expertiseClaimMap[claim.expertiseId].total += ensureNumeric(claim.count)
                    expertiseClaimMap[claim.expertiseId].expertise.push({ ...claim, organization: org })

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
    console.log('expertiseClaimMap', expertiseClaimMap)
    console.log('tagClaimMap', tagClaimMap)
}


const expertiseStructure = ref(null)
const initializeExperiseStructure = (tag) => {
    const expertiseStructure = ref(null)
    expertiseStructure.value = {
        name:  tag, count: 0,
        children: []
    }
    // loop over all expertises in tag
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[tag]
    if (expertisesUnderTag) {
        let countForTag =0;
        for (const expertise of expertisesUnderTag) {
            const e = expertiseClaimMap[expertise.id]
            if (e) {
                const node = { name: expertise.name, children: [], count: e.total, type: 'expertise', expertise: expertise } 
                countForTag += ensureNumeric(e.total) 
                expertiseStructure.value.children.push(node)
                for (const claim of e.expertise) {
                    const orgNode = { name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization:claim.organization }
                    node.children.push(orgNode)
                }
            }
            // else no claims for this expertise, not currently available in the ecosystem; include a node for this expertise?
            else {
                const node = { name: expertise.name, children: [],  count: 0, type: 'expertise', expertise: expertise }
                expertiseStructure.value.children.push(node)
            }
        }
        expertiseStructure.value.count = countForTag
    }
return expertiseStructure.value
}

onMounted(() => {
    buildExpertiseClaimMap()
   // initializeExperiseStructure()

})


// const handleEditOrganizationExpertiseRequested = (expertise) => {
//     console.log('editOrganizationExpertiseRequested', expertise)

//     //TODO handle case of the expertise.type == expertise i/o tag
//     if (expertise.type == 'tag') {


//         tagToEditExpertiseFor.value = expertise.name
//         editOrganizationExpertiseDialog.value = true
//     }

// }

// const handleExpertiseChanged = (newAndUpdatedClaims) => {
//     console.log('newAndUpdatedClaims', newAndUpdatedClaims)
//     editOrganizationExpertiseDialog.value = false // close dialog

//     const organizationHasAnyClaims = organizationUnit.value.expertiseClaims && organizationUnit.value.expertiseClaims.length > 0
//     for (const item of newAndUpdatedClaims) {
//         if (organizationHasAnyClaims) {
//             const existingClaim = organizationUnit.value.expertiseClaims.find(claim => claim.expertiseId === item.expertiseId)
//             // // TODO update timestamp and author
//             if (existingClaim) {
//                 existingClaim.count = ensureNumeric(item.count) // item.count
//                 existingClaim.notes = item.notes
//             } else {
//                 organizationUnit.value.expertiseClaims.push({ expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise })
//             }
//         } else {
//             if (!organizationUnit.value.expertiseClaims) {
//                 organizationUnit.value.expertiseClaims=[]
//             }
//             organizationUnit.value.expertiseClaims.push({ expertiseId: item.expertiseId, count: ensureNumeric(item.count), notes: item.notes, expertise: item.expertise })
//         }
//     }
//     // TODO update the expertiseClaimMap
//     // TODO update the expertiseStructure
//     // TODO emit the change in the organization unit
//     emits('expertiseChanged', organizationUnit.value)
//     initializeExperiseStructure() // question: should we refresh? or leave it to the parent to rerender the child component?
// }

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