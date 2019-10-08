<template>
  <v-container>
    <v-row>
      <v-col col="12" lg="12">
        <vue-ctk-date-time-picker
          v-model="oldest_datetime"
          class="datetime-picker"
          format="YYYY-MM-DDTHH:mm:ss"
          button-color="#68a2d5"
          color="#68a2d5"
          label="First"
          no-header
          no-button-now
          :no-value-to-custom-elem="true"
          :no-clear-button="true"
          @validate="changebeforeDate"
        >
          <v-btn color="primary">
            <v-icon class="pr-2">fas fa-calendar-alt</v-icon>
            Before
          </v-btn>
        </vue-ctk-date-time-picker>

        <vue-ctk-date-time-picker
          v-model="after_datetime"
          class="datetime-picker float-right after_datetime"
          format="YYYY-MM-DDTHH:mm:ss"
          button-color="#68a2d5"
          color="#68a2d5"
          label="Last"
          no-header
          no-button-now
          :no-value-to-custom-elem="true"
          :no-clear-button="true"
          :right="true"
          @validate="changeLastDate"
        >
          <v-btn color="primary" class="float-right">
            <v-icon class="pr-2">fas fa-calendar-alt</v-icon>
            After
          </v-btn>
        </vue-ctk-date-time-picker>
        <VueCompareImage
          :left-image="before_img"
          :right-image="after_img"
        />

        <v-btn color="primary" class="share-button" @click="dialog = !dialog">
          Share / Download / Embed
        </v-btn>
        <img
          :src="require('~/static/watermark.png')"
          class="evercam-logo"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pa-3 ml-1">
          <span class="subtitle-1">
            Share / Download / Embed
          </span>
        </v-card-title>

        <v-card-text class="px-4">
          <v-text-field
            v-model="title"
            label="Title"
            class="caption"
            required
          />
          <v-textarea
            v-if="processing || created"
            v-model="embed_code"
            id="embedcode"
            name="input-7-1"
            label="Embed Code"
            class="caption"
            rows="3"
            no-resize
            readonly
          >
            <template slot="append" class="align-center">
              <v-btn
                text
                icon
                @click="doCopy('embedcode')"
              >
                <v-icon
                  class="pr-2"
                  size="16"
                >
                  fas fa-copy
                </v-icon>
              </v-btn>
            </template>
          </v-textarea>

          <v-card
            v-if="processing"
            flat
            class="caption">
            <p>This may take up to 1 minute</p>
            <p>Once completed, links will appear here to view / download.</p>
            <p>This will also appear in your Archives tab above.</p>
          </v-card>

          <v-text-field
            v-if="created"
            v-model="gifURL"
            id="gifurl"
            label="GIF URL"
            class="caption"
            readonly
          >
            <template slot="append">
              <v-btn
                text
                icon
                @click="doCopy('gifurl')"
              >
                <v-icon
                  class="pr-2"
                  size="16"
                >
                  fas fa-copy
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-text-field
            v-if="created"
            v-model="mp4URL"
            ref="mp4url"
            id="mp4url"
            label="MP4 URL"
            class="caption"
            readonly
          >
            <template slot="append">
              <v-btn
                text
                icon
                :data-clipboard-text="mp4URL"
                @click="doCopy('mp4url')"
              >
                <v-icon
                  class="pr-2"
                  size="16"
                >
                  fas fa-copy
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>

        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="disableCreate"
            @click="createCompare"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.align-center {
  align-self: center !important;
}

.container {
  height: auto !important;
}

.date-time-picker {
  z-index: 1 !important;
  position: absolute !important;
  padding: 15px !important;
  width: 265px;
}

.share-button {
  bottom: 25px;
  left: 10px;
  display: table;
  position: absolute;
  z-index: 15;
}

.after_datetime {
  right: 5px;
}

.evercam-logo {
  bottom: 20px;
  display: table;
  height: auto;
  position: absolute;
  right: 10px;
  z-index: 10;
}
</style>

<script>
import Clipboard from 'clipboard'
import moment from "moment-timezone"
import VueCompareImage from "vue-compare-image"
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"
import VueCtkDateTimePicker from "vue-ctk-date-time-picker"

