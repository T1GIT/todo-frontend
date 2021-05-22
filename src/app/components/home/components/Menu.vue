<template>
  <button :class="$style.button" @click="hidden = !hidden">Меню</button>
  <div :class="$style.menu" v-show="!hidden">
    <label for="email">{{ form.email.advice }}</label>
    <input id="email"
           placeholder="Почта"
           type="email"
           autocomplete="email"
           v-model="form.email.value"
           @keydown="debouncedValidateEmail">
    <button type="button"
            :disabled="form.email.advice || !form.email.value"
            @click="changeEmail">
      Изменить
    </button>
    <label for="psw">{{ form.psw.advice }}</label>
    <input id="psw"
           placeholder="Пароль"
           type="password"
           autocomplete="password"
           v-model="form.psw.value"
           @keydown="debouncedValidatePsw">
    <button type="button"
            :disabled="form.psw.advice || !form.psw.value"
            @click="changePsw">
      Изменить
    </button>
    <input type="text" placeholder="Имя" autocomplete="name" v-model="form.name">
    <input type="text" placeholder="Фамилия" autocomplete="surname" v-model="form.surname">
    <input type="text" placeholder="Отчество" autocomplete="patronymic" v-model="form.patronymic">
    <input type="date" placeholder="Дата рождения" autocomplete="date" v-model="form.birthdate">
    <button type="button"
            @click="changeAdditional">
      Изменить
    </button>
    <button type="button"
            @click="deleteUser">
      Удалить
    </button>
    <hr>
    <button type="button"
            @click="logout">
      Выйти
    </button>
  </div>
</template>

<script>
import _ from 'lodash'
import { EMAIL_PATTERN, PSW_PATTERN, VALIDATION_TIMEOUT } from '@/app/components/authorisation/shared/constants'
import { CHANGE_ADDITIONAL, CHANGE_EMAIL, CHANGE_PSW, DELETE_USER, LOGOUT } from '@/app/store/actions'

export default {
  name: 'SideMenu',
  data () {
    return {
      form: {
        email: {
          value: '',
          advice: ''
        },
        psw: {
          value: '',
          advice: ''
        },
        name: '',
        surname: '',
        patronymic: '',
        birthdate: '2000-01-01'
      },
      hidden: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.form = {
      email: {
        value: this.user.email,
        advice: ''
      },
      psw: {
        value: '',
        advice: ''
      },
      name: this.user.name,
      surname: this.user.surname,
      patronymic: this.user.patronymic,
      birthdate: this.user.birthdate
    }
  },
  methods: {
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
    changeEmail () {
      const email = this.form.email.value
      if (email !== this.$store.state.user.email) {
        this.$store.dispatch(CHANGE_EMAIL, email)
          .catch(({ response: { status } }) => {
            if (status === 409) {
              this.form.email.advice = 'Почта уже занята'
            }
          })
      }
    },
    changePsw () {
      this.$store.dispatch(CHANGE_PSW, this.form.psw.value)
    },
    changeAdditional () {
      this.$store.dispatch(CHANGE_ADDITIONAL, {
        name: this.form.name,
        surname: this.form.surname,
        patronymic: this.form.patronymic,
        birthdate: this.form.birthdate
      })
    },
    deleteUser () {
      if (confirm('Вы уверены, что хотите удалить аккаунт?')) {
        this.$store.dispatch(DELETE_USER)
      }
    },
    logout () {
      this.$store.dispatch(LOGOUT)
    }
  }
}
</script>

<style module lang="sass">
@mixin right-up-attach
  position: absolute
  top: 0
  right: 0

.button
  +right-up-attach

.menu
  +right-up-attach
  display: flex
  flex-direction: column
  align-items: center
  padding: 5px
  background: gray
  top: 30px
  width: max-content
  height: max-content

  *
    width: 100%
    margin: 5px
    padding: 3px
</style>
