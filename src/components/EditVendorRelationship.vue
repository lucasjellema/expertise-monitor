<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Edit {{ vendorRelationshipToEdit.title }} - {{ vendorRelationshipToEdit.vendor?.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-select v-model="vendorRelationshipToEdit.vendor" :items="vendors" return-object
                                        item-title="name" item-value="id" label="Kies een leverancier"
                                        v-if="vendorRelationshipToEdit.new" />
                                    <v-text-field label="Title" v-model="vendorRelationshipToEdit.title"></v-text-field>
                                    <v-textarea label="Description"
                                        v-model="vendorRelationshipToEdit.description"></v-textarea>


                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7">

                                    <v-text-field label="From year" type="number" v-model="fromYear" :rules="[
                                        v => v >= 1980 || 'Year must be greater than 1980',
                                        v => v <= 2030 || 'Year must be less than 2030']"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-select v-model="fromMonth" :items="months" item-value="index" label="Month" dense
                                        hint="From which month in the selected year is this relationship confirmed"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7">
                                    <v-text-field label="Until year" type="number" v-model="untilYear" :rules="[
                                        v => v >= 1980 || 'Year must be greater than 1980',
                                        v => v <= 2030 || 'Year must be less than 2030']"></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-select v-model="untilMonth" :items="months" item-value="index" label="Month"
                                        dense
                                        hint="Until which month in the selected year did/does this relationship continue"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <p v-if="vendorRelationshipToEdit.from">Vanaf: {{
                                        formatMonthYear(vendorRelationshipToEdit.from)
                                    }}</p>
                                    <p v-if="vendorRelationshipToEdit.until">Tot: {{
                                        formatMonthYear(vendorRelationshipToEdit.until)
                                    }}</p>
                                    <br />

                                    {{ vendorRelationshipToEdit.vendor?.description }}
                                    <br />
                                    <p v-if="vendorRelationshipToEdit.vendor?.homepage">Details: <a
                                            :href="vendorRelationshipToEdit.vendor?.homepage" target="_blank">web
                                            site</a></p>
                                    <v-img :src="vendorRelationshipToEdit.vendor?.logoUrl" height="200"
                                        v-if="vendorRelationshipToEdit.vendor?.logoUrl"></v-img>

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
    vendorRelationship: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['vendorRelationshipChanged'])

import { useAppStore } from "@/stores/app";
const appStore = useAppStore()
import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();
const vendorRelationshipToEdit = ref({ ...props.vendorRelationship })

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

const fromMonth = ref(null)
const fromYear = ref(null)
const untilMonth = ref(null)
const untilYear = ref(null)

watch(() =>[fromYear.value, fromMonth.value], ([newFromYear, newFromMonth], [oldFromYear, oldFromMonth]) => {
    if (newFromYear !== null ) {
        const month = fromMonth.value ? months.indexOf(fromMonth.value) + 1 : 1
        vendorRelationshipToEdit.value.from = `${newFromYear - 2000}${month}`
    }
})


watch(() => [untilYear.value, untilMonth.value], ([newUntilYear, newUntilMonth], [oldUntilYear, oldUntilMonth]) => {
    if (newUntilYear !== null ) {
        const month = untilMonth.value ? months.indexOf(untilMonth.value) + 1 : 1
        vendorRelationshipToEdit.value.until = `${newUntilYear - 2000}${month}`
    }
})

watch(() => vendorRelationshipToEdit
    , async (newValue, oldValue) => {
        console.log("edit vendorRelationship vendorRelationship changed", newValue)
        vendorRelationshipToEdit.value.vendorId = newValue.value.vendor.id

        emit('vendorRelationshipChanged', newValue)
    }, { deep: true })




onMounted(() => {
    if (vendorRelationshipToEdit.value?.from) {
        fromYear.value = 2000 + ensureNumeric(vendorRelationshipToEdit.value.from.substring(0, 2))
        fromMonth.value = months[vendorRelationshipToEdit.value.from.substring(2) - 1]
    }
    if (vendorRelationshipToEdit.value?.until) {

        untilYear.value = 2000 + ensureNumeric(vendorRelationshipToEdit.value.until.substring(0, 2))
        untilMonth.value = months[vendorRelationshipToEdit.value.until.substring(2) - 1]
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