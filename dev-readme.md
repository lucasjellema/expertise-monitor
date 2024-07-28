Steps I took to get started
npm create vuetify@latest

Need to install the following packages:
  create-vuetify@2.2.6
Ok to proceed? (y)

Vuetify.js - Material Component Framework for Vue

√ Project name: ... expertise-monitor
√ Which preset would you like to install? » Recommended (Everything from Default. Adds auto importing, layouts & pinia)
√ Use TypeScript? ... No / Yes
√ Would you like to install dependencies with yarn, npm, pnpm, or bun? » npm
√ Install Dependencies? ... No / Yes

◌ Generating scaffold...
◌ Installing dependencies with npm...

added 339 packages, and audited 340 packages in 21s

118 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

expertise-monitor has been generated at C:\research\expertise-monitor\expertise-monitor

Discord community: https://community.vuetifyjs.com
Github: https://github.com/vuetifyjs/vuetify
Support Vuetify: https://github.com/sponsors/johnleider

To run the app:

npm run dev



# Add Deployment to GitHub Pages

Static web applications can be published and accessed on GitHub Pages. This is an easy way to share the application with a wider audience. Deployment to GitHub pages can be done from the development environment on the command line using npm after a few simple actions.

Install npm module gh-pages
```
npm install gh-pages --save-dev
```

Add these lines in `package.json`:
```
  "homepage": "https://lucasjellema.github.io/expertise-monitor/",
  "scripts": {
    ...
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
```   

Update `vite.config.js`:
```
export default defineConfig({
  base: "/expertise-monitor/",
  plugins: [
    vue(),
  ],
```  
With these changes, the expertise-monitor application can be (re)deployed to GitHub Pages using:
```
npm run deploy
```
The first time this deployment is ran, a new branch is created - called `gh-pages` - and the GitHub project is configured for GitHub Pages, including GitHub actions for do the actual deployment. 

To resolve errors "Dynamic import error, reloading page did not fix it TypeError: Failed to fetch dynamically imported module" I have removed the dynamic route creation and replaced it with static route definitions. 

# Add Quill Editor

npm i @vueup/vue-quill --save

Now the QuillEditor can be used for allowing rich text editing, for example like this :

        <v-sheet class="flex-1-1-100  ma-0 pa-0 mb-3">
          <QuillEditor theme="snow" toolbar="essential" v-model:content="beschrijving" contentType="delta" />
        </v-sheet>


# Add Leaflet

npm install leaflet --save


