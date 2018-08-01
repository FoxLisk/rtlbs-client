import Api from '@/services/Api'

export default {
  list () {
    return Api().get('/players/')
  },
  get (slug) {
    return Api().get('/players/' + slug + '/')
  },
  saveDescription (slug, payload) {
    return Api().patch('/players/' + slug + '/', payload)
  }
}
