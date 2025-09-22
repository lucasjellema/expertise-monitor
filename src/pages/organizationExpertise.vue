<template>
    <h1>Expertise in {{ organization?.type }} {{ organization?.name }}</h1>
    <OrganizationExpertiseMap :organizationUnit="organization" v-if="organization" @expertiseChanged ="handleExpertiseChanged" :key="refreshIndicator"/>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()
const refreshIndicator = ref(0)

const route = useRoute();
const router = useRouter()

const organizationId = route.params.organizationId;
const organization = ref(null)
onMounted(() => {
    console.log('onMounted orgExp')
    organization.value = appStore.getExpertise().value.organization.find(org => org.id === organizationId)
})

const handleExpertiseChanged = (organizationUnit) => {
console.log('handleExpertiseChanged in page organizationExpertise; changed unit:', organizationUnit)    
    //refreshIndicator.value++ // could be used to rerender, but ExpertiseMap is doing that itself
 }

</script>