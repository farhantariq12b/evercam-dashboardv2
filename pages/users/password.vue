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
          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            :rules="matchRules"
            required
          />
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
export default {
  name: "Password",
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  computed: {
    matchRules() {
      return [
        () => (this.newPassword === this.confirmPassword) || 'Please enter the same password as above'
      ]
    }
  }
}
</script>
