<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Edit {{ expertiseToEdit.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <v-text-field label="Naam" v-model="expertiseToEdit.name"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <v-text-field label="Website" v-model="expertiseToEdit.webpage" </v-text-field>
                                        See <a :href="expertiseToEdit.webpage" target="_blank">web page</a> ({{
                                            expertiseToEdit.webpage
                                        }}) for more details.
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <p>Beschrijving</p>
                                    <v-sheet class="flex-1-1-100  ma-0 pa-0 mb-3">
                                        <v-textarea v-model="expertiseToEdit.description" variant="outlined"
                                            rows="4"></v-textarea>
                                    </v-sheet>
                                    <TagComponent :tags="mytags" :theTags="myselectedTags"
                                        @tagSelectionChanged="handleTagSelectionChanged">
                                    </TagComponent>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-2" cols="11">
                                    <p>Logo</p>
                                    <v-text-field label="Website" v-model="expertiseToEdit.logoURL" </v-text-field>
                                        
                                            <v-img :src="expertiseToEdit.logoURL" height="200"></v-img>
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
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const props = defineProps({
    expertise: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['expertiseChanged'])

onMounted(() => {
    myselectedTags.value = [...props.expertise.tags]

})
const mytags = ref(Array.from(appStore.expertiseTags))
const myselectedTags = ref([])
const expertiseToEdit = ref({ ...props.expertise })

watch( () => expertiseToEdit
    , async (newValue, oldValue) => {
        console.log("edit expertise expertise changed", newValue)
        emit('expertiseChanged', newValue)
    }, {deep:true} )

const handleTagSelectionChanged = (e) => {
    expertiseToEdit.value.tags = [...e]
}


</script>
<style scoped></style>