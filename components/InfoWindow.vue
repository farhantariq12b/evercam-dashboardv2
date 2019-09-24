<template>
  <v-card class="card">
    <v-img
      class="white--text card-image"
      height="200px"
      :src="marker.thumbnail_url"
    >
    </v-img>

    <v-card-text class="card-content-text">
      {{marker.name}}
      <i class="fa fa-external-link-alt font-12"></i>  
    </v-card-text>

    <v-divider class="divider-line"></v-divider>
    <div class="card-footer-grid">
      <v-card-text class="card-footer-item pad-l-8 font-weight-medium">
        Vendor/Model
      </v-card-text>
      <v-card-text class="card-footer-item">
          {{marker.vendor_name}}/{{marker.model_name}}
      </v-card-text>
    </div>
  </v-card>
</template>
<script>
  export default {
    props: ['marker'],
  }
</script>

<style>
  .pad-l-8{
    padding-left: 8px !important;
  }
  .card {
    width: 300px;
    padding: 20px 0px 0px 0px;
    box-shadow: none;
    overflow: hidden;
  }
  .card-image {
    width: 300px !important;
    height: 169px !important;
    border-radius: 0 !important;
  }
  .divider-line {
    border-color: #ddd !important;
  }
  .card-content-text {
    padding: 5px;
    color: #000 !important;
    text-align: center;
    font-size: 10px;
    font-weight: 600 !important;
    font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
    font-weight: normal;
  }
  
  .card-content-text .fa {
    color: #2a6496;
    font-size: 12px;
  }
  .card-footer-grid {
    margin-top: 5px;
    display: grid;
    grid-template-columns: 41% 59%;
  }
  .card-footer-item {
    padding: 0px;
    margin-bottom: 7px;
    font-size: 12px;
  }
</style>