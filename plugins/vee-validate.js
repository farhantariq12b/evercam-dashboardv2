import Vue from "vue";
import { ValidationProvider, ValidationObserver } from 'vee-validate'; 
import { extend } from "vee-validate";
import { required, email, confirmed } from "vee-validate/dist/rules"
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

extend('required', {
  ...required,
  message: '{_field_} field is required'
});
extend('email', {
  ...email,
  message: "Invalid email"
})
extend("confirmed", {
  ...confirmed,
  message: "Please enter the same password as above"
})
