import Vue from 'vue'
import Router from 'vue-router'
import Movies from '@/components/Movies'
import Series from '@/components/Series'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Movies
    },
    {
      path: '/movies',
      name: 'movies',
      component: Movies
    },
    {
      path: '/series',
      name: 'series',
      component: Series
    }
  ]
})
