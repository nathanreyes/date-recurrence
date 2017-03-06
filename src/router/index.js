import Vue from 'vue';
import Router from 'vue-router';
import DateRecurrence from '@/components/DateRecurrence';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DateRecurrence',
      component: DateRecurrence,
    },
  ],
});
