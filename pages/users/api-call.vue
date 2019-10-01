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
                    class="col-4 height-50 float-left caption"
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
                    class="col-8 height-50 float-left pl-1 caption"
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
                    :items="cameras"
                    item-value="id"
                    item-text="name"
                    label="Cameras"
                    class="caption height-50 caption"
                    @change="onSelectCamera"
                    return-object
                    solo
                  >
                    <template slot="item" slot-scope="data">
                      <v-list-item-content>
                        <v-list-item-title
                          class="caption"
                          v-text="data.item.name"
                          readonly
                        />
                      </v-list-item-content>
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
                    :items="cameras"
                    item-value="id"
                    item-text="name"
                    label="Cameras"
                    class="caption height-50 caption"
                    @change="onSelectRecordedCamera"
                    :value="recordedSelectedCamera"
                    return-object
                    solo
                  >
                    <template slot="item" slot-scope="data">
                      <v-list-item-content>
                        <v-list-item-title
                          class="caption"
                          v-text="data.item.name"
                        />
                      </v-list-item-content>
                    </template>
                  </v-select>
                </td>
              </tr>
              <tr>
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
                      class="col-12 float-left height-50 border-bottom pl-2 pt-4 caption"
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

.v-data-table__wrapper {
  overflow-x: visible;
  overflow-y: visible;
}

.height-50 {
  height: 50px;
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

.border-bottom {
  border-bottom: 1px solid #00000087;
}
</style>

<script>
import moment from "moment-timezone"
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"
import VueCtkDateTimePicker from "vue-ctk-date-time-picker"

export default {
  name: "API",
  components: {
    VueCtkDateTimePicker
  },
  data () {
    return {
      liveSelectedCamera: [],
      cameras: [],
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
  mounted() {
    this.loadCameras()
    this.$axios
      .$get(process.env.API_URL + "auth/credentials")
      .then(response => {
        this.userApiId = response.api_id
        this.userApiKey = response.api_key
      })
  },
  methods: {
    async loadCameras() {
      const { data } = await this.$axios.get(`${process.env.API_URL}cameras`)
      this.cameras = this.sortByKey(data.cameras, "name")
      let c = data.cameras[0]
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
    },
    sortByKey(list, key) {
      return list.sort(function(a, b) {
        var x, y
        x = a[key]
        y = b[key]
        if (x < y) {
          return -1
        } else {
          if (x > y) {
            return 1
          } else {
            return 0
          }
        }
      })
    }
  }
}
</script>