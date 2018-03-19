import Vue from 'vue'
import Router from 'vue-router'
import MyMovies from '@/components/MyMovies'
import LatestMovies from '@/components/LatestMovies'
import LatestSeries from '@/components/LatestSeries'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MyMovies
    },
    {
      path: '/myMovies',
      name: 'MyMovies',
      component: MyMovies
    },
    {
      path: '/latestMovies',
      name: 'latestMovies',
      component: LatestMovies
    },
    {
      path: '/latestSeries',
      name: 'latestSeries',
      component: LatestSeries
    }
  ]
})
