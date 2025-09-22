<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row>
                    <v-col>
                        <v-data-table :headers="vendorRelationshipsHeaders" :items="props.vendorRelationships"
                            :search="search">
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Technology Partners & Vendor Relationships</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-text-field v-model="search" density="compact" label="Search"
                                        prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details
                                        single-line></v-text-field>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.vendor.name="{ item, index }">

<v-tooltip :text="item.vendor.description">
    <template v-slot:activator="{ props }">
        <span v-bind="props">{{ item.vendor.name }}</span>
    </template>
</v-tooltip>
</template>                            <template v-slot:item.title="{ item, index }">

<v-tooltip :text="item.description">
    <template v-slot:activator="{ props }">
        <span v-bind="props">{{ item.title }}</span>
    </template>
</v-tooltip>
</template>
                            <template v-slot:item.from="{ item, index }">
                                {{ formatMonthYear(item.from) }}
                            </template>
                            <template v-slot:item.until="{ item, index }">
                                {{ formatMonthYear(item.until) }}
                            </template>
                            <template v-slot:item.vendor.homepage="{ item, index }">
                                <a :href="item.vendor.homepage" target="_blank">web site</a>
                            </template>
                            <template v-slot:item.vendor.logoURL="{ item, index }">
                                <v-img :src="item.vendor.logoUrl" height="50"></v-img>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

            </v-main>
        </v-container>
    </v-responsive>
    <v-dialog v-model="organizationDialog" width="1000" @afterLeave="editOrganization = false">
        <v-card>
            <OrganizationDetails :organization="organizationToShow" />

        </v-card>
    </v-dialog>

</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()
import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();

import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter()


const props = defineProps({
    vendorRelationships: {
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


const vendorRelationshipsHeaders = [
    {
        title: 'Partner/Vendor',
        key: 'vendor.name'
    }, { title: 'Title/Status', key: 'title', sortable: false }
    , { title: 'Bedrijf', key: 'organization.name', sortable: true }
    , { title: 'Partner Homepage', key: 'vendor.homepage', sortable: true }
    , { title: 'Logo', key: 'vendor.logoURL', sortable: false }
    , { title: 'Vanaf', key: 'from', sortable: false }
    , { title: 'Tot', key: 'until', sortable: false }

]

onMounted(() => {
    console.log('Overview of vendor relatonships')
})



</script>
<style scoped></style>