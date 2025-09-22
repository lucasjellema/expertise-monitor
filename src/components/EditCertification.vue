<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Edit {{ certificationToEdit.title }} - {{ certificationToEdit.vendor?.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-select v-model="certificationToEdit.vendor" :items="vendors" return-object
                                        item-title="name" item-value="id" label="Kies een leverancier"
                                        v-if="certificationToEdit.new" />
                                    <v-text-field label="Certificaat Titel/Aanduiding"
                                        v-model="certificationToEdit.title"></v-text-field>
                                    <v-textarea label="Beschrijving/Toelichting"
                                        v-model="certificationToEdit.description"></v-textarea>
                                        <v-text-field label="Website met certificaat details"
                                        v-model="certification.certificationsDetailsUrl"></v-text-field>
                                        <p v-if="certification.certificationsDetailsUrl">Certification Webpage: <a
                                            :href="certification.certificationsDetailsUrl" target="_blank">web
                                            site</a></p>
                                            <v-text-field label="URL voor Certificaat Logo"
                                        v-model="certification.certificationLogoUrl"></v-text-field>

                                    <v-img :src="certification.certificationLogoUrl" height="200"
                                        v-if="certification.certificationLogoUrl"></v-img>
                                    
                                    <v-text-field label="Aantal" type="number" v-model="certification.count"
                                        title="Hoeveel collega's hebben dit certificaat?"
                                        hint="Aantal gecertificeerde medewerkers"></v-text-field>

                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7">

                                    <v-text-field label="Per" type="number" v-model="asOfYear" :rules="[
                                        v => v >= 1980 || 'Year must be greater than 1980',
                                        v => v <= 2030 || 'Year must be less than 2030']"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-select v-model="asOfMonth" :items="months" item-value="index" label="Month" dense
                                        hint="From which month in the selected year is this relationship confirmed"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <h2>Leverancier/Partner</h2>
                                    {{ certificationToEdit.vendor?.description }}
                                    <br />
                                    <p v-if="certificationToEdit.vendor?.homepage">Details: <a
                                            :href="certificationToEdit.vendor?.homepage" target="_blank">web
                                            site</a></p>
                                    <v-img :src="certificationToEdit.vendor?.logoUrl" height="200"
                                        v-if="certificationToEdit.vendor?.logoUrl"></v-img>

                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>
</template>


<script setup>

const props = defineProps({
    certification: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['certificationChanged'])

import { useAppStore } from "@/stores/app";
const appStore = useAppStore()
import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();
const certificationToEdit = ref({ ...props.certification })

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
const vendors = computed(() => {
    const e = appStore.getExpertise()
    return appStore.getExpertise().value.vendors.sort((a, b) => a.name.localeCompare(b.name))
})

const asOfMonth = ref(null)
const asOfYear = ref(null)

watch(() => [asOfYear.value, asOfMonth.value], ([newasOfYear, newasOfMonth], [oldasOfYear, oldasOdMonth]) => {
    if (newasOfYear !== null) {
        const month = asOfMonth.value ? months.indexOf(asOfMonth.value) + 1 : 1
        certificationToEdit.value.asOf = `${newasOfYear - 2000}${month}`
    }
})



watch(() => certificationToEdit
    , async (newValue, oldValue) => {
        console.log("edit certification certification changed", newValue)
        certificationToEdit.value.vendorId = newValue.value.vendor.id

        emit('certificationChanged', newValue)
    }, { deep: true })




onMounted(() => {
    if (certificationToEdit.value?.asOf) {
        asOfYear.value = 2000 + ensureNumeric(certificationToEdit.value.asOf.substring(0, 2))
        asOfMonth.value = months[certificationToEdit.value.asOf.substring(2) - 1]
    }
})

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