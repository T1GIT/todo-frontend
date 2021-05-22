import * as actionType from '@/app/store/actions/actions.types'
import * as mutationType from '@/app/store/mutations/mutations.types'
import axios from 'axios'
import { API_URL } from '@/environment/environment'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import store from '@/app/store'
import { REFRESH_TIMEOUT } from '@/app/shared/constants'
import { ERASE } from '@/app/store/mutations/mutations.types'

const httpAuthService = axios.create({
  baseURL: new URL('authorisation', API_URL).toString(),
  withCredentials: true
})

const httpUserService = axios.create({
  baseURL: new URL('user', API_URL).toString(),
  withCredentials: true
})

function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

function sendForm (url, data, commit, state) {
  return new Promise((resolve, reject) => {
    httpAuthService.post(url, data)
      .then(({ data: { jwt } }) => {
        const { email, name, surname, patronymic, role, birthdate, iat, exp } = parseJwt(jwt)
        const user = {
          email,
          name,
          surname,
          patronymic,
          role,
          birthdate: new Date(birthdate).toJSON().substr(0, 10)
        }
        commit(mutationType.SET_AUTH, { jwt, user })
        setTimeout(() => {
          store.dispatch(actionType.REFRESH)
        }, (exp - iat - REFRESH_TIMEOUT) * 1000)
        resolve(state.user)
      })
      .catch(reject)
  })
}

const actions = {
  [actionType.CREATE_FINGERPRINT] ({ commit }) {
    return new Promise((resolve, reject) => {
      FingerprintJS.load()
        .then(agent => {
          agent.get()
            .then(({ visitorId }) => {
              commit(mutationType.SET_FINGERPRINT, visitorId)
              resolve(visitorId)
            })
            .catch(reject)
        }).catch(reject)
    })
  },
  [actionType.REGISTER] ({
    commit,
    state
  }, user) {
    return sendForm('/register', {
      user,
      fingerprint: state.fingerprint
    }, commit, state)
  },
  [actionType.LOGIN] ({
    commit,
    state
  }, user) {
    return sendForm('/login', {
      user,
      fingerprint: state.fingerprint
    }, commit, state)
  },
  [actionType.REFRESH] ({
    commit,
    state
  }) {
    return sendForm('/refresh', {
      fingerprint: state.fingerprint
    }, commit, state)
  },
  [actionType.LOGOUT] ({ commit }) {
    return httpAuthService.post(
      '/logout'
    ).then(() => commit(ERASE))
  },
  [actionType.CHANGE_EMAIL] ({
    commit,
    state
  }, email) {
    return httpUserService.patch(
      '/email', { email }, { headers: store.getters.authHeader }
    )
  },
  [actionType.CHANGE_PSW] (_, psw) {
    return httpUserService.patch(
      '/psw', { psw }, { headers: store.getters.authHeader }
    )
  },
  [actionType.CHANGE_ADDITIONAL] ({
    commit,
    state
  }, user) {
    return httpUserService.put(
      '', user, { headers: store.getters.authHeader }
    )
  },
  [actionType.DELETE_USER] ({ commit }) {
    return httpUserService.delete('', { headers: store.getters.authHeader })
      .then(() => commit(ERASE))
  }
}

export default actions
