<template>
  <v-container>
    <v-row class="mx-0">
      <v-col col="12" lg="12">
        <v-card>
          <v-row class="mx-0">
            <v-col
              col="1"
              lg="1"
              md="1"
              sm="12"
              xs="12"
              class="subtitle-1">
              Filter By:
            </v-col>
            <v-col col="1" lg="10" md="10" sm="12" xs="12">
              <v-card
                class="d-flex flex-row"
                color="lighten-2"
                flat
                tile
              >
                <v-card
                  class="pa-1 caption"
                  flat
                  tile
                >
                  From:
                </v-card>
                <v-card
                  class="pa-1"
                  flat
                  tile
                >
                  <vue-ctk-date-time-picker
                    v-model="from_datetime"
                    class=""
                    hint="From"
                    format="YYYY-MM-DDTHH:mm:ss"
                    button-color="#68a2d5"
                    color="#68a2d5"
                    no-button-now
                    no-shortcuts
                    no-header
                  >
                    <v-text-field class="caption mt-0 pt-0 border-bottom"/>
                  </vue-ctk-date-time-picker>
                </v-card>

                <v-card
                  class="pa-1 ml-2 caption"
                  flat
                  tile
                >
                  To:
                </v-card>
                <v-card
                  class="pa-1"
                  flat
                  tile
                >
                  <vue-ctk-date-time-picker
                    v-model="to_datetime"
                    class=""
                    format="YYYY-MM-DDTHH:mm:ss"
                    button-color="#68a2d5"
                    color="#68a2d5"
                    no-button-now
                    no-shortcuts
                    no-header
                    no-label
                  >
                    <v-text-field class="caption mt-0 pt-0 border-bottom"/>
                  </vue-ctk-date-time-picker>
                </v-card>
                <v-card
                  class="pa-n1 ml-2 caption"
                  flat
                  tile
                >
                  <v-btn
                    depressed
                    small
                    color="primary"
                    class="button-margin-left"
                    @click="filterLog"
                  >
                    Filter
                  </v-btn>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mx-0">
      <v-col col="12">
        <v-data-table
          dense
          :headers="headers"
          :items="activities"
          item-key="done_at"
          :items-per-page="50"
          class="elevation-1 activities"
        >
          <template v-slot:item.extra="{item}">
            <div v-if="item.extra && item.extra.agent" class="caption">
              <span v-if="item.extra.agent.indexOf('iPhone') !== -1">
                <v-icon size="14" color="#000000">
                  fab fa-apple
                </v-icon> iOS APP
              </span>
              <span v-else-if="item.extra.agent.indexOf('java') !== -1">
                <v-icon size="14" color="#000000">
                  fab fa-android
                </v-icon> Andriod APP
              </span>
              <span v-else>
                <v-icon size="14" color="#000000">
                  fab fa-{{ getBrowserIcon(item.extra.agent) }}
                </v-icon> {{ getBrowser(item.extra.agent) }}
              </span>
            </div>
          </template>

          <template v-slot:item.who="{item}">
            <div v-if="item.extra && item.extra.ip" class="caption">
              {{ item.extra.ip }}
            </div>
          </template>

          <template v-slot:item.camera_exid="{item}">
            <div v-if="item.extra && item.extra.country && item.extra.country_code" class="caption">
              <img :src="countryFlag(item.extra.country_code)"> {{ item.extra.country }}
            </div>
          </template>

          <template v-slot:item.done_at="{item}">
            <div class="caption">
              {{ humanizeDate(item.done_at) }}
            </div>
          </template>

          <template v-slot:item.action="{item}">
            <div class="caption">
              <div v-if="item.action === 'shared' || item.action === 'stopped sharing' || item.action === 'updated share'">
                Camera <b>{{ item.camera_exid }}</b> {{ item.action }} <span v-if="item.action === 'updated share'">rights</span> with {{ item.extra.with }}
              </div>

              <div v-else-if="item.action === 'cloud recordings updated' || item.action === 'cloud recordings created'">
                {{ item.action }} for <b>{{ item.camera_exid }}</b>
              </div>

              <div v-else-if="item.action === 'created' || item.action === 'camera created'">
                Camera <b>{{item.camera_exid}}</b> created
              </div>
              <div v-else-if="item.action === 'edited' || item.action === 'camera edited'">
                Camera <b>{{item.camera_exid}}</b> updated
              </div>
              <div v-else-if="item.action === 'camera deleted'">
                Camera <b>{{item.camera_exid}}</b> deleted
              </div>

              <div v-else-if="item.action === 'archive deleted'">
                Archive <b v-if="item.extra && item.extra.name">{{ item.extra.name }} </b>deleted from camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'archive created'">
                Archive <b v-if="item.extra && item.extra.name">{{ item.extra.name }} </b>created for camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'file uploaded'">
                File <b v-if="item.extra && item.extra.name">{{ item.extra.name }} </b>uploaded in camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'saved media URL'">
                Saved media URL <b v-if="item.extra && item.extra.name">{{ item.extra.name }} </b>in camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'archive edited'">
                Archive <b v-if="item.extra && item.extra.name">{{ item.extra.name }} </b>updated in camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'compare created'">
                Compare <b v-if="item.extra && item.extra.name">{{ item.extra.name.replace("Compare: ", "") }} </b>created for camera <b>{{ item.camera_exid }}</b>
              </div>
              <div v-else-if="item.action === 'compare deleted'">
                Compare <b v-if="item.extra && item.extra.name">{{ item.extra.name.replace("Compare: ", "") }} </b>deleted from camera <b>{{ item.camera_exid }}</b>
              </div>

              <div v-else-if="item.action === 'user edited'">
                User settings updated
              </div>
              <div v-else-if="item.action === 'login using api_id / api_key'">
                Login using API_ID and API_KEY
              </div>
              <div v-else-if="item.action === 'login'">
                Login
              </div>
              <div v-else-if="item.action === 'logout'">
                Logout
              </div>


              <div v-else>
                {{ item.action }}
              </div>
            </div>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.activities div table td {
  font-size: 0.75rem !important;
}

