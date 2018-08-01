import Api from '@/services/Api'

export default {
  list_player (username) {
    return Api().get('/players/' + username + '/roomtimes/')
  },
  list_room (slug) {
    return Api().get('/rooms/' + slug + '/')
  },
  leaderboards () {
    return Api().get('/rooms/')
  },
  create (username, payload) {
    return Api().post('/players/' + username + '/roomtimes/', payload)
  },
  get (username, id) {
    return Api().get('/players/' + username + '/roomtimes/' + id + '/')
  },
  update (username, id, payload) {
    return Api().patch('/players/' + username + '/roomtimes/' + id + '/', payload)
  },
  delete (username, id) {
    return Api().delete('/players/' + username + '/roomtimes/' + id + '/')
  },
  latest (lastId) {
    const q = lastId ? '?lastId=' + lastId : ''
    return Api().get('/latest-roomtimes/' + q)
  }
}
