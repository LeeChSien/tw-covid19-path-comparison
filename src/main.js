import Vue from 'vue'
import App from './App'

import Filters from './util/filters'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import VueMoment from 'vue-moment'

import 'vue-multiselect/dist/vue-multiselect.min.css'
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect)

Vue.use(Filters)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
