<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>{{ organization.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                  
                                    <span v-if="organization.address"><br/> <br/>Adres: {{organization.address}}</span>
                                    <span v-if="organization.url">Website: <a :href="organization.url" target="_blank">{{ organization.url }}</a></span>

                                    <br/> <br/>
                                    <v-img :src="companyLogos[organization.name]" height="200" v-if="companyLogos[organization.name]"></v-img>
                                    
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
    organization: {
        type: Object,
        required: true
    }
})


import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();
onMounted(() => {

})



</script>
<style scoped></style>