<template>
  <v-snackbar
      class="text-center"
      v-model="notification.snackbar"
      :bottom="y === 'bottom'"
      :color="notification.color"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ notification.text }}
    </v-snackbar>
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  export default {
    data() {
      return {
        mode: '',
        timeout: 3000,
        y: "top",
      }
    },
    created() {
      this.setNotification({});
    },
    computed: {
      ...mapGetters({
        notification: 'snapmail/getNotification',
      }),
    },
    methods: {
      ...mapMutations({
        setNotification: 'snapmail/setNotification',
      }),
    },
  }
</script>