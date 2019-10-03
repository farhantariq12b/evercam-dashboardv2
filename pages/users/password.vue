<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" lg="5" md="5" sm="12" xs="12" class="password-column ml-4 mt-5">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            type="password"
            required
          ></v-text-field>
          <ValidationObserver>
            <ValidationProvider rules="required" vid="confirmation">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                required
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider rules="required|confirmed:confirmation">
              <v-text-field
                v-model="confirmPassword"
                slot-scope="{ errors, valid }"
                :error-messages="errors"
                :success="valid"
                label="Confirm Password"
                type="password"
                required
              />
            </ValidationProvider>
          </ValidationObserver>
          <v-btn
            color="primary"
            class="button-margin-left mt-5"
          >
            Change Password
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
</style>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  withValidation
} from "vee-validate"
export default {
  name: "Password",
  components: {
  ValidationProvider,
  ValidationObserver
  },
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }
}
</script>
