<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">

                        <div id="app">
                            <OrganizationUnit :unit="orgStructure" />
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

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();


const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})

const addOrganizationChildren = (organizationUnit, organizationNode) => {
    if (organizationUnit.memberOrganizations && organizationUnit.memberOrganizations.length > 0) {
        console.log('has members',organizationUnit)
        for (const member of organizationUnit.memberOrganizations) {
             const newChildOrgNode = { name: member.organization.name, children: [], logo: companyLogos[member.organization.name], organizaton: member.organization }
             addOrganizationChildren(member.organization, newChildOrgNode) 

             organizationNode.children.push(newChildOrgNode)
        }
    }
}
const prepareOrganizationData = () => {
    // loop over props.organization elements and process the ones without organizationMemberships (these are the roots)
    for (const org of props.organization) {
        if (!org.organizationMemberships || org.organizationMemberships.length === 0) {
            const newOrgNode = { name: org.name, children: [], logo: companyLogos[org.name] }
            addOrganizationChildren(org, newOrgNode) 
            orgStructure.value.children.push(newOrgNode)
        }
    }


}

const orgStructure = ref({
    name: 'Conclusion NL Ecosysteem', logo: companyLogos['Conclusion'],
    children: [
        {
            name: 'Division 1',
            children: [
                {
                    name: 'Department 1',
                    children: [
                        { name: 'Team 1', children: [] },
                        { name: 'Team 2', children: [] },
                        { name: 'Team 3', children: [] },
                    ],
                },
                {
                    name: 'Department 2',
                    children: [
                        { name: 'Team 4', children: [] },
                        { name: 'Team 5', children: [] },
                        { name: 'Team 6', children: [] },
                    ],
                },
            ],
        },
        {
            name: 'Division 2',
            children: [
                {
                    name: 'Department 3',
                    children: [
                        { name: 'Team 7', children: [] },
                        { name: 'Team 8', children: [] },
                        { name: 'Team 9', children: [] },
                    ],
                },
                {
                    name: 'Department 4',
                    children: [
                        { name: 'Team 10', children: [] },
                        { name: 'Team 11', children: [] },
                        { name: 'Team 12', children: [] },
                    ],
                },
            ],
        },
    ],
})

onMounted(() => {
    prepareOrganizationData()


})



</script>
<style scoped></style>