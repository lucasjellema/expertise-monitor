<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">

                        <div id="app">
                            <ExpertiseUnit :unit="expertiseStructure" />
                        </div>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>

</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()



//import { useIconsLibrary } from '@/composables/useIconsLibrary';
//const { companyLogos } = useIconsLibrary();


const props = defineProps({
    organizationUnit: {
        type: Object,
        required: true
    }
})

const prepareExpertiseClaimData = (expertiseNode, organizationUnit) => {
    // if (organizationUnit?.expertiseClaims && organizationUnit.expertiseClaims.length > 0) {
    //     for (const claim of organizationUnit?.expertiseClaims) {
    //         const newExpertiseNode = { name: claim.expertiseId, children: [], logo: null, count: 231 }
    //         //addOrganizationChildren(org, newOrgNode) 
    //         expertiseNode.children.push(newExpertiseNode)
    //     }
    // }
    buildExpertiseClaimMap(organizationUnit)
    // create childnodes for all tags - and set the count from the tagClaimMap
    const allTags = appStore.expertiseTags
    for (const tag of allTags) {
        const newExpertiseNode = { name: tag, children: [], logo: null, count: 0 }
        if (tagClaimMap[tag]) {
            newExpertiseNode.count = tagClaimMap[tag].total
            if (tagClaimMap[tag].expertise && tagClaimMap[tag].expertise.length > 0) {
                for (const expertise of tagClaimMap[tag].expertise) {
                    newExpertiseNode.children.push({ name: expertise.expertise.name, children: [], logo: null, count: expertise.count })
                }
            }
        }
        expertiseNode.children.push(newExpertiseNode)
    
    }}

let expertiseClaimMap = {}
    let tagClaimMap = {}

// build a map with all expertise claims of the organization and its children
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
                        tagClaimMap[tag] = {total: claim.count, expertise: [{expertise: claim.expertise, count: claim.count}]}
                    } else {
                        tagClaimMap[tag].total +=  claim.count
                        tagClaimMap[tag].expertise.push( {expertise: claim.expertise, count: claim.count})
                    }
                }
            }
        }
    }
    console.log('expertiseClaimMap', expertiseClaimMap)
    console.log('tagClaimMap', tagClaimMap)
}


const expertiseStructure = ref(null)

onMounted(() => {
    
    expertiseStructure.value = {
        name: 'Expertise van ' + props.organizationUnit.name, logo: null, count: 817,
        children: []
    }

    // whenever the filter is changed:

    // prepare claims for all tags (and all expertises that have that tag) that are not disqualified
    // depending on toggle: include tags with no expertise claims

    prepareExpertiseClaimData(expertiseStructure.value, props.organizationUnit)


})



</script>
<style scoped></style>