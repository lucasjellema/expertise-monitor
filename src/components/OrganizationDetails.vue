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
                                    <!-- {{ expertise.description }}
                                    <br /><br />
                                    See <a :href="expertise.webpage" target="_blank">web page</a> ({{ expertise.webpage
                                    }}) for more details.

                                    <div v-if="expertise.tags?.length > 0">
                                        <v-chip v-for="tag in expertise.tags" class="ma-2" size="small">
                                            {{ tag }}
                                        </v-chip>
                                    </div>
                                    <v-img :src="expertise.logoURL" height="200" v-if="expertise.logoURL"></v-img>
                                    {{ expertise.logoURL }} -->
                                    <span v-if="organization.address">Adres: {{organization.address}}</span>
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