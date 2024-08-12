<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>{{ vendorRelationship.title }} - {{ vendorRelationship.vendor.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <p>{{ vendorRelationship.description }}</p>
                                    <p v-if="vendorRelationship.from">Vanaf: {{ formatMonthYear(vendorRelationship.from)
                                        }}</p>
                                    <p v-if="vendorRelationship.until">Tot: {{ formatMonthYear(vendorRelationship.until)
                                        }}</p>
                                    <br />

                                    {{ vendorRelationship.vendor.description }}
                                    <br />
                                    <p v-if="vendorRelationship.vendor.homepage">Details: <a
                                            :href="vendorRelationship.vendor.homepage" target="_blank">web
                                            site</a></p>
                                    <v-img :src="vendorRelationship.vendor.logoUrl" height="200"
                                        v-if="vendorRelationship.vendor.logoUrl"></v-img>

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

import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();

onMounted(() => {

})



</script>
<style scoped></style>