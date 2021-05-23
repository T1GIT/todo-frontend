<template>
  <form
    @keypress.enter="authorise"
    v-show="this.$store.getters.isReady"
    :class="$style.form">
    <div :class="$style.header">
      <button type="button" @click="changeMode('login')">Вход</button>
      <button type="button" @click="changeMode('register')">Регистрация</button>
    </div>
    <label for="email">{{form.email.advice}}</label>
    <input id="email"
           placeholder="Почта"
           type="email"
           autocomplete="email"
           v-model="form.email.value"
           @keydown="debouncedValidateEmail">
    <label for="psw">{{form.psw.advice}}</label>
    <input id="psw"
           placeholder="Пароль"
           type="password"
           autocomplete="password"
           v-model="form.psw.value"
           @keydown="debouncedValidatePsw">
    <template v-if="showExtraFields">
      <hr>
      <label for="rePsw">{{form.rePsw.advice}}</label>
      <input id="rePsw"
             placeholder="Пароль ещё раз"
             type="password"
             autocomplete="password"
             v-model="form.rePsw.value"
             @keydown="debouncedValidateRePsw">
      <input type="text" placeholder="Имя" autocomplete="name" v-model="form.name">
      <input type="text" placeholder="Фамилия" autocomplete="surname" v-model="form.surname">
      <input type="text" placeholder="Отчество" autocomplete="patronymic" v-model="form.patronymic">
      <input type="date" placeholder="Дата рождения" autocomplete="date" v-model="form.birthdate">
    </template>
    <button
      type="button"
      :disabled="!valid && this.$store.getters.isReady"
      :class="$style.submit"
      @click="authorise"
    >{{button}}</button>
  </form>
</template>

<script>
import _ from 'lodash'
import { EMAIL_PATTERN, PSW_PATTERN, VALIDATION_TIMEOUT } from '@/app/components/authorisation/shared/constants'
import { LOGIN, REGISTER } from '@/app/store/actions'

export default {
  name: 'Authorisation',
  data () {
    return {
      form: {
        email: { value: '', advice: '' },
        psw: { value: '', advice: '' },
        rePsw: { value: '', advice: '' },
        name: '',
        surname: '',
        patronymic: '',
        birthdate: (new Date()).toJSON().substr(0, 10)
      },
      mode: 'login'
    }
  },
  computed: {
    valid () {
      const { email, psw, rePsw } = this.form
      return (
        (!email.advice && email.value) &&
        (!psw.advice && psw.value) &&
        (!this.showExtraFields ||
          (!rePsw.advice && rePsw.value))
      )
    },
    showExtraFields () {
      return this.mode === 'register'
    },
    button () {
      if (this.mode === 'login') {
        return 'Вход'
      } else {
        return 'Регистрация'
      }
    }
  },
  methods: {
    changeMode (mode) {
      this.mode = mode
      this.debouncedValidateEmail()
      this.debouncedValidatePsw()
    },
    debouncedValidateEmail: _.debounce(function () {
      const { value } = this.form.email
      if (value === '') {
        this.form.email.advice = ''
      } else if (!(value.match(EMAIL_PATTERN) && value.length > 10 && value.length < 256)) {
        this.form.email.advice = 'Почта не верна'
      } else {
        this.form.email.advice = ''
      }
    }, VALIDATION_TIMEOUT),
    debouncedValidatePsw: _.debounce(function () {
      const { value } = this.form.psw
      if (value === '') {
        this.form.psw.advice = ''
      } else if (!(value.match(PSW_PATTERN) && value.length >= 8 && value.length <= 120)) {
        this.form.psw.advice = 'Пароль некорректен'
      } else {
        this.form.psw.advice = ''
      }
    }, VALIDATION_TIMEOUT),
    debouncedValidateRePsw: _.debounce(function () {
      const { value } = this.form.rePsw
      if (value === '') {
        this.form.rePsw.advice = ''
      } else if (value !== this.form.psw.value) {
        this.form.rePsw.advice = 'Пароли не совпадают'
      } else {
        this.form.rePsw.advice = ''
      }
    }, VALIDATION_TIMEOUT),
    authorise () {
      const { email, psw, name, surname, patronymic, birthdate } = this.form
      switch (this.mode) {
        case 'login':
          this.$store.dispatch(LOGIN, {
            email: email.value,
            psw: psw.value
          }).catch(({ response: { status } }) => {
            switch (status) {
              case 404:
                this.form.email.advice = 'Почта не найдена'
                break
              case 401:
                this.form.psw.advice = 'Неверный пароль'
                break
            }
          })
          break
        case 'register':
          this.$store.dispatch(REGISTER, {
            email: email.value,
            psw: psw.value,
            name,
            surname,
            patronymic,
            birthdate
          }).catch(({ response: { status } }) => {
            if (status === 409) {
              this.form.email.advice = 'Почта уже занята'
            }
          })
          break
      }
    }
  }
}
</script>

<style module lang="sass">
.form
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  hr
    height: 3px
    border: none
    border-radius: 2px
    width: 90%
    outline: none
    background: white
  input, button
    border-radius: 4px
    outline: none !important
    border: 3px solid transparent
    box-sizing: content-box
    height: 20px
    width: 280px
    margin: 5px 0
    padding: 3px
    &:hover
      border-color: #3c3ca5
  .header
    width: 280px
    height: 50px
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-around
    button
      width: 100px
  .submit
    margin: 20px
</style>
