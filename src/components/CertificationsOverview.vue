<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row>
                    <v-col>
                        <v-data-table :headers="certificationHeaders" :items="props.certifications" :search="search">
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Certifications</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-text-field v-model="search" density="compact" label="Search"
                                        prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details
                                        single-line></v-text-field>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.vendor.name="{ item, index }">

                                <v-tooltip :text="item.vendor.description">
                                    <template v-slot:activator="{ props }">
                                        <span v-bind="props" v-if="!item.vendor.homepage">{{ item.vendor.name }}</span>
                                        <a :href="item.vendor.homepage" v-bind="props"  target="_blank" v-if="item.vendor.homepage" >{{ item.vendor.name }}</a>
                                    </template>
                                </v-tooltip>
                            </template> 
                            <template v-slot:item.title="{ item, index }">
                                <v-tooltip :text="item.description">
                                    <template v-slot:activator="{ props }">
                                        <span v-bind="props" v-if="!item.certificationsDetailsUrl">{{ item.title }}</span>
                                        <a v-bind="props" :href="item.certificationsDetailsUrl" v-if="item.certificationsDetailsUrl" title="webpage with certification details" target="_blank">{{ item.title }}</a>
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-slot:item.asOf="{ item, index }">
                                {{ formatMonthYear(item.asOf) }}
                            </template>

                            <template v-slot:item.vendor.homepage="{ item, index }">
                                <a :href="item.vendor.homepage" target="_blank">web site</a>
                            </template>
                            <template v-slot:item.vendor.logoURL="{ item, index }">
                                <v-img :src="item.vendor.logoUrl" height="50"></v-img>
                            </template>
                            <template v-slot:item.certificationLogoUrl="{ item, index }">
                                <v-img :src="item.certificationLogoUrl" height="50" :title="item.title"></v-img>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

            </v-main>
        </v-container>
    </v-responsive>


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
    certifications: {
        type: Array,
        required: true
    }
})
const search = ref('')

const certificationHeaders = [
    {
        title: 'Partner/Vendor',
        key: 'vendor.name'
    }
    , { title: 'Partner Logo', key: 'vendor.logoURL', sortable: false }
    , { title: 'Certificate Logo', key: 'certificationLogoUrl', sortable: false }

    , { title: 'Title/Status', key: 'title', sortable: false }
    , { title: 'Bedrijf', key: 'organization.name', sortable: true }
    , { title: 'Aantal', key: 'count', sortable: true }
    , { title: 'Per', key: 'asOf', sortable: false }
    
]

onMounted(() => {
    console.log('Overview of certifications')
})



</script>
<style scoped></style>