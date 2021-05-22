import { createStore } from 'vuex'
import state from '@/app/store/state'
import mutations from '@/app/store/mutations'
import actions from '@/app/store/actions'
import getters from '@/app/store/getters'

const store = createStore({
  state,
  mutations,
  actions,
  getters
})

export default store
