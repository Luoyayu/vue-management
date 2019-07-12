import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router';
import VueRouter from 'vue-router'

Vue.config.productionTip = false;

import Vuetify from 'vuetify'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'vuetify/dist/vuetify.min.css'
import VeeValidate from 'vee-validate'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel);

Vue.use(VeeValidate);
Vue.use(Router);
Vue.use(VueMaterial);
Vue.use(Vuetify);

import Navigation from "./components/Navigation";
// import Home from "./layout/Home";
import zggl from "./components/zggl";
import kqtj from "./components/kqtj";
import qjgl from "./components/qjgl";
import Login from "./layout/Login";

const routes = [
    {
        path: '/admin',
        name: 'Login',
        component: Login,
    },
    {
        path: '/admin/navigation',
        name: 'Navigation',
        component: Navigation,
    },
    {
        path: "/admin/navigation/zggl",
        name: "Zggl",
        component: zggl
    },
    {
        path: "/admin/navigation/kqtj",
        name: "Kqtj",
        component: kqtj
    },
    {
        path: "/admin/navigation/qjgl",
        name: "Qjgl",
        component: qjgl
    },


];

const router = new VueRouter({
    routes: routes,
});

new Vue({
    router,
    render: h => h(App),
    created: function () {
        this.$router.push({name: 'Login'})
    }
}).$mount('#app');
