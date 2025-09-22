<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="6" offset="1">
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-data-table :headers="expertiseHeaders" :items="props.expertise" :search="search">
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title>Expertise Catalog</v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-text-field v-model="search" density="compact" label="Search"
                                                    prepend-inner-icon="mdi-magnify" variant="solo-filled" flat
                                                    hide-details single-line></v-text-field>
                                                <v-spacer ></v-spacer>
                                                <v-btn color="primary" @click="addExpertise" v-if="!appStore.getReadOnly()">Add Expertise</v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:item.name="{ item, index }">
                                            <v-btn prepend-icon="mdi-dots-horizontal" text
                                                @click="generateExpertiseDialog(item)">{{ item.name }}</v-btn>
                                                <v-icon @click="gotoExpertise(item)" small class="ml-2">mdi-school</v-icon>
                                        </template>
                                        <template v-slot:item.webpage="{ item, index }">
                                            <a :href="item.webpage" target="_blank">web page</a>
                                        </template>
                                        <template v-slot:item.tags="{ item, index }">
                                            <div v-if="item.tags?.length > 0">
                                                <v-chip v-for="tag in item.tags" class="ma-2" size="small" @click="gotoTag(tag)">
                                                    {{ tag }}
                                                </v-chip>
                                            </div>
                                        </template>
                                        <template v-slot:item.logoURL="{ item, index }">
                                            <v-img :src="item.logoURL" height="50"></v-img>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>
    <v-dialog v-model="expertiseDialog" width="1000" @afterLeave="editExpertise = false">
        <v-card>
            <v-card-title>
                <v-btn @click="editExpertise = true" v-if="!editExpertise && !appStore.getReadOnly()">Bewerken</v-btn>
                <v-btn @click="saveExpertise" v-if="editExpertise">Opslaan</v-btn>
            </v-card-title>
            <ExpertiseDetails :expertise="expertiseToShow" v-if="!editExpertise" />
            <EditExpertise :expertise="expertiseToShow" @expertiseChanged="handleExpertiseUpdate"
                v-if="editExpertise" />
        </v-card>
    </v-dialog>
</template>


<script setup>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

import { useRouter } from 'vue-router'

const router = useRouter()


const props = defineProps({
    expertise: {
        type: Array,
        required: true
    }
})

const search = ref('')
const expertiseToShow = ref(null)
const expertiseDialog = ref(false)
const generateExpertiseDialog = (expertise) => {
    expertiseToShow.value = { ...expertise }
    expertiseDialog.value = true
}
const editExpertise = ref(false)

const expertiseInProgress = ref(null)
const handleExpertiseUpdate = (e) => {
    console.log("expertise updated", e)
    expertiseInProgress.value = e.value
}

const addExpertise = () => {
    expertiseToShow.value = {
        name: "",
        tags: []
    }
    editExpertise.value = true
    expertiseDialog.value = true

}

const saveExpertise = () => {
    editExpertise.value = false
    expertiseDialog.value = false
    appStore.saveExpertise(expertiseInProgress.value)
}

const expertiseHeaders = [
    {
        title: 'Expertise',
        key: 'name'
    }
    , { title: 'Website', key: 'webpage', sortable: false }
    , { title: 'Tags', key: 'tags' }
    , { title: 'Logo', key: 'logoURL', sortable: false }

]

const gotoExpertise = (item) => {
    router.push({ name: 'expertiseBrowseSpecific', params: { expertiseId: item.id } });
}

const gotoTag = (tag) => {
    router.push({ name: 'expertiseBrowseTag', params: { tag: tag } });
}

onMounted(() => {

})



</script>
<style scoped></style>