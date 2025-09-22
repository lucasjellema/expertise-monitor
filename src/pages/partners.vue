<template>
    <h1>Partners</h1>   
    <VendorRelationshipsOverview :vendorRelationships="vendorRelationsRelationships"/>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { computed } from "vue";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()
onMounted(() => {
    console.log('Psrtners')
})


const vendorRelationsRelationships = computed(() => {
    return expertise.value.organization.flatMap(o => o.vendorRelations.map(vr => ({
        ...vr,
        organization: o,
        vendor: expertise.value.vendors.find(v => v.id === vr.vendorId)
    })))
})
</script>