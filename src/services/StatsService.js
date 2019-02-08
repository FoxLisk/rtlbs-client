import Api from '@/services/Api'

export default {
  getStats (category) {
    return Api().get('/stats/?category=' + category)
  },
  getCategories () {
    return Api().get('/stats/categories/')
  }
}
