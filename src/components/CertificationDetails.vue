<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>{{ certification.title }} - {{ certification.vendor.name }} - Aantal: {{ certification.count }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <p>{{ certification.description }}</p>
                                    <p v-if="certification.asOf">Per: {{ formatMonthYear(certification.asOf)
                                        }}</p>

                                    <p v-if="certification.certificationsDetailsUrl">Certification Webpage: <a
                                            :href="certification.certificationsDetailsUrl" target="_blank">web
                                            site</a></p>
                                    <v-img :src="certification.certificationLogoUrl" height="200"
                                        v-if="certification.certificationLogoUrl"></v-img>
                                        {{ certification.vendor.description }}

                                    <p v-if="certification.vendor.homepage">Details: <a
                                            :href="certification.vendor.homepage" target="_blank">web
                                            site</a></p>
                                    <v-img :src="certification.vendor.logoUrl" height="200"
                                        v-if="certification.vendor.logoUrl"></v-img>

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

import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();

onMounted(() => {

})



</script>
<style scoped></style>