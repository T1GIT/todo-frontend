const initialState = {
  jwt: '',
  fingerprint: '',
  user: {
    email: '',
    name: '',
    surname: '',
    patronymic: '',
    role: '',
    birthdate: ''
  }
}

const state = { ...initialState }

export default state
export { initialState }
