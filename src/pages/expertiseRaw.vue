<template>
    <h1>Raw Expertise</h1>
    <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
    <v-btn @click="copyExpertiseCatalogToClipboard">Copy Expertise Catalog to clipboard</v-btn>
    <v-btn @click="copyWithoutCatalogToClipboard">Copy Expertise Claims & Organization Structure to clipboard</v-btn>
    <code class="language-json">{{ JSON.stringify(expertiseCleaned) }}</code>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()
const expertiseCleaned = ref(null)
const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(expertiseCleaned.value));
}

const copyExpertiseCatalogToClipboard= () => {
    navigator.clipboard.writeText(`{"expertise": ${JSON.stringify(expertiseCleaned.value.expertise)}}`)
}

const copyWithoutCatalogToClipboard= () => {
    const copyContent = JSON.parse(JSON.stringify(expertiseCleaned.value))
    copyContent.expertise = []
    navigator.clipboard.writeText(JSON.stringify(copyContent));
    
}

onMounted(() => {
    // clone expertise
    const e = { ...expertise.value }
    // remove circular references

    // remove organization property from organizationMemberships
    // remove memberOrganizations property from organizations

    const organization = e.organization
    for (const org of organization) {
        // remove property memberOrganizations from org
        delete org.memberOrganizations
        if (org.organizationMemberships && org.organizationMemberships.length > 0) {
            for (const membership of org.organizationMemberships) {
                delete membership.organization
            }
        }
        if (org.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {
                delete claim.expertise
                delete claim.organization
            }
        }
    }
    expertiseCleaned.value = e
})


</script>