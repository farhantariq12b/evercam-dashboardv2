<template>
<v-container>
  <v-row>
    <v-col cols="auto" lg="12" md="12" sm="12" xs="12" class="api-column">
      <v-card class="card-style">
        <v-card-text>API ID & Keys are for use by developers. <b>Do not share this information,</b> it gives the holder access to your Evercam account.</v-card-text>
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
                    class="col-4 height-50 float-left"
                    :value="userApiId"
                    readonly
                    solo
                  >
                    <template slot="prepend">
                      <span class="mt-1 text-left">
                        ID:
                      </span>
                    </template>
                  </v-text-field>
                  <v-text-field
                    label="API KEY"
                    class="col-8 height-50 float-left pl-1"
                    :value="userApiKey"
                    readonly
                    solo
                  >
                    <template slot="prepend">
                      <span class="mt-1 text-left">
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
                    class="caption height-50"
                    return-object
                    @change="onSelectCamera"
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
                  URL to JPEG
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to JPEG"
                    class="col-12 height-50 float-left"
                    :value="liveUrlToJpeg"
                    solo
                  />
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left"
                    :value="liveUrlToDash"
                    solo
                  />
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
                    v-model="recordedSelectedCamera"
                    :items="cameras"
                    item-value="id"
                    item-text="name"
                    label="Cameras"
                    class="caption height-50"
                    return-object
                    @change="onSelectRecordedCamera"
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
                  <v-col lg="6" md="6" sm="12" class="float-left pl-0">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      max-width="295px"
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date"
                          label="Date"
                          prepend-icon="far fa-calendar-alt"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col lg="6" md="6" sm="12" class="float-left pl-0 pr-0">
                    <v-menu
                      ref="menu"
                      v-model="timeMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      max-width="295px"
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time"
                          label="Time"
                          prepend-icon="far fa-clock"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="timeMenu"
                        v-model="time"
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Snapshot
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to Snapshot"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
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
.card-style {
  border-radius: 0;
  box-shadow: none;
}
.api-column td {
  border-bottom-width: 0 !important;
  height: auto;
  padding: 5px;
}
</style>

<script>
export default {
  data () {
    return {
      userApiId: '',
      userApiKey: '',
      liveSelectedCamera: '',
      cameras: [],
      liveUrlToJpeg: '',
      liveUrlToDash: '',
      recordedSelectedCamera: '',
      time: null,
      timeMenu: false,
      date: new Date().toISOString().substr(0, 10)
    }
  },
  mounted() {
    this.loadCameras()
    this.$axios
      .$get(process.env.API_URL + "auth/credentials")
      .then(response => {
        this.userApiId = response.api_id
        this.userApiKey = response.api_key
        console.log(this.userApiId )
        console.log(this.userApiKey )
      })
  },
  methods: {
    async loadCameras() {
      const { data } = await this.$axios.get(`${process.env.API_URL}cameras`)
      this.cameras = this.sortByKey(data.cameras, "name")
      let c = data.cameras[0].name
      this.liveSelectedCamera = data.cameras[0].name
    },
    onSelectCamera(data) {
      this.liveUrlToJpeg = `${process.env.API_URL}cameras/${data.id}/live/snapshot?api_id=${this.userApiId}&api_key=${this.userApiKey}`
      this.liveUrlToDash = `https://dash2.evercam.io/v2/cameras/${data.id}/live/snapshot?api_id=${this.userApiId}&api_key=${this.userApiKey}`
    },
    onSelectRecordedCamera(data) {
      
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