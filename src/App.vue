<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title @click="gotoIntro()">Expertise Monitor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  text prepend-icon="mdi-map-search" to="/expertiseBrowse" >Expertise in Ecosysteem</v-btn>
      <v-btn  text prepend-icon="mdi-account-group" to="/organization" >Organization & Expertise</v-btn>
      <v-btn  text prepend-icon="mdi-brain" to="/expertise" >Expertise Catalog</v-btn>
      <v-btn  text prepend-icon="mdi-export" to="/expertiseRaw" >Expertise Raw Dump</v-btn>
      <!-- <v-btn prepend-icon="mdi-star-plus-outline" text to="/newtip" v-if="appStore.ingechecktLid != null">Nieuwe Tip</v-btn>
      <v-btn  text @click="appStore.ingechecktLid=null" v-if="appStore.ingechecktLid != null">Checkout</v-btn>
      <v-btn prepend-icon="mdi-account" text @click="gotoProfile()" title="Bewerk je profiel" v-if="appStore.ingechecktLid != null">{{ appStore.ingechecktLid?.gebruikersnaam }}</v-btn> -->
      <v-img :src="logo" height="80"></v-img>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script setup>

import router from './router'
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

import logo from '@/assets/app-bar-background-conclusion.jpg'

const initializeStore = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('par')) {
    // http://<host:port/apppath>/?par=https://objectstorage.us-ashburn-1.oraclecloud.com/p/3ZvD2n18VN6y/n/idtwlqf2hanz/b/website/o/
    const bucketPAR = urlParams.get('par')
    appStore.setPAR(bucketPAR)
  }
}


onMounted(() => {
  console.log('***** App Mounted!!')
  initializeStore()
})


const gotoIntro = () => {
  router.push('/')
}

</script>
