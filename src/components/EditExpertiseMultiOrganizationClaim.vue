<template>
    <v-container>
        <v-card flat>
            <v-divider></v-divider>
            <v-data-table :headers="headers" :items="eclaims" item-value="id" item-key="id" :search="search"
                class="elevation-1 dense-table row-height-50" show-select dense>

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Ecosysteem Expertise on {{ expertise.name }}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                            variant="solo-filled" flat hide-details single-line></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="saveChanges">Save Changes</v-btn>
                    </v-toolbar>
                </template>

                <template v-slot:item.count="{ item, index }">
                    <v-text-field v-model="item.count" label="Count" dense class="small-text-field"
                        @change="update(item)" @keydown.down="focusNextRow(index)" @keydown.up="focusPreviousRow(index)"
                        :ref="(el) => (fields['field-' + index] = el)" </v-text-field>
                </template>
                <template v-slot:item.author="{ item }">
                <v-text-field v-model="item.author" label="Author" @change="update(item)"></v-text-field>
            </template>
            <template v-slot:item.ambition="{ item }">
                <v-text-field v-model="item.ambition" label="Ambition" @change="update(item)"></v-text-field>
            </template>
                <template v-slot:item.notes="{ item }">
                    <v-text-field v-model="item.notes" label="Notes" @change="update(item)"></v-text-field>
                </template>
            </v-data-table>
        </v-card>
    </v-container>

</template>

<script setup>

import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const search = ref('')
const fields = ref({})

const emits = defineEmits(['expertiseChanged'])

const props = defineProps({
    expertise: {
        type: Object,
        required: true
    }
})

const
    headers = ref([
        { title: 'Organization', value: 'name', sortable: true, width: '180px', text: '' },
        { title: 'Count', value: 'count',sortable:true, width: '100px', text: '' },
        { title: 'Author', value: 'author' , sortable: true},
        { title: 'Ambition', value: 'ambition', sortable: true },
        { title: 'Notes', value: 'notes', text: '' }
    ])


const saveChanges = () => {
    // Implement your save logic here
    const newAndUpdatedClaims = eclaims.value.filter(item => item.updated)
    emits('expertiseChanged', newAndUpdatedClaims)

}


const update = (item) => {
    item.updated = true
}

const eclaims = ref([])

const focusNextRow = (index) => {
    const nextIndex = index + 1;
    const nextField = fields.value['field-' + nextIndex];
    if (nextField) {
        nextField.focus(); // Focus the next field
        selectInputValue(nextIndex)
    }
}

const focusPreviousRow = (index) => {
    const nextIndex = index - 1;
    const nextField = fields.value['field-' + nextIndex];
    if (nextField) {
        nextField.focus(); // Focus the next field
        selectInputValue(nextIndex)        
    }
}

const selectInputValue = (index) => {
    nextTick(() => {
        const field = fields.value['field-' + index];        
        if (field && field.$el.querySelector('input')) {
            setTimeout(() => {
                field.$el.querySelector('input').select(); // Select the value in the input field
            }, 100);
        }
    })
};

onMounted(() => {
    console.log('***** EditExpertiseMultiOrganizationClaim Mounted!!', fields.value)


    // get organizations and loop over all
    // create an expertiseclaim for every organization
    // then find the expertise claim for the organization (if  it exists) 
    const organization = appStore.getExpertise().value.organization
    console.log('organization', organization)

    for (const org of organization) {
        const organizationHasAnyClaims = org.expertiseClaims && org.expertiseClaims.length > 0
        const newClaim = { name: org.name, expertiseId: props.expertise.id, expertise: props.expertise, count: 0, notes: '', updated: false, organization: org , new:true}
        if (organizationHasAnyClaims) {
            const existingClaim = org.expertiseClaims.find(claim => claim.expertiseId === newClaim.expertiseId)
            if (existingClaim) {
                newClaim.count = existingClaim.count
                newClaim.notes = existingClaim.notes
                newClaim.author = existingClaim.author
                newClaim.ambition = existingClaim.ambition
                newClaim.asOf = existingClaim.asOf

                newClaim.new = false
                newClaim.originalClaim = existingClaim
            }
        }
        eclaims.value.push(newClaim)
    }
    eclaims.value.sort((a, b) => b.count - a.count)
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