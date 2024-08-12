<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Edit {{ organization.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-text-field label="Naam" v-model="organizationToEdit.name"></v-text-field>
                                </v-col>
                            </v-row>                            <v-row>
                                <v-col>
                                    <v-textarea hint="Adres of adressen van deze organisatie" label="Adres(sen)" v-model="organizationToEdit.address"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <v-text-field label="Website" v-model="organizationToEdit.url" </v-text-field>
                                        See <a :href="organizationToEdit.url" target="_blank">web page</a> ({{
                                            organizationToEdit.url
                                        }}) for more details.
                                </v-col>
                            </v-row>
                            
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <br/> <br/>
                                    <v-img :src="companyLogos[organizationToEdit.name]" height="200" v-if="companyLogos[organizationToEdit.name]"></v-img>
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
const emit = defineEmits(['organizationChanged'])

const organizationToEdit = ref({ ...props.organization })

watch( () => organizationToEdit
    , async (newValue, oldValue) => {
        console.log("edit Organization changed", newValue)
        emit('organizationChanged', newValue)
    }, {deep:true} )

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();
onMounted(() => {

})



</script>
<style scoped></style>