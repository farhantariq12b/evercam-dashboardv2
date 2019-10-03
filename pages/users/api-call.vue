<template>
<v-container>
  <v-row>
    <v-col cols="auto" lg="12" md="12" sm="12" xs="12" class="api-column">
      <v-card class="card-style">
        <v-card-title class="label subtitle-1 mb-5 break-word">API ID & Key are for use by developers. <b>Do not share this information,</b> it gives the holder access to your Evercam account.</v-card-title>
        <v-card-text>
          <v-simple-table class="api-key-id">
            <tbody>
              <tr>
                <td class="col-3 cam-label subtitle-1">
                  ID & Key
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="API ID"
                    class="height-50 float-left caption max-min-width-150"
                    :value="userApiId"
                    readonly
                    solo
                  >
                    <template slot="prepend">
                      <span class="margint-7 text-left">
                        ID:
                      </span>
                    </template>
                  </v-text-field>
                  <v-text-field
                    label="API KEY"
                    class="height-50 float-left pl-1 caption max-min-width-300"
                    :value="userApiKey"
                    readonly
                    solo
                  >
                    <template slot="prepend">
                      <span class="margint-7 text-left">
                        Key:
                      </span>
                    </template>
                  </v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          Live Snapshot
        </v-card-title>
        <v-card-text>
          <v-simple-table class="live-snapshot-area">
            <tbody>
              <tr>
                <td class="col-3 cam-label caption">
                  Choose Camera
                </td>
                <td class="col-8 caption">
                  <v-select
                    v-model="liveSelectedCamera"
                    :items="usercameras"
                    item-value="id"
                    item-text="name"
                    label="Cameras"
                    class="caption height-50 caption max-width-300"
                    @change="onSelectCamera"
                    return-object
                    solo
                  >
                    <template v-slot:selection="data">
                      <v-avatar 
                        left
                        :tile="true"
                        class="pr-3"
                        height="35px"
                      >
                        <v-img
                          :src="
                            data.item.thumbnail_url +
                              '?api_id=' +
                              userApiId +
                              '&api_key=' +
                              userApiKey
                          "
                        />
                      </v-avatar>
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item" />
                      </template>
                      <template v-else>
                        <v-list-item-avatar
                         :tile="true"
                          height="35px"
                          max-height="35px"
                          class="mr-3"
                        >
                          <img
                            :src="
                              data.item.thumbnail_url +
                                '?api_id=' +
                                userApiId +
                                '&api_key=' +
                                userApiKey
                            "
                            height="35px"
                          />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title 
                            class="caption" 
                            v-text="data.item.name"
                          />
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to JPEG
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to JPEG"
                    class="col-12 height-50 float-left caption"
                    :value="liveUrlToJpeg"
                    readonly
                    solo
                  >
                    <template slot="append">
                      <v-btn 
                        icon 
                        color="blue" 
                        x-small 
                        target="blank" 
                        :href="liveUrlToJpeg"
                      >
                        <v-icon>
                          fa fa-external-link-alt
                        </v-icon>
                      </v-btn>
                    </template>
                 </v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left caption"
                    :value="liveUrlToDash"
                    readonly
                    solo
                  >
                    <template slot="append">
                      <v-btn 
                        icon 
                        color="blue" 
                        x-small 
                        target="blank" 
                        :href="liveUrlToDash"
                      >
                        <v-icon>
                          fa fa-external-link-alt
                        </v-icon>
                      </v-btn>
                    </template>
                 </v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          Recorded Snapshot
        </v-card-title>
        <v-card-text>
          <v-simple-table class="live-snapshot-area">
            <tbody>
              <tr>
                <td class="col-3 cam-label caption">
                  Choose Camera
                </td>
                <td class="col-8 caption">
                  <v-select
                    :items="usercameras"
                    item-value="id"
                    item-text="name"
                    label="Cameras"
                    class="caption height-50 caption max-width-300"
                    @change="onSelectRecordedCamera"
                    :value="recordedSelectedCamera"
                    return-object
                    solo
                  >
                    <template v-slot:selection="data">
                      <v-avatar 
                        left
                        :tile="true"
                        class="pr-3"
                        height="35px"
                      >
                        <v-img
                          :src="
                            data.item.thumbnail_url +
                              '?api_id=' +
                              userApiId +
                              '&api_key=' +
                              userApiKey
                          "
                        />
                      </v-avatar>
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item" />
                      </template>
                      <template v-else>
                        <v-list-item-avatar
                         :tile="true"
                          height="35px"
                          max-height="35px"
                          class="mr-3"
                        >
                          <img
                            :src="
                              data.item.thumbnail_url +
                                '?api_id=' +
                                userApiId +
                                '&api_key=' +
                                userApiKey
                            "
                            height="35px"
                          />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title 
                            class="caption" 
                            v-text="data.item.name"
                          />
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select>
                </td>
              </tr>
              <tr
                class="height-50"
              >
                <td class="col-3 cam-label caption">
                  Date & Time
                </td>
                <td class="col-8 caption">
                  <vue-ctk-date-time-picker
                    v-model="api_datetime"
                    class="caption"
                    hint="Date & Time"
                    format="YYYY-MM-DDTHH:mm:ss.sss"
                    button-color="#68a2d5"
                    color="#68a2d5"
                    @input="onChangeTime"
                    no-shortcuts
                    no-header
                    no-button-now
                  >
                    <v-text-field 
                      label="URL to Dash"
                      class="col-12 float-left height-45 border-bottom pl-3 pt-3 caption max-width-300"
                      :value="liveUrlToDash"
                      readonly
                      solo
                    />
                  </vue-ctk-date-time-picker>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Snapshot
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to Snapshot"
                    class="col-12 height-50 float-left caption"
                    :value="urlToSnapshot"
                    readonly
                    solo
                  >
                    <template slot="append">
                      <v-btn
                        v-show="snapshotDataUrl" 
                        color="blue" 
                        target="blank" 
                        :href="urlToSnapshot"
                        icon 
                        x-small 
                      >
                        <v-icon>
                          fa fa-external-link-alt
                        </v-icon>
                      </v-btn>
                    </template>
                 </v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left caption"
                    :value="urlToDash"
                    readonly
                    solo
                  >
                    <template slot="append">
                      <v-btn 
                        color="blue" 
                        target="blank" 
                        :href="urlToDash"
                        icon 
                        x-small 
                      >
                        <v-icon>
                          fa fa-external-link-alt
                        </v-icon>
                      </v-btn>
                    </template>
                 </v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          API Documentation available here.<v-btn icon color="blue" x-small target="blank" href="https://media.evercam.io/v2/swagger/index.html"><v-icon>fa fa-external-link-alt</v-icon></v-btn>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<style scoped>
