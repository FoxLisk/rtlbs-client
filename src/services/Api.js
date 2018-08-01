import axios from 'axios'
import store from '@/store'
import config from '@/config'

function check (response) {
  response.catch(e => {
    if (e.response.status === 401) {
      store.dispatch('setToken', null)
      store.dispatch('setUser', null)
      window.location.reload()
    }
  })
  return response
}

export default () => {
  const headers = {}
  if (store.state.jwt) {
    headers.Authorization = `JWT ${store.state.jwt}`
  }

  const a = axios.create({
    baseURL: config.API_URL,
    headers: headers
  })

  return {
    get (...args) {
      return check(a.get(...args))
    },
    post (...args) {
      return check(a.post(...args))
    },
    put (...args) {
      return check(a.put(...args))
    },
    patch (...args) {
      return check(a.patch(...args))
    },
    delete (...args) {
      return check(a.delete(...args))
    }
  }
}
