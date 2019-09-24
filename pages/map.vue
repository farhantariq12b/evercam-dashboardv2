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
        v-for="(m, index) in markers"
        :position="m.position"
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
        markers: [
          {
            name: "House of Aleida Greve",
            position: {lat: 52.512942, lng: 6.089625}
          },
          {
            name: "House of Potgieter",
            position: {lat: 52.511950, lng: 6.091056}
          },
          {
            name: "House of Johannes Cele",
            position: {lat: 52.511047, lng: 6.091728}
          },
        ],
      };
    },
    mounted() {
      //set bounds of the map
      this.$refs.gmap.$mapPromise.then((map) => {
        const bounds = new google.maps.LatLngBounds()
        for (let m of this.markers) {
          bounds.extend(m.position)
        }
        map.fitBounds(bounds);
      });
    },
    methods: {
      toggleInfoWindow: function (marker, idx) {
        this.infoWindowPos = marker.position;
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
    height: 100rem;
  }
</style>