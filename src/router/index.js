import Vue from 'vue'
import Router from 'vue-router'
import Movies from '@/components/Movies'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'movies',
      component: Movies
    },
    {
      path: '/:itemSource',
      name: 'Home',
      component: Movies
    }
  ]
})
