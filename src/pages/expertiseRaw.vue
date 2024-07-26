<template>
    <h1>Raw Expertise</h1>   
    <v-btn @click="copyToClipboard">Copy to clipboard</v-btn>
    <code class="language-json">{{ JSON.stringify(expertise) }}</code>

</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from 'vue-router';
const appStore = useAppStore()
const expertise = appStore.getExpertise()

const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(expertise));
}


</script>