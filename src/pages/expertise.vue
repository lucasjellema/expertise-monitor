<template>
    <h1>Expertise Catalog</h1>   

    <ExpertiseOverview :expertise="expertise.expertise"/>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()

const route = useRoute();

const router = useRouter()
// const tipId = route.params.tipId;

// const appStore = useAppStore()
// const bubble = appStore.getBubble()

onMounted(() => {
  
})


</script>