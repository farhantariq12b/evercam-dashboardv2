import { extend } from "vee-validate"
import { required, email, confirmed } from "vee-validate/dist/rules"

extend("required", required)
extend("email", {
  ...email,
  message: "Invalid email"
})
extend("confirmed", {
  ...confirmed,
  message: "Please enter the same password as above"
})
