<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="11" >
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <OrganizationMap :organization="props.organization" />
                                    </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-data-table :headers="organizationHeaders" :items="props.organization" :search="search">
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title>Conclusion Organizations</v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-text-field v-model="search" density="compact" label="Search"
                                                    prepend-inner-icon="mdi-magnify" variant="solo-filled" flat
                                                    hide-details single-line></v-text-field>
                                                <!-- <v-spacer></v-spacer>
                                                <v-btn color="primary" @click="addExpertise">Add Expertise</v-btn> -->
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:item.name="{ item, index }">
                                            <v-btn prepend-icon="mdi-dots-horizontal" text
                                                @click="generateOrganizationDialog(item)">{{ item.name }}</v-btn>
                                        </template>
                                        <template v-slot:item.details="{ item, index }">
                                            <v-icon 
                                                @click="organizationExpertise(item)">mdi-school</v-icon>
                                            
                                        </template>
                                        <template v-slot:item.url="{ item, index }">
                                            <a :href="item.url" target="_blank">web site</a>
                                        </template>
                                        <template v-slot:item.organizationMemberships="{ item, index }">
                                            <div v-if="item.organizationMemberships?.length > 0">
                                                <v-chip v-for="org in item.organizationMemberships" class="ma-2" size="small">
                                                    {{ org.description }} {{ org.organization?.name }}
                                                </v-chip>
                                            </div>
                                        </template>
                                        <template v-slot:item.logoURL="{ item, index }">
                                            <v-img :src="companyLogos[item.name]" height="50"></v-img>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>
    <v-dialog v-model="organizationDialog" width="1000" @afterLeave="editOrganization = false">
        <v-card>
            <v-card-title>
                <v-btn @click="goEditOrganization" v-if="!editOrganization && !appStore.getReadOnly()">Bewerken</v-btn>
                <v-btn @click="saveOrganization" v-if="editOrganization">Opslaan</v-btn>
            </v-card-title>
            <OrganizationDetails :organization="organizationToShow" v-if="!editOrganization" />
            <EditOrganization :organization="organizationInProgress" @organizationChanged="handleOrganizationUpdate"
                v-if="editOrganization" />
        </v-card>
    </v-dialog>

</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter()


import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();

const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})
const search = ref('')
const organizationToShow = ref(null)
const organizationDialog = ref(false)
const generateOrganizationDialog = (organization) => {
    organizationToShow.value = { ...organization }
    organizationDialog.value = true
}
const editOrganization = ref(false)

const organizationInProgress = ref(null)
const handleOrganizationUpdate = (e) => {
    console.log("organization updated", e)
    organizationInProgress.value = e.value
}


const goEditOrganization = () => {
    editOrganization.value = true
    organizationInProgress.value ={...organizationToShow.value}
}
const saveOrganization = () => {
    editOrganization.value = false
    organizationDialog.value = false
    appStore.saveOrganization(organizationInProgress.value)
}

const organizationExpertise = (organization) => {
    console.log(organization)
    router.push({ name: 'organizationExpertise', params: { organizationId: organization.id } })
}

const organizationHeaders = [
    {
        title: 'Name',
        key: 'name'
    }, { title: 'Expertise', key: 'details', sortable: false }
    , { title: 'Type', key: 'type', sortable: true }
    , { title: 'Onderdeel van', key: 'organizationMemberships' }
    , { title: 'Logo', key: 'logoURL', sortable: false }

]

onMounted(() => {

})



</script>
<style scoped></style>