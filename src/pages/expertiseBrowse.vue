<template>
    <h1>Expertise & Ecosystem</h1>   
    <ExpertiseMap :organization="expertise?.organization"  :initialExpertise="expertiseId" :initialTag="tag"/>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()

const route = useRoute();

const expertiseId = route.params.expertiseId;
const tag = route.params.tag;

const router = useRouter()

onMounted(() => {
    console.log('expertiseBrowse onMounted with expertiseId', expertiseId)
    console.log('expertiseBrowse onMounted with tag', tag)
})
function ensureNumeric(value) {
    // Check if the value is a string and if it represents a valid number
    if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        // Convert the string to a number
        return Number(value);
    }
    // If the value is already a number, or it's not a valid number string, return it as is
    return value;
}


</script>