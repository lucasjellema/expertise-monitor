/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
const msalScriptURL = "https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js";

const app = createApp(App)
  // Add MSAL script to the page if not present
const x=  await ensureMsalLoaded();
registerPlugins(app)

app.mount('#app')



/**
 * Ensure MSAL script is loaded before proceeding
 */
async function ensureMsalLoaded() {
  // Check if MSAL is already available
  if (window.msal) {
    return;
  }

  return new Promise((resolve) => {
    // Create script tag for MSAL
    const msalScript = document.createElement('script');
    msalScript.src = msalScriptURL;
    msalScript.async = true;
    msalScript.defer = true;

    // Handle script load event
    msalScript.onload = () => {
      console.log("MSAL.js loaded successfully");
      resolve();
    };

    // Handle script error
    msalScript.onerror = () => {
      console.error("Failed to load MSAL.js");
      console.error("Failed to load authentication library");
      resolve(); // Resolve anyway to allow error handling
    };

    // Add the script to the document head
    document.head.appendChild(msalScript);
  });
}

