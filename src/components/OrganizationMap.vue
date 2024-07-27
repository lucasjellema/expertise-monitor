<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <div id="app">
                            <OrganizationUnit :unit="orgStructure" @organizationExpertiseRequested="handleOrganizationExpertiseRequested"/>
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
import { useRoute } from 'vue-router';

const router = useRouter()

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();


const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})


const handleOrganizationExpertiseRequested = (organization) => {
    console.log(organization)
    router.push({ name: 'organizationExpertise', params: { organizationId: organization.id } })
}

const addOrganizationChildren = (organizationUnit, organizationNode) => {
    if (organizationUnit.memberOrganizations && organizationUnit.memberOrganizations.length > 0) {
        console.log('has members',organizationUnit)
        for (const member of organizationUnit.memberOrganizations) {
             const newChildOrgNode = { id:member.organization.id , name: member.organization.name, children: [], logo: companyLogos[member.organization.name], organizaton: member.organization }
             addOrganizationChildren(member.organization, newChildOrgNode) 

             organizationNode.children.push(newChildOrgNode)
        }
    }
}
const prepareOrganizationData = () => {
    // loop over props.organization elements and process the ones without organizationMemberships (these are the roots)
    for (const org of props.organization) {
        if (!org.organizationMemberships || org.organizationMemberships.length === 0) {
            const newOrgNode = { id:org.id ,name: org.name, children: [], logo: companyLogos[org.name] }
            addOrganizationChildren(org, newOrgNode) 
            orgStructure.value.children.push(newOrgNode)
        }
    }


}

const orgStructure = ref({
    name: 'Conclusion NL Ecosysteem', logo: companyLogos['Conclusion'],
    children: []

    
})

onMounted(() => {
    prepareOrganizationData()


})



</script>
<style scoped></style>