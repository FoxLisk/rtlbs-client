import Api from '@/services/Api'

export default {
  getStats (category) {
    return Api().get('/stats/?category=' + category)
  },
  getLeaderboards (category, date) {
    return Api().get('/stats/leaderboards/?category=' + category + '&date=' + date)
  },
  getCategories () {
    return Api().get('/stats/categories/')
  }
}
