import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/views/Frontpage'
import PlayerDetail from '@/views/PlayerDetail'
import PlayerList from '@/views/PlayerList'
import RoomList from '@/views/RoomList'
import RoomDetail from '@/views/RoomDetail'
import Info from '@/views/Info'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'frontpage',
      component: Frontpage
    },
    {
      path: '/players/',
      name: 'player-list',
      component: PlayerList
    },
    {
      path: '/players/:slug/',
      name: 'player-detail',
      component: PlayerDetail
    },
    {
      path: '/rooms/',
      name: 'room-list',
      component: RoomList
    },
    {
      path: '/rooms/:slug/',
      name: 'room-detail',
      component: RoomDetail
    },
    {
      path: '/info/',
      name: 'info',
      component: Info
    }
  ]
})
