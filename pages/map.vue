<template>
  <div>
    <gmap-map
      :options="{
        zoomControl: false,
        mapTypeControl: false,
      }"
      ref="gmap"
      :center="center"
      :zoom="12"
      class="map-box"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in cameras"
        :position="m.location"
        @click="toggleInfoWindow(m,index)">
      </gmap-marker>

      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      >
        <InfoWindow :marker="infoContent" />
      </gmap-info-window>
    </gmap-map>
  </div>
</template>
<script>
  import InfoWindow from '@/components/InfoWindow';
  import { mapGetters } from "vuex";

  export default {
    name: "GoogleMap",
    components: {
      InfoWindow
    },
    data() {
      return {
        center: { 
          lat: 52.511950, 
          lng: 6.089625 
        },
        map: null,
        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
      };
    },
    mounted() {
      //set bounds of the map
      this.$refs.gmap.$mapPromise.then((map) => {
        const bounds = new google.maps.LatLngBounds()
        for (let m of this.cameras) {
          bounds.extend(m.location)
        }
        map.fitBounds(bounds);
      });
    },
    computed: {
      ...mapGetters(["cameras"])
    },
    methods: {
      toggleInfoWindow: function (marker, idx) {
        this.infoWindowPos = marker.location;
        this.infoContent = marker;
        
        //check if its the same marker that was selected if yes toggle
        if (this.currentMidx == idx) {
          this.infoWinOpen = !this.infoWinOpen;
        }
        //if different marker set infowindow to open and reset current marker index
        else {
          this.infoWinOpen = true;
          this.currentMidx = idx;
        }
      },
    }
  };
</script>
<style>
  .map-box {
    width:100%;
    height: 100vh;
  }
</style>