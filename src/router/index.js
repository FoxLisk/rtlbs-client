import Vue from 'vue'
import Router from 'vue-router'
import Frontpage from '@/components/Frontpage'
import PlayerDetail from '@/components/PlayerDetail'
import PlayerList from '@/components/PlayerList'
import RoomList from '@/components/RoomList'
import RoomDetail from '@/components/RoomDetail'
import Info from '@/components/Info'

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