.cam-label {
  width: 30%;
}

.height-50 {
  height: 50px;
}

.height-45 {
  height: 45px;
}

.max-width-300 {
  max-width: 300px;
}

.max-min-width-300 {
  max-width: 300px;
  min-width: 200px; 
}

.max-min-width-150 {
  max-width: 150px;
  min-width: 150px; 
}

.break-word {
  word-break: break-word;
}

.margint-7 {
  margin-top: 7px;
}

.card-style {
  border-radius: 0;
  box-shadow: none;
}

.api-column td {
  border-bottom-width: 0 !important;
  height: auto;
  padding: 5px;
}

.date-time-picker {
  position: absolute;
  border-radius: 4px;
  max-width: 80%;
  z-index: 5;
  margin-top: -24px;
  max-width: 300px;
}

.border-bottom {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
</style>

<script>
import moment from "moment-timezone"
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"
import VueCtkDateTimePicker from "vue-ctk-date-time-picker"
import { mapGetters } from "vuex"

export default {
  name: "API",
  components: {
    VueCtkDateTimePicker
  },
  data () {
    return {
      liveSelectedCamera: [],
      usercameras: [],
      recordedSelectedCamera: [],
      cameraData: [],
      api_datetime: moment().format("YYYY-MM-DDTHH:mm:ss.sss"),
      date: new Date().toISOString(),
      snapshotDataUrl: false,
      userApiKey: '',
      userApiId: '',
      liveUrlToJpeg: '',
      liveUrlToDash: '',
      urlToDash: '',
      urlToSnapshot: ''
    }
  },
  computed: {
    ...mapGetters(["cameras"])
  },
  mounted() {
    this.$axios
      .$get(process.env.API_URL + "auth/credentials")
      .then(response => {
        this.userApiId = response.api_id
        this.userApiKey = response.api_key
        this.loadCameras()
      })
  },
  methods: {
    async loadCameras() {
      let myitems = []
      this.cameras.forEach(function(camera) {
        myitems.push({
          name: camera.name,
          id: camera.id,
          timezone: camera.timezone,
          thumbnail_url: camera.thumbnail_url
        })
      })
      this.usercameras = myitems
      let c = this.cameras[0]
      this.liveSelectedCamera = { name: c.name, id: c.id }
      this.recordedSelectedCamera = { name: c.name, id: c.id }
      this.onSelectCamera(c)
      this.onSelectRecordedCamera(c)
      this.cameraData = c
    },
    onChangeTime() {
      this.onSelectRecordedCamera(this.cameraData)
    },
    onSelectCamera(data) {
      this.liveUrlToJpeg = `${process.env.API_URL}cameras/${data.id}/live/snapshot?api_id=${this.userApiId}&api_key=${this.userApiKey}`
      this.liveUrlToDash = `https://dash2.evercam.io/v2/cameras/${data.id}/live/snapshot?api_id=${this.userApiId}&api_key=${this.userApiKey}`
    },
    onSelectRecordedCamera(data) {
      this.cameraData = data
      let date_time = moment.tz(this.api_datetime, data.timezone).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      this.$axios
        .get(
          `${process.env.API_URL}cameras/${data.id}/recordings/snapshots/${date_time}?api_id=${this.userApiId}&api_key=${this.userApiKey}`
        )
        .then(data => {
          this.snapshotDataUrl = true
          this.urlToSnapshot = `${process.env.API_URL}cameras/${this.cameraData.id}/recordings/snapshots/${date_time}?api_id=${this.userApiId}&api_key=${this.userApiKey}&view=true`
          this.urlToDash = `https://dash2.evercam.io/v2/cameras/${this.cameraData.id}/recordings/snapshots/${date_time}?api_id=${this.userApiId}&api_key=${this.userApiKey}`
        })
        .catch(jqXHR => {
          this.snapshotDataUrl = false
          this.urlToSnapshot = `There are no snapshots available for the selected period.`
          this.urlToDash = `https://dash2.evercam.io/v2/cameras/${this.cameraData.id}/recordings/snapshots/${date_time}?api_id=${this.userApiId}&api_key=${this.userApiKey}`
        })
    }
  }
}
</script>