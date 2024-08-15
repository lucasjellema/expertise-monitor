<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <v-img :src="companyLogos[organization.name]" height="100"
                            v-if="companyLogos[organization.name]"></v-img>
                        <h1 v-if="!companyLogos[organization.name]">{{ organization.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <p v-if="organization.address"><br /> <br />Adres:
                                        {{ organization.address }}</p>
                                    <p v-if="organization.url">Website: <a :href="organization.url"
                                            target="_blank">{{ organization.url }}</a></p>
                                    <p>Aantal expertiseclaims: {{ organization.expertiseClaims?.length }}</p>
                                    <p>Bijdragen van: {{ uniqueAuthors.join(', ') }}</p>
                                    <p>Meest recente bijdrage: {{ formatMonthYear(maxAsOf) }}</p>


                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>

                                    <v-data-table :headers="partnerTableHeaders" :items="organization.vendorRelations"
                                        :hide-default-footer="true">
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title>Partners</v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-btn color="primary" @click="addVendorRelationship"
                                                    v-if="!appStore.getReadOnly()">Add Vendor</v-btn>
                                            </v-toolbar>
                                        </template>

                                        <template v-slot:item.icon="{ item }">
                                            <v-icon
                                                @click="showVendorRelationshipDetails(item)">mdi-information-outline</v-icon>
                                        </template>
                                        <template v-slot:item.vendor="{ item }">
                                            {{ item.vendor.name }}
                                            <v-img v-if="item.vendor.logoUrl" :src="item.vendor.logoUrl"
                                                max-height="25"></v-img>
                                        </template>
                                        <template v-slot:item.from="{ item }">
                                            {{ formatMonthYear(item.from) }}
                                        </template>
                                        <template v-slot:item.until="{ item }">
                                            {{ formatMonthYear(item.until) }}
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>

                                    <v-data-table :headers="certificationTableHeaders" :items="organization.certifications"
                                        :hide-default-footer="true">
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title>Certifications</v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-btn color="primary" @click="addCertification"
                                                    v-if="!appStore.getReadOnly()">Add Certification</v-btn>
                                            </v-toolbar>
                                        </template>

                                        <template v-slot:item.icon="{ item }">
                                            <v-icon
                                                @click="showCertificationDetails(item)">mdi-information-outline</v-icon>
                                        </template>
                                        <template v-slot:item.vendor="{ item }">
                                            {{ item.vendor.name }}
                                            <v-img v-if="item.vendor.logoUrl" :src="item.vendor.logoUrl"
                                                max-height="25"></v-img>
                                        </template>
                                        <template v-slot:item.asOf="{ item }">
                                            {{ formatMonthYear(item.asOf) }}
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

    <v-dialog width="800" v-model="showVendorRelationship">
        <v-card>
            <v-card-title>
                <v-btn @click="editVendorRelationship = true"
                    v-if="!editVendorRelationship && !appStore.getReadOnly()">Bewerken</v-btn>
                <v-btn @click="saveVendorRelationship" v-if="editVendorRelationship">Opslaan</v-btn>
            </v-card-title>
            <VendorRelationshipDetails :vendorRelationship="vendorRelationshipToShow" v-if="!editVendorRelationship" />
            <EditVendorRelationship :vendorRelationship="vendorRelationshipToShow"
                @vendorRelationshipChanged="handleVendorRelationshipUpdate" v-if="editVendorRelationship" />
        </v-card>
    </v-dialog>
    <v-dialog width="800" v-model="showCertification">
        <v-card>
            <v-card-title>
                <v-btn @click="editCertification = true"
                    v-if="!editCertification && !appStore.getReadOnly()">Bewerken</v-btn>
                <v-btn @click="saveCertification" v-if="editCertification">Opslaan</v-btn>
            </v-card-title>
            <CertificationDetails :certification="certificationToShow" v-if="!editCertification" />
            <EditCertification :certification="certificationToShow"
                @certificationChanged="handleCertificationUpdate" v-if="editCertification" />
        </v-card>
    </v-dialog>

</template>


<script setup>

const props = defineProps({
    organization: {
        type: Object,
        required: true
    }
})

import { useAppStore } from "@/stores/app";
const appStore = useAppStore()
import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();
import { useDateLibrary } from '@/composables/useDateLibrary';
import EditVendorRelationship from './EditVendorRelationship.vue';

const { formatMonthYear } = useDateLibrary();

const showVendorRelationship = ref(false)
const vendorRelationshipToShow = ref(null)

const showVendorRelationshipDetails = (item) => {
    editVendorRelationship.value = false
    showVendorRelationship.value = true
    vendorRelationshipToShow.value = item
}

const editVendorRelationship = ref(false)

const vendorRelationshipInProgress = ref(null)
const handleVendorRelationshipUpdate = (e) => {
    console.log("vendorRelationship updated", e)
    vendorRelationshipInProgress.value = e.value
}

const saveVendorRelationship = () => {
    Object.assign(vendorRelationshipToShow.value, vendorRelationshipInProgress.value)
    // TODO if new, add to list 
    if (vendorRelationshipToShow.value.new) {
        delete vendorRelationshipToShow.value.new
        props.organization.vendorRelations.push(vendorRelationshipToShow.value)
    }
    showVendorRelationship.value = false
    editVendorRelationship.value = false
}

const addVendorRelationship = () => {
    vendorRelationshipToShow.value = {
        title: "Nieuwe partner",
        description: "",
        vendorId: "",
        new: true
    }
    editVendorRelationship.value = true
    showVendorRelationship.value = true
}

const partnerTableHeaders = [
    { title: 'Partner', value: 'vendor', sortable: true },
    { title: 'Titel', value: 'title', sortable: true },
    { title: 'Omschrijving', value: 'description' },
    { title: 'Van', value: 'from', sortable: true },
    { title: 'Tot', value: 'until', sortable: true },
    { title: 'Actions', value: 'icon' }
]


const showCertification = ref(false)
const certificationToShow = ref(null)
const editCertification = ref(false)
const certificationInProgress = ref(null)

const showCertificationDetails = (item) => {
    editCertification.value = false
    showCertification.value = true
    certificationToShow.value = item
}


const certificationTableHeaders = [
    { title: 'Partner', value: 'vendor', sortable: true },
    { title: 'Titel', value: 'title', sortable: true },
    { title: 'Omschrijving', value: 'description' },
    { title: 'Per', value: 'asOf', sortable: true },
    { title: 'Aantal', value: 'count', sortable: true },
    { title: 'Actions', value: 'icon' }
]

const addCertification = () => {
    certificationToShow.value = {
        title: "...",
        description: "",
        vendorId: "",
        count:1,
        new: true
    }
    editCertification.value = true
    showCertification.value = true
}

const handleCertificationUpdate = (e) => {
    console.log("certificate updated", e)
    certificationInProgress.value = e.value
}

const saveCertification = () => {
    Object.assign(certificationToShow.value, certificationInProgress.value)
    // TODO if new, add to list 
    if (certificationToShow.value.new) {
        delete certificationToShow.value.new
        props.organization.certifications.push(certificationToShow.value)
    }
    showCertification.value = false
    editCertification.value = false
}


// create a   computed property for the list of unique authors in the expertise claims for the organization 
const uniqueAuthors = computed(() => {
    const authors = []
    if (props.organization.expertiseClaims)
        for (const ec of props.organization.expertiseClaims) {
            if (!authors.includes(ec.author)) {
                authors.push(ec.author);
            }
        }
    return authors;
})


// create a   computed property for the highest value of asOf in all expertiseClaims
const maxAsOf = computed(() => {
    let max = '001'
    if (props.organization.expertiseClaims)
        for (const ec of props.organization.expertiseClaims) {
            if (ec.asOf) {
                if (ec.asOf > max) {
                    max = ec.asOf
                }
            }
        }
    return max;
})

onMounted(() => {

})



</script>
<style scoped></style>