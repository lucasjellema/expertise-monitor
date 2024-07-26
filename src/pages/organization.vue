<template>
    <h1>Organization</h1>   

    <OrganizationOverview :organization="expertise.organization"/>
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