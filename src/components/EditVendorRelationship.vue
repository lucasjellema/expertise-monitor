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
                                    <p>{{ vendorRelationshipToEdit.description }}</p>
                                    <v-text-field label="Title" v-model="vendorRelationshipToEdit.title"></v-text-field>
                                    <v-textarea label="Description"
                                        v-model="vendorRelationshipToEdit.description"></v-textarea>
                                    <v-text-field label="Van" type="date"
                                        v-model="vendorRelationshipToEdit.from"></v-text-field>
                                    <v-text-field label="Tot" type="date"
                                        v-model="vendorRelationshipToEdit.until"></v-text-field>


                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7">
                                    {{ fromYear }} {{ fromMonth }}
                                    <v-radio-group v-model="fromYear" row mandatory inline dense label="From year"
                                        hint="Partner relationship starts in this year">
                                        <v-radio v-for="year in [2023, 2024, 2025, 2026, 2027]" :key="year"
                                            :value="year">
                                            <template v-slot:label>
                                                {{ year }}
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="5">
                                    <v-select v-model="fromMonth" :items="months" item-value="index" label="Month" dense
                                        hint="From which month in the selected year is this relationship confirmed"></v-select>
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
                                    <v-select v-model="vendorRelationshipToEdit.vendor" :items="vendors" return-object
                                        item-title="name" item-value="id" label="Kies een leverancier"
                                        v-if="vendorRelationshipToEdit.new" />
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


const vendors = computed(() => {
    const e = appStore.getExpertise()
    return appStore.getExpertise().value.vendors.sort((a, b) => a.name.localeCompare(b.name))
})
watch(() => vendorRelationshipToEdit
    , async (newValue, oldValue) => {
        console.log("edit vendorRelationship vendorRelationship changed", newValue)
        vendorRelationshipToEdit.value.vendorId = newValue.value.vendor.id
        emit('vendorRelationshipChanged', newValue)
    }, { deep: true })

const fromMonth = ref(null)
const fromYear = ref(null)
const untilMonth = ref(null)
const untilfYear = ref(null)


onMounted(() => {
    if (vendorRelationshipToEdit.value?.from) {
        fromYear.value = 2000 + ensureNumeric(vendorRelationshipToEdit.value.from.substring(0, 2))
        fromMonth.value = months[vendorRelationshipToEdit.value.from.substring(2) - 1]
    }
    if (vendorRelationshipToEdit.value?.until) {

        untilfYear.value = 2000 + ensureNumeric(vendorRelationshipToEdit.value.until.substring(0, 2))
        untilMonth.value = months[vendorRelationshipToEdit.value.until.substring(2) - 1]
    }
})



</script>
<style scoped></style>