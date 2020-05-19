import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import App from './App.vue'
import * as axios from "axios"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
  data: {
    users: []
  },
  created() {
    var vm = this
    this.$http
    .get('https://randomuser.me/api/?results=25')
    .then(function (response) {
      vm.users = response.data;
      vm.users = vm.users.results
      console.log(vm.users)
    });
  }
}).$mount('#app')
