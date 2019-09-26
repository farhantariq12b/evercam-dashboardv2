<template>
  <v-card
    max-width="300"
    class="pt-5 px-0 pb-0">
    <v-img
      max-width="300"
      height="169px"
      class="white--text br-0"
      :src="`${marker.thumbnail_url}?authorization=${token}`"
    >
    </v-img>

    <v-card-text class="pa-0 text-center card-content-text">
      {{marker.name}}
      <nuxt-link to="cameras/https-bhgfx">
        <v-icon class="icon font-12">fas fa-external-link-alt</v-icon>
      </nuxt-link>
    </v-card-text>

    <v-divider class="divider-color"></v-divider>
    <div class="mt-1 card-footer-grid">
      <v-card-text class="pa-0 font-12 mb-2 font-weight-medium">
        Vendor/Model
      </v-card-text>
      <v-card-text class="pa-0 font-12 mb-2">
          {{marker.vendor_name}}/{{marker.model_name}}
      </v-card-text>
    </div>
  </v-card>
</template>
<script>
  import { mapGetters } from "vuex";

  export default {
    props: ['marker'],
    computed: {
      ...mapGetters(["token"])
    },
  }
</script>

<style>
  .br-0 {
    border-radius: 0px !important;
  }
  .divider-color {
    border-color: #DDDDDD !important;
  }
  .font-12 {
    font-size: 12px !important;
  }
  .card-content-text {
    color: #000 !important;
    font-size: 10px;
    font-weight: 600 !important;
    font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
  }
  .card-content-text .icon {
    color: #2a6496;
  }
  .card-footer-grid {
    display: grid;
    grid-template-columns: 41% 59%;
  }
</style>