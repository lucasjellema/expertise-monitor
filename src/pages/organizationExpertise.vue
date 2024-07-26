<template>
    <h1>Expertise in {{ organization?.type }} {{ organization?.name }}</h1>
    <ExpertiseMap :organizationUnit="organization" v-if="organization"/>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()

const route = useRoute();
const router = useRouter()

const organizationId = route.params.organizationId;
const organization = ref(null)
onMounted(() => {
    console.log('onMounted orgExp')
    organization.value = appStore.getExpertise().value.organization.find(org => org.id === organizationId)
})


</script>