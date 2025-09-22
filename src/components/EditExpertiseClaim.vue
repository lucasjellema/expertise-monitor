<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Expertise on {{ claim.expertise.name }} in {{ claim.organization.type }} {{
                            claim.organization.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-btn color="primary" @click="saveChanges" class="mb-4">Save Changes</v-btn>
                                    <v-text-field v-model="claim.count" label="Count"></v-text-field>
                                    <v-text-field v-model="claim.notes" label="Notes"></v-text-field>
                                    <v-radio-group v-model="claim.ambition" row mandatory inline label="Ambition"
                                        hint="Outlook of company regarding this expertise">

                                        <v-radio value="-1">
                                            <template v-slot:label>
                                                <v-icon>{{ ambitionIconMap[-1] }}</v-icon>Deprecate
                                            </template>
                                        </v-radio>
                                        <v-radio value="0">
                                            <template v-slot:label>
                                                <v-icon>{{ ambitionIconMap[0] }}</v-icon>No Focus
                                            </template>
                                        </v-radio>
                                        <v-radio value="1">
                                            <template v-slot:label>
                                                <v-icon>{{ ambitionIconMap[1] }}</v-icon>Maintain
                                            </template>
                                        </v-radio>
                                        <v-radio value="2">
                                            <template v-slot:label>
                                                <v-icon>{{ ambitionIconMap[2] }}</v-icon>Grow
                                            </template>

                                        </v-radio>
                                        <v-radio value="3">
                                            <template v-slot:label>
                                                <v-icon>{{ ambitionIconMap[3] }}</v-icon>Explore
                                            </template>

                                        </v-radio>
                                    </v-radio-group>
                                    <v-text-field v-model="claim.author" label="Author"></v-text-field>

                                    
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7">
                                    {{ asOfYear }} {{ asOfMonth }}
                                    <v-radio-group v-model="asOfYear" row mandatory inline dense label="As of year"
                                        hint="Expertise present in this year">
                                        <v-radio v-for="year in [2023, 2024, 2025, 2026, 2027]" :key="year"
                                            :value="year">
                                            <template v-slot:label>
                                                {{ year }}
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="5">
                                    <v-select v-model="asOfMonth" :items="months" item-value="index" label="Month" dense
                                        hint="From which month in the selected year is this expertise assessment"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div v-if="claim.expertise.tags?.length > 0">
                                        <v-chip v-for="tag in claim.expertise.tags" class="ma-2" size="small">
                                            {{ tag }}
                                        </v-chip>
                                    </div>
                                    <v-img :src="claim.expertise.logoURL" height="100"
                                        v-if="claim.expertise.logoURL"></v-img>
                                    <v-img :src="companyLogos[claim.organization.name]" height="100"></v-img>
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
    expertiseClaim: {
        type: Object,
        required: true
    }
})

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
const emits = defineEmits(['singleExpertiseClaimChanged'])

const claim = ref({ ...props.expertiseClaim })

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos, ambitionIconMap } = useIconsLibrary();

const asOfMonth = ref(null)
const asOfYear = ref(null)

onMounted(() => {
    if (claim.value.asOf) {
        asOfYear.value = 2000 + ensureNumeric(claim.value.asOf.substring(0, 2))
        asOfMonth.value = months[claim.value.asOf.substring(2) - 1]
    }
    console.log(claim.value)

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


const saveChanges = () => {
    if (asOfYear.value) {
        const month = asOfMonth.value ? months.indexOf(asOfMonth.value) + 1 : 1
        claim.value.asOf = `${asOfYear.value - 2000}${month}`
    }


    emits('singleExpertiseClaimChanged', claim.value)
}

</script>
<style scoped></style>