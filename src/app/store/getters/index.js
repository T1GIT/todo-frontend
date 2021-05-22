const getters = {
  isAuthenticated: state => !!state.jwt,
  isReady: state => !!state.fingerprint,
  authHeader: state => { return { Authorization: 'Bearer ' + state.jwt } }
}

export default getters