.border-bottom {
  border-bottom: 1px solid #00000087;
  color: #000000;
}
</style>

<script>
import moment from "moment-timezone"
import uaparser from "ua-parser-js"
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"
import VueCtkDateTimePicker from "vue-ctk-date-time-picker"
import { mapGetters } from "vuex"

export default {
  name: "Activities",
  components: {
    VueCtkDateTimePicker
  },
  data() {
    return {
      parser: new uaparser(),
      from_datetime: moment().subtract(150, "days").format("YYYY-MM-DDTHH:mm:ss"),
      to_datetime: moment().format("YYYY-MM-DDTHH:mm:ss"),
      headers: [
        { text: "Browser", value: "extra" },
        { text: "IP address", value: "who" },
        { text: "Country", value: "camera_exid" },
        { text: "Date & Time", value: "done_at" },
        { text: "Event", value: "action" }
      ]
    }
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}users/session/activities`, {
        params: {
          limit: 10000,
          from: `${moment().subtract(150, "days").format("YYYY-MM-DDTHH:mm:ss")}.000Z`,
          to: `${moment().format("YYYY-MM-DDTHH:mm:ss")}.000Z`
        }
      }
    )

    return {
      activities: data.user_logs
    }
  },
  methods: {
    humanizeDate(date) {
      return moment(date).format("ddd, DD MMM YYYY, HH:mm:ss")
    },
    getBrowser(agent_string) {
      this.parser.setUA(agent_string)
      let result = this.parser.getResult()
      if(result.browser.name) {
        return `${result.browser.name} on ${result.os.name}`
      } else {
        return agent_string
      }
    },
    getBrowserIcon(agent_string) {
      this.parser.setUA(agent_string)
      let result = this.parser.getResult()
      if(result.browser.name) {
        return result.browser.name.toLowerCase()
      }
    },
    countryFlag(code) {
      return `https://www.countryflags.io/${code}/shiny/16.png`
    },
    async filterLog() {
      const { data } = await this.$axios.get(
        `${process.env.API_URL}users/session/activities`, {
          params: {
            limit: 10000,
            from: `${this.from_datetime}.000Z`,
            to: `${this.to_datetime}.000Z`
          }
        }
      )

      this.activities = data.user_logs
    }
  }
}
</script>
