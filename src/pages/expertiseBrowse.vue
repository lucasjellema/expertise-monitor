<template>
    <h1>Expertise & Ecosystem</h1>   
    <ExpertiseMap :organization="expertise.organization"/>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()

const route = useRoute();

const router = useRouter()

onMounted(() => {
  
})


</script>