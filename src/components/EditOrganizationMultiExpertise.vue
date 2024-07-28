<template>
    <v-container>

        <v-data-table :headers="headers" :items="eclaims" item-value="id" item-key="id"
            class="elevation-1 dense-table row-height-50" show-select dense>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Expertise on {{ tag }}
                        in {{ organizationUnit.name }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="saveChanges">Save Changes</v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.count="{ item }">
                <v-text-field v-model="item.count" label="Count" type="number" dense class="small-text-field"
                    @change="update(item)"></v-text-field>
            </template>
            <template v-slot:item.notes="{ item }">
                <v-text-field v-model="item.notes" label="Notes" @change="update(item)"></v-text-field>
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup>

import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const emits = defineEmits(['expertiseChanged'])

const props = defineProps({
    organizationUnit: {
        type: Object,
        required: true
    },
    tag: { type: String, required: true }
})

const
    headers = ref([
        { title: 'Expertise', value: 'name', sortable: true, width: '180px' },
        { title: 'Count', value: 'count', width: '100px' },
        { title: 'Notes', value: 'notes' }
    ])


const saveChanges = () => {
    // Implement your save logic here
    const newAndUpdatedClaims = eclaims.value.filter(item => item.updated)
    emits('expertiseChanged', newAndUpdatedClaims)

}


const update = (item) => {
    console.log('update', item)
    item.updated = true

}

const eclaims = ref([])


onMounted(() => {
    console.log('***** EditOrganizationExpertise Mounted!!')
    // create collection with all expertise under tag
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[props.tag]
    console.log('expertisesUnderTag', expertisesUnderTag)
    // if map m contains the tag

    if (expertisesUnderTag) {
        const organizationHasAnyClaims = props.organizationUnit.expertiseClaims && props.organizationUnit.expertiseClaims.length > 0
        for (const expertise of expertisesUnderTag) {

            const newClaim = { name: expertise.name, expertiseId: expertise.id, expertise: expertise, count: 0, notes: '', updated: false }
            // find expertise in claims for this organization unit
            if (organizationHasAnyClaims) {
                const existingClaim = props.organizationUnit.expertiseClaims.find(claim => claim.expertiseId === newClaim.expertiseId)

                if (existingClaim) {
                    newClaim.count = existingClaim.count
                    newClaim.notes = existingClaim.notes
                }
            }


            eclaims.value.push(newClaim)
        }
    }
    // then update from the expertise claims for the organization unit for these expertises

})

</script>

<style scoped>
.v-data-table {
    overflow-x: auto;
}

.dense-table .v-data-table__wrapper {
    max-height: calc(100vh - 200px);
}

.dense-table .v-data-table__divider {
    height: 2px;
}

.dense-table .v-data-table__th,
.dense-table .v-data-table__td {
    padding-top: 4px;
    padding-bottom: 4px;
    font-size: 0.875rem;
}

.small-text-field {
    max-width: 100px;
    /* Adjust the width to your preference */
}

.v-data-table.row-height-50 td {
    height: 18px !important;
}
</style>