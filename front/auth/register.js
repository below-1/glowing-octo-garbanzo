Vue.component('validation-provider', VeeValidate.ValidationProvider);

VeeValidate.extend('required', VeeValidateRules.required)

var app = new Vue({
  el: '#register_content',
  data: {
    username: 'fuasasa',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  },
  computed: {
    fuck () {
      console.log('here')
      console.log(this.username)
      return this.username
    }
  },
  mounted () {
    console.log('here')
  }
})