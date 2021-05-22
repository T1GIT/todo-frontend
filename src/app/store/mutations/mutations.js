import { SET_FINGERPRINT, SET_AUTH, ERASE, SET_EMAIL, SET_ADDITIONAL } from '@/app/store/mutations/mutations.types'
import { initialState } from '@/app/store/state'

const mutations = {
  [SET_FINGERPRINT] (state, fingerprint) {
    state.fingerprint = fingerprint
  },
  [SET_AUTH] (state, { jwt, user }) {
    state.jwt = jwt
    state.user = user
  },
  [ERASE] (state) {
    Object.assign(state, { ...initialState, fingerprint: state.fingerprint })
  },
  [SET_EMAIL] (state, email) {
    state.user.email = email
  },
  [SET_ADDITIONAL] (state, user) {
    Object.assign(state.user, user)
  }
}

export default mutations
