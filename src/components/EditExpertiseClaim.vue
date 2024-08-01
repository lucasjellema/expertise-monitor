<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>
                <v-row>
                    <v-col cols="10" offset="1">
                        <h1>Expertise on {{ claim.expertise.name }} in {{ claim.organization.type }} {{
                            claim.organization.name }}</h1>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-btn color="primary" @click="saveChanges" class="mb-4">Save Changes</v-btn>
                                    <v-text-field v-model="claim.count" label="Count"></v-text-field>
                                    <v-text-field v-model="claim.notes" label="Notes"></v-text-field>
                                    <v-text-field v-model="claim.ambition" label="Ambition"
                                        hint="Outlook of company regarding this expertise"></v-text-field>
                                    <!-- <v-radio ></v-radio> -->
                                    <v-text-field v-model="claim.author" label="Author"></v-text-field>
                                    <v-text-field v-model="claim.timestamp" label="Timestamp"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div v-if="claim.expertise.tags?.length > 0">
                                        <v-chip v-for="tag in claim.expertise.tags" class="ma-2" size="small">
                                            {{ tag }}
                                        </v-chip>
                                    </div>
                                    <v-img :src="claim.expertise.logoURL" height="100"
                                        v-if="claim.expertise.logoURL"></v-img>
                                    <v-img :src="companyLogos[claim.organization.name]" height="100"></v-img>
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
    expertiseClaim: {
        type: Object,
        required: true
    }
})

const emits = defineEmits(['singleExpertiseClaimChanged'])

const claim = ref({ ...props.expertiseClaim })

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos } = useIconsLibrary();



onMounted(() => {
    console.log(claim.value)
})

const saveChanges = () => {
    emits('singleExpertiseClaimChanged', claim.value)
}

</script>
<style scoped></style>