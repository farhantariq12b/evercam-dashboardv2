<template>
  <v-container>
    <v-row class="mx-0">
      <v-col col="12" lg="12">
        <v-card>
          <v-card-title class="caption">
            <label class="subtitle-1">Camera Response Time:</label>
            <span class="green--text pa-1 response-average">Average Success Response Time: {{ successResponse }}</span>
            <span class="red--text pa-1 response-average">{{ failedRequests }}% Failed Requests</span>
          </v-card-title>
          <v-card-text>
            <v-col
              ref="livetail"
              col="12"
              lg="12"
              class="disabled-textarea"
              v-html="tail"
            >
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-col col="12">
        <v-card>
          <v-row class="mx-0">
            <v-col
              cols="12"
              sm="12"
              lg="2"
              md="2"
              class="subtitle-1"
            >
              Date & Time
            </v-col>
            <v-col 
              cols="12"
              sm="12" 
              md="10" 
              lg="10" 
            >
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
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mx-0">
            <v-col
              cols="12"
              sm="12"
              md="2"
              lg="2"
              class="subtitle-1"
            >
              Filter By
            </v-col>

            <v-col
              cols="12"
              sm="12"
              md="10"
              lg="10"
            >
              <v-row class="mx-0">
                <v-checkbox
                  v-model="chkAll"
                  color="primary"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="selectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">ALL</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="online,offline,vh status"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Online / Offline</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="cloud recordings updated,cloud recordings created"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Cloud Recording Settings</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="shared,updated share,stopped sharing"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Sharing Settings</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="archive created,archive deleted"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Archive Settings</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="accessed,viewed,camera created,created,edited,camera edited,captured,vh status"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Camera Settings</div>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="selected"
                  color="primary"
                  value="custom"
                  hide-details
                  class="mt-0 mx-2 ml-0"
                  @change="doSelectAll"
                >
                  <template v-slot:label>
                    <div class="caption label-color">Custom</div>
                  </template>
                </v-checkbox>
              </v-row>

              <br />
              <v-row class="mx-0">
                <v-btn
                  depressed
                  color="primary"
                  class="button-margin-left caption"
                  @click="filterLog"
                >
                  Show Report
                </v-btn>
              </v-row>
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
          :items="logs"
          :single-expand="true"
          :expanded.sync="expanded"
          item-key="done_at"
          :items-per-page="50"
          class="elevation-1"
          show-expand
        >
          <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
            <i
              v-if="item.can_expand && !isExpanded"
              role="button"
              class="v-icon notranslate v-data-table__expand-icon v-icon--link mdi mdi-chevron-down theme--light"
              @click="expand(true)"
            />
            <i
              v-if="item.can_expand && isExpanded"
              role="button"
              class="v-icon notranslate v-data-table__expand-icon v-icon--link mdi mdi-chevron-down theme--light v-data-table__expand-icon--active"
              @click="expand(false)"
            />
          </template>

          <template v-slot:item.done_at="{item}">
            <div class="caption">
              {{ item.done_at }}
            </div>
          </template>

          <template v-slot:item.action="{item}">
            <div class="caption">
              <div v-if="item.action === 'online'">
                <span class="green--text">Camera came online</span> {{ getTime2(item) }}
              </div>
              <div v-else-if="item.action === 'offline'">
                <span class="red--text">Camera went offline</span> {{ getOfflineCause(item) }}
              </div>
              <div v-else-if="item.action === 'custom'" class="custom-note-css">
                Custom Note: {{ item.extra.custom_message }}
              </div>
              <div v-else>
                {{ getEvent(item) }}
              </div>
            </div>
          </template>

          <template v-slot:item.who="{item}">
            <div class="caption">
              {{ item.who }}
            </div>
          </template>

          <template v-slot:expanded-item="{ item }" class="mytable">
            <td :colspan="4" class="pl-0 pr-0">
              <v-simple-table class="details-table">
                <thead>
                  <tr>
                    <th>Settings</th>
                    <th>Old</th>
                    <th>New</th>
                  </tr>
                </thead>
                <tbody v-if="isTableSettings(item)">
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.name != item.extra.cam_settings.new.name}">
                    <td>Name</td>
                    <td>{{ item.extra.cam_settings.old.name }}</td>
                    <td>{{ item.extra.cam_settings.new.name }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.public != item.extra.cam_settings.new.public}">
                    <td>Public</td>
                    <td>{{ item.extra.cam_settings.old.public }}</td>
                    <td>{{ item.extra.cam_settings.new.public }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.discoverable != item.extra.cam_settings.new.discoverable}">
                    <td>Discoverable</td>
                    <td>{{ item.extra.cam_settings.old.discoverable }}</td>
                    <td>{{ item.extra.cam_settings.new.discoverable }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.external_host != item.extra.cam_settings.new.external_host}">
                    <td>IP</td>
                    <td>{{ item.extra.cam_settings.old.external_host }}</td>
                    <td>{{ item.extra.cam_settings.new.external_host }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.external_http_port != item.extra.cam_settings.new.external_http_port}">
                    <td>HTTP Port</td>
                    <td>{{ item.extra.cam_settings.old.external_http_port }}</td>
                    <td>{{ item.extra.cam_settings.new.external_http_port }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.external_rtsp_port != item.extra.cam_settings.new.external_rtsp_port}">
                    <td>RTSP Port</td>
                    <td>{{ item.extra.cam_settings.old.external_rtsp_port }}</td>
                    <td>{{ item.extra.cam_settings.new.external_rtsp_port }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.snapshot_url != item.extra.cam_settings.new.snapshot_url}">
                    <td>Snapshot URL</td>
                    <td>{{ item.extra.cam_settings.old.snapshot_url }}</td>
                    <td>{{ item.extra.cam_settings.new.snapshot_url }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.auth.username != item.extra.cam_settings.new.auth.username}">
                    <td>Username</td>
                    <td>{{ item.extra.cam_settings.old.auth.username }}</td>
                    <td>{{ item.extra.cam_settings.new.auth.username }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.auth.password != item.extra.cam_settings.new.auth.password}">
                    <td>Password</td>
                    <td>{{ item.extra.cam_settings.old.auth.password }}</td>
                    <td>{{ item.extra.cam_settings.new.auth.password }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.vendor_model_name != item.extra.cam_settings.new.vendor_model_name}">
                    <td>Model</td>
                    <td>{{ item.extra.cam_settings.old.vendor_model_name }}</td>
                    <td>{{ item.extra.cam_settings.new.vendor_model_name }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cam_settings.old.vendor_name != item.extra.cam_settings.new.vendor_name}">
                    <td>Vendor</td>
                    <td>{{ item.extra.cam_settings.old.vendor_name }}</td>
                    <td>{{ item.extra.cam_settings.new.vendor_name }}</td>
                  </tr>
                </tbody>
                <tbody v-if="isCloudSettings(item)">
                  <tr :class="{'yellow lighten-3': item.extra.cr_settings.old.status != item.extra.cr_settings.new.status}">
                    <td>Status</td>
                    <td>{{ item.extra.cr_settings.old.status }}</td>
                    <td>{{ item.extra.cr_settings.new.status }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cr_settings.old.storage_duration != item.extra.cr_settings.new.storage_duration}">
                    <td>Storage Duration</td>
                    <td>{{ item.extra.cr_settings.old.storage_duration }}</td>
                    <td>{{ item.extra.cr_settings.new.storage_duration }}</td>
                  </tr>
                  <tr :class="{'yellow lighten-3': item.extra.cr_settings.old.frequency != item.extra.cr_settings.new.frequency}">
                    <td>Frequency</td>
                    <td>{{ item.extra.cr_settings.old.frequency }}</td>
                    <td>{{ item.extra.cr_settings.new.frequency }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.response-average {
  font-weight: 600 !important;
}

.label-color {
  color: rgba(0, 0, 0, 0.87);
}

.custom-note-css {
  background-color: #ffff0052;
}

.border-bottom {
  border-bottom: 1px solid #00000087;
  color: #000000;
}

.details-table td {
  font-size: 0.75rem !important;
}

.disabled-textarea {
  background-color: #fff;
  border: solid 1px #e5e5e5;
  color: #000 !important;
  font-size: 0.75rem !important;
  padding: 5px;
  width: 100%;
  height: 250px;
  line-height: 1.8;
  overflow-y: scroll;
}
</style>

<script>
import moment from "moment-timezone"
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"
import VueCtkDateTimePicker from "vue-ctk-date-time-picker"
import { Socket } from "phoenix-socket"
import { mapGetters } from "vuex"

export default {
  name: "Logs",
  components: {
    VueCtkDateTimePicker
  },
  data() {
    return {
      successResponse: "0.00",
      failedRequests: "0.00",
      errors: [],
      success: [],
      total_success: 0,
      total_errors: 0,
      sum: 0,
      start_date: moment(),
      offsetTop: 0,
      tail: "",
      chkAll: false,
      table_value: '',
      selected: ["online,offline,vh status", "custom"],
      from_datetime: moment().subtract(60, "days").format("YYYY-MM-DDTHH:mm:ss"),
      to_datetime: moment().format("YYYY-MM-DDTHH:mm:ss"),
      expanded: [],
      headers: [
        { text: "Date & Time", value: "done_at", class: "caption font-weight-medium" },
        { text: "Event", value: "action", class: "caption font-weight-medium" },
        { text: "User/Client", value: "who", class: "caption font-weight-medium" }
      ],
      logs: []
    }
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}/logs`, {
        params: {
          objects: true,
          limit: 10000,
          page: 0,
          types: "online,offline,vh status,custom",
          from: `${moment().subtract(60, "days").format("YYYY-MM-DDTHH:mm:ss")}.000Z`,
          to: `${moment().format("YYYY-MM-DDTHH:mm:ss")}.000Z`
        }
      }
    )

    let logs_list = []
    let total_logs = data.logs.length
    data.logs.forEach(function(log, index) {
      if(log.action === "online") {
        let tail = data.logs.slice((index + 1), total_logs)
        tail.forEach(function(head) {
          if(head.action === "offline") {
            log.extra = {online: log.done_at, offline: head.done_at}
          }
        })
      }
      let canExpand = false
      if(log.action === "edited" || log.action === "camera edited" || log.action === "cloud recordings updated" || log.action === "cloud recordings created") {
        canExpand = true
      }

      if(log.action === "online" || log.action === "offline" || log.action === "vh status"){
        log.who = "System"
      }

      logs_list.push({
        action: log.action,
        done_at: moment(log.done_at).format("ddd, DD MMM YYYY, HH:mm:ss"),
        extra: log.extra,
        who: log.who,
        can_expand: canExpand
      })
    })

    return {
      logs: logs_list
    }
  },
  computed: {
    ...mapGetters(["token"])
  },
  watch: {
    $route() {
      if (this.channel) {
        this.channel.leave()
      }
    }
  },
  mounted() {
    this.get_responses(true)
  },
  methods: {
    getEvent(log) {
      let ip = ""
      if(log.extra && log.extra.ip) {
        ip = `, ip: ${log.extra.ip}`
      }

      if(log.action === "shared" || log.action === "stopped sharing" || log.action === "updated share") {
        let desc = ""
        if(log.action === "updated share") {
          desc = "rights "
        }
        if(log.extra && log.extra.with) {
          return (`${log.action} ${desc}with ${log.extra.with}`) + ip
        }
        else {
          return log.action
        }
      }

      if(log.action === "edited" ||
        log.action === "camera edited" ||
        log.action === "camera created" ||
        log.action === "created" ||
        log.action === "cloud recordings updated" ||
        log.action === "cloud recordings created" ||
        log.action === "archive created") {
        return log.action + ip
      }
      else if(log.action === "archive deleted") {
        let archive_title = ""
        if(log.extra.name){
          archive_title = `'${log.extra.name}'`
        }
        return `${log.action} ${archive_title}${ip}`
      }
      else if(log.action === "accessed") {
        return "Camera was viewed"
      }
      else if(log.action === "vh status") {
        return "Virtual Host auto-enabled by system"
      }
      else {
        return log.action
      }
    },
    getTime2(log) {
      let s = ""
      if(log.extra) {
        let online = moment(log.extra.online)
        let offline = moment(log.extra.offline)
        let days = online.diff(offline, "days")
        let total_hours = online.diff(offline, "hours")
        let hours = total_hours - (days*24)
        let total_minutes = online.diff(offline, "minutes")
        let minutes = total_minutes - ((days*24*60) + (hours*60))
        let total_seconds = online.diff(offline, "seconds")
        let seconds = total_seconds - ((days*24*60*60) + (hours*60*60) + (minutes*60))

        if(days > 0) {
          s += days + " days, "
        }
        if(hours > 0) {
          s += hours + " hours, "
        }
        if(minutes > 0) {
          s += minutes + " mins, "
        }
        s += seconds + " seconds"
        return `after ${s}`
      }
      else {
        return s
      }
    },
    getOfflineCause(log) {
      if(log.extra) {
        switch(log.extra.reason) {
          case "case_clause":
            return "( Cause: Bad request.)"
          case "bad_request":
            return "( Cause: Bad request )"
          case "closed":
            return "( Cause: Connection closed. )"
          case "nxdomain":
            return "( Cause: Non-existant domain. )"
          case "ehostunreach":
            return "( Cause: No route to host. )"
          case "enetunreach":
            return "( Cause: Network unreachable. )"
          case "req_timedout":
            return "( Cause: Request to the camera timed out. )"
          case "timeout":
            return "( Cause: Camera response timed out. )"
          case "connect_timeout":
            return "( Cause: Connection to the camera timed out. )"
          case "econnrefused":
            return "( Cause: Connection refused. )"
          case "not_found":
            return "( Cause: Camera url is not found. )"
          case "forbidden":
            return "( Cause: Camera responded with a Forbidden message. )"
          case "unauthorized":
            return "( Cause: Please check the username and password. )"
          case "device_error":
            return "( Cause: Camera responded with a Device Error message. )"
          case "device_busy":
            return "( Cause: Camera responded with a Device Busy message. )"
          case "moved":
            return "( Cause: Camera url has changed, please update it. )"
          case "not_a_jpeg":
            return "( Cause: Camera didn't respond with an image. )"
          case "unhandled":
            return "( Cause: Sorry, we dropped the ball. )"
          default:
            return ""
        }
      } else {
        return ""
      }
    },
    isTableSettings(item) {
      if(item.action === "edited" || item.action === "camera edited") {
        if(item.extra.cam_settings && item.extra.cam_settings != false) {
          return true
        } else {
          return false
        }
      }
    },
    isCloudSettings(item) {
      if(item.action === "cloud recordings updated" || item.action === "cloud recordings created") {
        if(item.extra.cr_settings) {
          return true
        } else {
          return false
        }
      }
    },
    async filterLog() {
      const { data } = await this.$axios.get(
        `${process.env.API_URL}cameras/${this.$route.params.id}/logs`, {
          params: {
            objects: true,
            limit: 10000,
            page: 0,
            types: this.selected.join(),
            from: `${this.from_datetime}.000Z`,
            to: `${this.to_datetime}.000Z`
          }
        }
      )

      let logs_list = []
      let total_logs = data.logs.length
      data.logs.forEach(function(log, index) {
        if(log.action === "online") {
          let tail = data.logs.slice((index + 1), total_logs)
          tail.forEach(function(head) {
            if(head.action === "offline") {
              log.extra = {online: log.done_at, offline: head.done_at}
            }
          })
        }
        let canExpand = false
        if(log.action === "edited" || log.action === "camera edited" || log.action === "cloud recordings updated" || log.action === "cloud recordings created") {
          canExpand = true
        }

        if(log.action === "online" || log.action === "offline" || log.action === "vh status"){
          log.who = "System"
        }

        logs_list.push({
          action: log.action,
          done_at: moment(log.done_at).format("ddd, DD MMM YYYY, HH:mm:ss"),
          extra: log.extra,
          who: log.who,
          can_expand: canExpand
        })
      })

      this.logs = logs_list
    },
    selectAll(value) {
      if(value) {
        this.selected = [
          "online,offline,vh status",
          "cloud recordings updated,cloud recordings created",
          "shared,updated share,stopped sharing",
          "archive created,archive deleted",
          "accessed,viewed,camera created,created,edited,camera edited,captured,vh status",
          "custom"
        ]
      } else {
        this.selected = []
      }
    },
    doSelectAll() {
      if(this.selected.length === 6) {
        this.chkAll = true
      } else {
        this.chkAll = false
      }
    },
    get_responses(is_update) {
      this.$axios
        .get(`${process.env.API_URL}cameras/${this.$route.params.id}/response-time`)
        .then(response => {
          if(response.data) {
            this.arrange_datasets(response.data)
          }
          this.startLiveTail()
        })
    },
    arrange_datasets (data) {
      this.start_date = moment(data[0])
      let start_index = 0
      data.splice(0, 1)

      while(start_index < data.length) {
        let val = data[start_index + 1]
        let date_time = moment(data[start_index]*1000)
        let row = `<span>[${date_time.format('MM/DD/YYYY HH:mm:ss')}]</span> <span>${val}</span>`
        if(val.indexOf("[Error]") >= 0) {
          this.tail = `${this.tail}<div class='col-sm-12 pa-0 red--text'>${row}</div>`
          this.errors.push(val)
          this.success.push(0)
          this.total_errors += 1
        } else {
          this.tail = `${this.tail}<div class='col-sm-12 pa-0'>${row}</div>`
          this.success.push(val)
          let response_time = parseFloat(val.split(" ")[1].replace("[", "").replace("]", ""))
          this.sum += response_time
          this.total_success += 1
          this.errors.push(0)
        }
        start_index += 2
      }

      this.calculate_failed_percentage()
      this.scrollToEnd()
    },
    calculate_failed_percentage() {
      let curr_date_time = moment()
      let minutes = curr_date_time.diff(this.start_date, 'minutes')
      let failed_perc = (this.total_errors / (12 * minutes)) * 100

      if(this.total_errors === 0) {
        this.failedRequests = "0.00"
      } else {
        this.failedRequests = `${parseFloat(failed_perc).toFixed(2)}`
      }

      if(this.sum === 0) {
        this.successResponse = "0.00"
      } else {
        this.successResponse = parseFloat(this.sum / this.total_success).toFixed(4)
      }
    },
    startLiveTail() {
      let socket = new Socket(process.env.SOCKET_URL, {
        params: {
          token: this.token,
          ip: "1.1.1.1",
          source: "live_tail"
        }
      })
      socket.connect()
      this.channel = socket.channel(`livetail:${this.$route.params.id}`, {})
      this.channel.join()
      this.channel.on("camera-response", payload => {
        let timestamp = `<span>[${moment(payload.timestamp*1000).format('MM/DD/YYYY HH:mm:ss')}:]</span>`
        let response_time = `<span>[${payload.response_time}]</span>`
        let description = `<span>[${payload.description}]</span>`
        if(payload.response_type === "ok") {
          this.sum += payload.response_time
          this.total_success += 1
          this.tail = `${this.tail}<div class='col-sm-12 pa-0'>${timestamp} <span>[Snapshot]</span> ${response_time} ${description}</div>`
        } else {
          this.total_errors += 1
          this.tail = `${this.tail}<div class='col-sm-12 red--text pa-0'>${timestamp} <span>[Error]</span>${response_time} <span>[${payload.response_type}]</span> ${description}</div>`
        }

        this.calculate_failed_percentage()
        this.scrollToEnd()
      })
    },
    scrollToEnd() {
      let container = this.$refs.livetail
      if(container && container.scrollHeight > 250) {
        container.scrollTop = container.scrollHeight
      }
    },
    loadTheChange(name,oldValue,newValue) {
      console.log(oldValue)
      console.log(newValue)
      if(oldValue == newValue) {
        return
          `<td>${name}</td>
          <td>${oldValue}</td>
          <td>${newValue}</td>`
      }
      else {
        return 
          `<td>${name}</td>
          <td style='background-color:yellow;'>${oldValue}</td>
          <td style='background-color:yellow;'>${newValue}</td>`
      }
    }
  }
}
</script>
