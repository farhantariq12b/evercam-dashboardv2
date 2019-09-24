<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="require('~/assets/map/thumbnail.jpeg')" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <p class="card-content-text">
         GPOCam 
        <i class="fa fa-external-link-alt font-12"></i>  
      </p>
      <div class="divider-line"></div>
      <div class="card-footer-grid">
        <div class="card-footer-item">
          <p class="font-weight-medium">Vendor/Model</p>
        </div>
        <div class="card-footer-item">
          <p>
            <img :src="require('~/assets/map/hikvision.jpg')" width="60" height="8" alt="Placeholder image">
            /Hikvision
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['marker'],
  }
</script>

<style>
  .card-image img {
    width: 300px;
    height: 169px;
    margin-top: 18px;
  }
  .divider-line {
    height: 1px;
    background-color: #ddd;
    width: 100%;
  }
  .card-content-text {
    text-align: center;
    margin-top: 5px;
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 7px !important;
    font-family: "PingFang SC","Helvetica Neue","Hiragino Sans GB","Segoe UI","Microsoft YaHei","微软雅黑",sans-serif;
    font-weight: normal;
  }
  
  .card-content-text .fa {
    color: #2a6496;
    font-size: 12px;
  }
  .card-footer-grid {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 40% 60%;
  }
  .card-footer-item p {
    margin-bottom: 7px;
    font-size: 12px;
  }
</style>