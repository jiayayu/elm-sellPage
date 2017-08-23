// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {name: 'root', path: '/', redirect: '/goods'},
    {name: 'goods', path: '/goods', component: goods},
    {name: 'ratings', path: '/ratings', component: ratings},
    {name: 'seller', path: '/seller', component: seller}
  ]
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  render: c => c(App),
  router
});
