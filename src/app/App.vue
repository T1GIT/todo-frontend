<template>
  <Todo v-if="isAuthenticated"></Todo>
  <Authorisation v-else></Authorisation>
</template>

<script>
import Authorisation from './components/authorisation/Authorisation.vue'
import Todo from './components/home/Home.vue'
import { CREATE_FINGERPRINT, REFRESH } from '@/app/store/actions'
import { ERASE } from '@/app/store/mutations'

export default {
  name: 'App',
  created () {
    this.$store.dispatch(CREATE_FINGERPRINT)
      .then(() => this.$store.dispatch(REFRESH)
        .catch(() => this.$store.commit(ERASE)))
  },
  components: {
    Authorisation: Authorisation,
    Todo: Todo
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>

<style lang="sass">

*
  font-family: "Trebuchet MS", sans-serif

html, body
  margin: 0 !important
  padding: 0 !important
</style>
