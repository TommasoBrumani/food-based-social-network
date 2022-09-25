import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TitleMixin from './mixins/TitleMixin'
import { auth } from './firebase'
import './assets/scss/app.scss'
import moment from "moment";

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(user => {
  if (!app) {

    Vue.filter('capitalize', function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    })

    Vue.filter('formatDateFromNow', function (val) {
      if (!val) {
        return "?";
      }

      let date = val.toDate();
      return moment(date).fromNow();
    })

    Vue.filter('formatDateTime', function (val) {
      if (!val) {
        return "?";
      }

      var date = val.toDate();
      var month = date.getUTCMonth() + 1;
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;

      return day + "/" + month + "/" + year + " - " + hours + ":" + minutes;
    })

    Vue.mixin(TitleMixin)

    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
