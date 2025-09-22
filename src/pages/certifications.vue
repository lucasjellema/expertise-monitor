<template>
    <h1>Certifications</h1>   
    <CertificationsOverview :certifications="certifications"/>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { computed } from "vue";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()
onMounted(() => {
    console.log('Certifications')
})


const certifications = computed(() => {
    return expertise.value.organization.flatMap(o => o.certifications.map(vr => ({
        ...vr,
        organization: o,
        vendor: expertise.value.vendors.find(v => v.id === vr.vendorId)
    })))
})
</script>