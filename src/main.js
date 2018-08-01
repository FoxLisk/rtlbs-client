// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueAnalytics from 'vue-analytics'
import 'vuetify/dist/vuetify.min.css'
import { sync } from 'vuex-router-sync'
import { VueEditor } from 'vue2-editor'
import MugenScroll from 'vue-mugen-scroll'
import LeaderBoards from '@/components/LeaderBoards'
import store from './store'
import App from './App'
import router from './router'
import '@/filters'
import config from '@/config'

Vue.component('leader-boards', LeaderBoards)
Vue.component('vue-editor', VueEditor)
Vue.component('mugen-scroll', MugenScroll)

Vue.config.productionTip = false

Vue.use(Vuetify)

if (config.TRACKING_ID) {
  Vue.use(VueAnalytics, {
    id: config.TRACKING_ID,
    autotracking: {
      exception: true
    },
    router: router
  })
}

sync(store, router)

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
