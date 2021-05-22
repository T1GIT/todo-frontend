const VALIDATION_TIMEOUT = 200 // milliseconds
const EMAIL_PATTERN = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,63})$'
const PSW_PATTERN = '^(?=.*[0-9])(?=.*[a-zA-Zа-яА-Я]).*$'

export { VALIDATION_TIMEOUT, EMAIL_PATTERN, PSW_PATTERN }
