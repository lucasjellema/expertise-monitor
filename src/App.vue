<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title @click="gotoIntro()">Expertise Monitor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" elevation="5" v-if="!useraccount" @click="login">Login with Entra ID</v-btn>
    <div v-else>
      <p>Welcome, {{ useraccount.username }}</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-if="useraccount">
      <v-btn  text prepend-icon="mdi-map-search" to="/expertiseBrowse" >Expertise in Ecosysteem</v-btn>
      <v-btn  text prepend-icon="mdi-account-group" to="/organization" >Organization & Expertise</v-btn>
      <v-btn  text prepend-icon="mdi-brain" to="/expertise" >Expertise Catalog</v-btn>
      <v-btn  text prepend-icon="mdi-handshake" to="/partners" >Partners</v-btn>
      <v-btn  text prepend-icon="mdi-certificate" to="/certifications" >Certifications</v-btn>
      <v-btn  text prepend-icon="mdi-export" to="/expertiseRaw" v-if="!appStore.getReadOnly()" >Expertise Raw Dump</v-btn>
      <!-- <v-btn prepend-icon="mdi-star-plus-outline" text to="/newtip" v-if="appStore.ingechecktLid != null">Nieuwe Tip</v-btn>
      <v-btn  text @click="appStore.ingechecktLid=null" v-if="appStore.ingechecktLid != null">Checkout</v-btn>
      <v-btn prepend-icon="mdi-account" text @click="gotoProfile()" title="Bewerk je profiel" v-if="appStore.ingechecktLid != null">{{ appStore.ingechecktLid?.gebruikersnaam }}</v-btn> -->
    </div>
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
import * as auth from './auth.js';
const appStore = useAppStore()

import logo from '@/assets/app-bar-background-conclusion.jpg'

const useraccount = ref(null)

const initializeStore = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('par')) {
    // http://<host:port/apppath>/?par=https://objectstorage.us-ashburn-1.oraclecloud.com/p/3ZvD2n18VN6y/n/idtwlqf2hanz/b/website/o/
    const bucketPAR = urlParams.get('par')
    appStore.setPAR(bucketPAR)
  }
}

// Constants for application state
const APP_STATE = {
  initialized: false,
  authenticated: false
};

onMounted(async () => {
  console.log('***** App Mounted!!')
  // Initialize the authentication module
  APP_STATE.initialized = auth.initializeAuth();

  if (!APP_STATE.initialized) {
    console.error("Failed to initialize authentication system");
    return;
  }

  // Check for authentication event
  // Add MSAL login success listener, broadcast from auth.js
  window.addEventListener('msalLoginSuccess', async (event) => {
    console.log('MSAL Login Success Event:', event.detail);
    // Update UI or perform actions after successful login
    const { account } = event.detail.payload;
    if (account) {
      console.log(`User ${account.username} logged in successfully`);
      console.log("Successful authentication response received");
       useraccount.value = account
       appStore.fetchDataUsingAccount(account);
      await updateUserState();
    }
  })
  
  //   // Check if user is already signed in
  await checkExistingAuth();

  initializeStore()
})

/**
 * Check if user is already authenticated
 */
async function checkExistingAuth() {
  const account = auth.getAccount();
  if (account) {
    console.log("Found existing account", account.username);
    await updateUserState();
  } else {
    // No account found, show unauthenticated state
    APP_STATE.authenticated = false;
    console.log("Not authenticated yet");
  }
}

async function updateUserState() {
  try {
    // Get user details from Microsoft Graph API
    const userDetails = await auth.getUserDetails();

    if (userDetails) {
      APP_STATE.authenticated = true;

      // Get ID token claims for display
      const idTokenClaims = auth.getIdTokenClaims();

      // Update UI with user details and token claims
     // ui.showAuthenticatedUser(userDetails, idTokenClaims);

    } else {
      APP_STATE.authenticated = false;
      console.log("Failed to retrieve user details");
    }
  } catch (error) {
    console.error("Error updating user state:", error);
    APP_STATE.authenticated = false;
    console.log("User is not authenticated");
  }
}

const login = async () => {
   try {
    auth.signIn();
  } catch (error) {
    console.error("Sign in error:", error);
  }
}

const logout = () => {
  auth.signOut();
}


const gotoIntro = () => {
  router.push('/')
}

</script>
