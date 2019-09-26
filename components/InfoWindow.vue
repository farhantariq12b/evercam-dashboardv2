<template>
  <v-card max-width="300" class="pt-5 px-0 pb-0">
    <v-img
      max-width="300"
      height="169px"
      class="white--text"
      :src="`${marker.thumbnail_url}?authorization=${token}`"
    />

    <v-card-text class="pa-0 text-center black--text overline">
      {{ marker.name }}
      <nuxt-link :to="`cameras/${marker.id}`">
        <v-icon color="#2a6496" size="12">
          fas fa-external-link-alt
        </v-icon>
      </nuxt-link>
    </v-card-text>

    <v-divider />
    <v-container>
      <v-layout row wrap class="mt-1">
        <v-flex md5>
          <v-card-text class="pa-0 caption font-weight-medium">
            Vendor/Model
          </v-card-text>
        </v-flex>
        <v-flex md6>
          <v-card-text class="pa-0 caption font-weight-thin">
            {{ marker.vendor_name }}/{{ marker.model_name }}
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  props: ["marker"],
  computed: {
    ...mapGetters(["token"])
  }
}
</script>