export default {
  name: "Compares",
  components: {
    Clipboard,
    VueCompareImage,
    VueCtkDateTimePicker
  },
  data() {
    return {
      disableCreate: false,
      gifURL: "",
      mp4URL: "Azhar Malik",
      dialog: false,
      embed_code: "",
      processing: false,
      created: false,
      clearTimeOut: null
    }
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}`
    )
    let c = data.cameras[0]

    let before_image = require("~/static/unavailable.jpg")
    let before_date = moment()
    let after_image = require("~/static/unavailable.jpg")
    let after_date = moment()

    try {
      const before_response = await $axios.$get(`${process.env.API_URL}cameras/${params.id}/recordings/snapshots/oldest`)
      before_image = before_response.data
      before_date = moment.tz(before_response.created_at, c.timezone)
    } catch(e) {}

    try {
      const after_response = await $axios.$get(
        `${process.env.API_URL}cameras/${params.id}/recordings/snapshots/latest`, {
          params: {
            is_save: true
          }
        }
      )
      after_image = after_response.data
      after_date = moment.tz(after_response.created_at, c.timezone)
    } catch(e) {}

    return {
      camera: c,
      before_img: before_image,
      oldest_datetime: before_date.format("YYYY-MM-DDTHH:mm:ss"),
      after_img: after_image,
      after_datetime: after_date.format("YYYY-MM-DDTHH:mm:ss"),
      title: `${before_date.format("Do MMM")} to ${after_date.format("Do MMM")}`
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    async changeLastDate() {
      try {
        let datetime = moment.tz(this.after_datetime, this.camera.timezone).toISOString(true)
        const { snapshots } = await this.$axios.$get(`${process.env.API_URL}cameras/${this.$route.params.id}/recordings/snapshots/${datetime}/nearest`)
        if(snapshots[0]) {
          this.after_img = snapshots[0].data
          this.after_datetime = moment.tz(snapshots[0].created_at, this.camera.timezone).format("YYYY-MM-DDTHH:mm:ss")
          this.updateTitle()
        }
      } catch(e) {
        console.log(e)
      }
    },
    async changebeforeDate() {
      try {
        let datetime = moment.tz(this.oldest_datetime, this.camera.timezone).toISOString(true)
        const { snapshots } = await this.$axios.$get(`${process.env.API_URL}cameras/${this.$route.params.id}/recordings/snapshots/${datetime}/nearest`)
        if(snapshots[0]) {
          this.before_img = snapshots[0].data
          this.oldest_datetime = moment.tz(snapshots[0].created_at, this.camera.timezone).format("YYYY-MM-DDTHH:mm:ss")
          this.updateTitle()
        }
      } catch(e) {
        console.log(e)
      }
    },
    async createCompare() {
      this.processing = true
      this.disableCreate = true
      let compare_exid = `${this.title.replace(/[^A-Z0-9]/ig, "").slice(0, 5)}-${this.makeRandString()}`.toLowerCase()
      let before = moment.tz(this.oldest_datetime, this.camera.timezone).utc().format('YYYY-MM-DD-HH_mm_ss')
      let after = moment.tz(this.after_datetime, this.camera.timezone).utc().format('YYYY-MM-DD-HH_mm_ss')
      this.embed_code = `<div id='evercam-compare'></div><script src='https://dash.evercam.io/assets/evercam_compare.js' class='${this.$route.params.id} ${before} ${after} ${compare_exid} autoplay'><\/script>`

      let params = {
        name: this.title,
        before_date: moment.tz(this.oldest_datetime, this.camera.timezone).toISOString(true),
        after_date: moment.tz(this.after_datetime, this.camera.timezone).toISOString(true),
        embed: this.embed_code,
        exid: compare_exid,
        create_animation: true
      }

      try {
        const { data } = await this.$axios.post(`${process.env.API_URL}cameras/${this.$route.params.id}/compares`, params)
        this.gifURL = `${process.env.API_URL}cameras/${this.$route.params.id}/compares/${data.compares[0].id}.gif`.replace("media.evercam.io", "api.evercam.io")
        this.mp4URL = `${process.env.API_URL}cameras/${this.$route.params.id}/compares/${data.compares[0].id}.mp4`.replace("media.evercam.io", "api.evercam.io")
        this.clearTimeOut = setTimeout(function() {
          this.auto_check_compare_status(data.compares[0].id, 1)
        }.bind(this), 10000)
      }
      catch(e) {
        this.disableCreate = false
        console.log(e)
      }
    },
    async auto_check_compare_status(compare_id, tries) {
      try {
        const { data } = await this.$axios.get(`${process.env.API_URL}cameras/${this.$route.params.id}/compares/${compare_id}`)
        if(data.compares[0].status === "Completed") {
          this.processing = false
          if(this.dialog === false) {
            this.created = false
            this.disableCreate = false
          } else {
            this.created = true
          }
        }
        else if(data.compares[0].status === "Processing" && tries < 10) {
          this.clearTimeOut = setTimeout(function() {
            this.auto_check_compare_status(data.compares[0].id, tries + 1)
          }.bind(this), 10000)
        }
      }
      catch(e) {
        console.log(e)
      }
    },
    makeRandString() {
      let text = ""
      let possible = "abcdefghijklmnopqrstuvwxyz"
      let i = 0
      while(i < 6) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
        i++
      }
      return text
    },
    clearTimer() {
      clearTimeout(this.clearTimeOut)
      this.processing = false
      this.created = false
      this.disableCreate = false
    },
    closeDialog() {
      this.dialog = false
      this.processing = false
      this.created = false
      this.disableCreate = false
      this.clearTimer()
    },
    doCopy(id) {
      // this.$refs.mp4url.focus()
      document.querySelector(`#${id}`).select()

      try {
        var successful = document.execCommand('copy')
      } catch (err) {
        console.log('Oops, unable to copy')
      }
    },
    updateTitle() {
      let before_date = moment.tz(this.oldest_datetime, this.camera.timezone)
      let after_date = moment.tz(this.after_datetime, this.camera.timezone)
      this.title = `${before_date.format("Do MMM")} to ${after_date.format("Do MMM")}`
    }
  }
}
</script>
