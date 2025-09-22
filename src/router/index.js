/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory  } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import index from '@/pages/index.vue';
// import editTip from '@/pages/editTip.vue';
import expertise from '@/pages/expertise.vue';
import expertiseBrowse from '@/pages/expertiseBrowse.vue';
import expertiseRaw from '@/pages/expertiseRaw.vue';
import organization from '@/pages/organization.vue';
import partners from '@/pages/partners.vue';
import certifications from '@/pages/certifications.vue';
import organizationExpertise from '@/pages/organizationExpertise.vue';

const createRoutes = () => {
//  const r = setupLayouts(routes)
  const r = []
  r.push({ path: '/organizationExpertise/:organizationId',name: 'organizationExpertise', component: organizationExpertise })
  r.push({ path: '',name: 'intro', component: index })
  r.push({ path: '/expertise',name: 'expertise', component: expertise })
  r.push({ path: '/expertiseBrowse',name: 'expertiseBrowse', component: expertiseBrowse })
  r.push({ path: '/expertiseBrowse/:expertiseId',name: 'expertiseBrowseSpecific', component: expertiseBrowse })
  r.push({ path: '/expertiseBrowseTag/:tag',name: 'expertiseBrowseTag', component: expertiseBrowse })
  r.push({ path: '/expertiseRaw',name: 'expertiseRaw', component: expertiseRaw })
  r.push({ path: '/organization',name: 'organization', component: organization })
  r.push({ path: '/partners',name: 'partners', component: partners })
  r.push({ path: '/certifications',name: 'certifications', component: certifications })
  //r.push({ path: '/editTip/:tipId',name: 'editTip', component: editTip })
  return r
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: createRoutes(),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
