<template>
  <v-layout align-center justify-center>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
    <v-row no-gutters class="full-size">
      <v-col cols="9">
        <v-layout align-center justify-center class="player-size">
          <v-progress-circular
            v-if="isLoading"
            :size="80"
            :width="7"
            color="primary"
            indeterminate
            class="buttons"
          />
          <div v-else class="text-xs-center buttons">
            <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
              <v-icon>fas fa-search</v-icon>
            </v-btn>
            <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
              <v-icon>fas fa-download</v-icon>
            </v-btn>
            <v-btn dark fab small color="rgba(0, 0, 0, 0.65)">
              <v-icon>fas fa-pencil-alt</v-icon>
            </v-btn>
          </div>
          <v-img
            :src="currentSnapshot.data"
            :lazy-src="currentSnapshot.data"
            :class="{ imageLoading: isLoading }"
            class="grey lighten-2"
            width="100%"
          />
        </v-layout>
        <v-layout class="grey darken-2" align-center justify-center>
          <v-row no-gutters class="full-size">
            <v-col cols="12">
              <v-card
                class="d-flex justify-space-between"
                color="grey darken-2"
                flat
                tile
              >
                <v-card
                  class="pa-2"
                  color="grey darken-2"
                  outlined
                  tile
                  width="150"
                />
                <v-card
                  class="pa-2"
                  color="grey darken-2"
                  outlined
                  tile
                  width="150"
                >
                  <p class="text-center white--text">
                    {{ value + 1 }} of {{ count + 1 }}
                  </p>
                </v-card>
                <v-card
                  class="pa-2"
                  color="grey darken-2"
                  outlined
                  tile
                  width="150"
                >
                  <p class="text-center white--text">
                    {{ datePicker }} {{ timePicker }}
                  </p>
                </v-card>
              </v-card>

              <vue-slider
                ref="slider"
                v-model="value"
                :tooltip="`none`"
                :min="0"
                :max="count"
                :clickable="true"
                :disabled="isDisabled"
                :adsorb="true"
                :interval="1"
                height="20px"
                :duration="0"
                :dot-style="{ display: 'none' }"
                :process-style="{ backgroundColor: 'rgb(25, 118, 210)' }"
                :rail-style="{ backgroundColor: 'rgb(130, 177, 255)' }"
                @change="go_to_get_snapshot"
              />

              <v-card
                class="d-flex justify-center mb-6"
                color="grey darken-2"
                flat
                tile
              >
                <div v-if="isPlaying">
                  <v-btn color="white" text @click="interval = -10">
                    <v-icon>fas fa-fast-backward</v-icon>
                  </v-btn>
                  <v-btn color="white" text @click="interval = -5">
                    <v-icon>fas fa-step-backward</v-icon>
                  </v-btn>
                  <v-btn color="white" text @click="isPlaying = !isPlaying">
                    <v-icon>fas fa-pause</v-icon>
                  </v-btn>
                  <v-btn color="white" text @click="interval = 5">
                    <v-icon>fas fa-step-forward</v-icon>
                  </v-btn>
                  <v-btn color="white" text @click="interval = 10">
                    <v-icon>fas fa-fast-forward</v-icon>
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn color="white" text @click="decrease(100)">
                    -100
                  </v-btn>
                  <v-btn color="white" text @click="decrease(10)">
                    -10
                  </v-btn>
                  <v-btn color="white" text @click="decrease(1)">
                    -1
                  </v-btn>
                  <v-btn
                    color="white"
                    text
                    @click="
                      isPlaying = !isPlaying
                      play()
                    "
                  >
                    <v-icon>fas fa-play</v-icon>
                  </v-btn>
                  <v-btn color="white" text @click="increase(1)">
                    +1
                  </v-btn>
                  <v-btn color="white" text @click="increase(10)">
                    +10
                  </v-btn>
                  <v-btn color="white" text @click="increase(100)">
                    +100
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-col>
      <v-col cols="3" class="pr-2 pl-2">
        <v-date-picker
          ref="datepickerref"
          v-model="datePicker"
          :allowed-dates="allowedDates"
          no-title
          :value="datePicker"
          :picker-date.sync="pickerDate"
          full-width
          @change="
            isLoading = true
            get_disable_hours()
          "
        />
        <v-card elevation="3" class="mt-2 mb-2">
          <v-card-title class="justify-center font-weight-bold subtitle-1">
            <p class="text-center">
              Hours
            </p>
          </v-card-title>
          <v-card-text>
            <table class="custom-table">
              <tbody>
                <tr>
                  <td v-for="item in [0, 1, 2, 3, 4, 5, 6]" :key="item">
                    <v-btn
                      x-small
                      fab
                      elevation="0"
                      :class="{
                        active2: buttonActive == item,
                        inactive: buttonActive != item,
                        disabled:
                          allowedHours.find(v => v == item) == item
                            ? false
                            : true
                      }"
                      class="caption font-weight-medium"
                      @click="
                        buttonActive = item
                        isLoading = true
                        timePicker = item + ':00'
                        get_all_snapshots()
                      "
                    >
                      {{ item }}
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td v-for="item in [7, 8, 9, 10, 11, 12, 13]" :key="item">
                    <v-btn
                      x-small
                      fab
                      elevation="0"
                      :class="{
                        active2: buttonActive == item,
                        inactive: buttonActive != item,
                        disabled:
                          allowedHours.find(v => v == item) == item
                            ? false
                            : true
                      }"
                      class="caption font-weight-medium"
                      @click="
                        buttonActive = item
                        isLoading = true
                        timePicker = item + ':00'
                        get_all_snapshots()
                      "
                    >
                      {{ item }}
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td v-for="item in [14, 15, 16, 17, 18, 19, 20]" :key="item">
                    <v-btn
                      x-small
                      fab
                      elevation="0"
                      :class="{
                        active2: buttonActive == item,
                        inactive: buttonActive != item,
                        disabled:
                          allowedHours.find(v => v == item) == item
                            ? false
                            : true
                      }"
                      class="caption font-weight-medium"
                      @click="
                        buttonActive = item
                        isLoading = true
                        timePicker = item + ':00'
                        get_all_snapshots()
                      "
                    >
                      {{ item }}
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td v-for="item in [21, 22, 23]" :key="item">
                    <v-btn
                      x-small
                      fab
                      elevation="0"
                      :class="{
                        active2: buttonActive == item,
                        inactive: buttonActive != item,
                        disabled:
                          allowedHours.find(v => v == item) == item
                            ? false
                            : true
                      }"
                      class="caption font-weight-medium"
                      @click="
                        buttonActive = item
                        isLoading = true
                        timePicker = item + ':00'
                        get_all_snapshots()
                      "
                    >
                      {{ item }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
        <v-card elevation="3" class="mt-2 mb-2">
          <v-card-text class="pa-0">
            <v-row>
              <v-col cols="6">
                <v-btn text color="primary" width="100%" @click="firstFrame">
                  <v-icon size="15">
fas fa-chevron-left </v-icon
                  ><v-icon size="15" class="pr-2"> fas fa-chevron-left
</v-icon>First
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn text color="primary" width="100%" @click="lastFrame">
                  Last
                  <v-icon size="15" class="pl-2">
fas fa-chevron-right </v-icon
                  ><v-icon size="15">
                    fas fa-chevron-right
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-show="hasRight" elevation="3" class="mt-2 mb-2">
          <v-card-title>
            <v-row>
              <v-col cols="10">
                Recording Settings
              </v-col>
              <v-col cols="2">
                <v-tooltip left color="rgba(0, 0, 0)">
                  <template v-slot:activator="{ on }">
                    <v-btn fab x-small color="primary" v-on="on">
                      <v-icon>fas fa-info</v-icon>
                    </v-btn>
                  </template>
                  <p class="headline">
                    Image Size Estimates
                  </p>
                  <p class="subtitle">Image Size: {{ imageSize }} KB</p>
                  <p class="subtitle">Image Dimension: {{ imageDimensions }}</p>
                  <p class="subtitle">
                    Monthly GB (est): {{ monthlyImageFileSize }} GB
                  </p>
                  <p class="subtitle">
                    Total GB (est): {{ totalImageFileSize }} GB
                  </p>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="3" class="pt-0 pb-0">
                <p class="font-weight-bold">
                  Recording status:
                </p>
              </v-col>
              <v-col cols="7" class="pt-0 pb-0">
                <v-select
                  v-if="edit_status"
                  v-model="selected_status"
                  :items="op_status"
                  label="Status"
                  @change="
                    selected_status == 'on-scheduled'
                      ? (dialogSchedule = true)
                      : (dialogSchedule = false)
                  "
                />
                <p v-else>
                  {{ status }}
                </p>
                <v-dialog v-model="dialogSchedule" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">
                        Recording Schedule
                      </span>
                    </v-card-title>
                    <v-card-text>
                      <v-row justify="space-around" no-gutters>
                        <v-col class="d-flex" cols="12" sm="12">
                          <FullCalendar
                            ref="fullCalendar"
                            :plugins="plugins"
                            :axis-format="axisFormat"
                            :default-view="defaultView"
                            :all-day-slot="allDaySlot"
                            :slot-duration="slotDuration"
                            :column-format="columnFormat"
                            :column-header-format="columnHeaderFormat"
                            :default-date="defaultDate"
                            :day-names-short="dayNamesShort"
                            :event-limit="eventLimit"
                            :event-overlap="eventOverlap"
                            :event-color="eventColor"
                            :first-day="firstDay"
                            :height="height"
                            :select-helper="selectHelper"
                            :selectable="selectable"
                            :timezone="timezone"
                            :header="header"
                            :editable="editable"
                            :events="events"
                            @select="selectCalendar"
                            @eventClick="clickCalendar"
                            @eventDrop="dropCalendar"
                            @eventResize="resizeCalendar"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider />

                    <v-card-actions>
                      <div class="flex-grow-1" />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogSchedule = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          dialogSchedule = false
                          selected_schedule = parseCalendar()
                        "
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="2" class="pt-0 pb-0">
                <v-icon
                  v-if="edit_status"
                  color="primary"
                  size="20"
                  @click="
                    edit_status = !edit_status
                    updateRecordings()
                  "
                >
                  fas fa-save
                </v-icon>
                <v-icon
                  v-else
                  color="primary"
                  size="20"
                  @click="edit_status = !edit_status"
                >
                  fas fa-pencil-alt
                </v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="pt-0 pb-0">
                <p class="font-weight-bold">
                  Storage Duration:
                </p>
              </v-col>
              <v-col cols="7" class="pt-0 pb-0">
                <v-select
                  v-if="edit_duration"
                  v-model="selected_duration"
                  :items="op_duration"
                  label="Duration"
                />
                <p v-else>
                  {{ storage_duration }}
                </p>
              </v-col>
              <v-col cols="2" class="pt-0 pb-0">
                <v-icon
                  v-if="edit_duration"
                  color="primary"
                  size="20"
                  @click="
                    edit_duration = !edit_duration
                    updateRecordings()
                  "
                >
                  fas fa-save
                </v-icon>
                <v-icon
                  v-else
                  color="primary"
                  text
                  size="20"
                  @click="edit_duration = !edit_duration"
                >
                  fas fa-pencil-alt
                </v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="pt-0 pb-0">
                <p class="font-weight-bold">
                  Snapshot per min:
                </p>
              </v-col>
              <v-col cols="7" class="pt-0 pb-0">
                <v-select
                  v-if="edit_frequency"
                  v-model="selected_frequency"
                  :items="op_frequency"
                  label="Frequency"
                />
                <p v-else>
                  {{ frequency }}
                </p>
              </v-col>
              <v-col cols="2" class="pt-0 pb-0">
                <v-icon
                  v-if="edit_frequency"
                  color="primary"
                  size="20"
                  @click="
                    edit_frequency = !edit_frequency
                    updateRecordings()
                  "
                >
                  fas fa-save
                </v-icon>
                <v-icon
                  v-else
                  color="primary"
                  size="20"
                  @click="edit_frequency = !edit_frequency"
                >
                  fas fa-pencil-alt
                </v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" width="100%" v-on="on">
              Create a new Clip
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Create a new Clip</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="title" label="Title*" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date"
                          label="Start Date*"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="date" @input="menu2 = false" />
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menu"
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="time"
                          label="Start Time*"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-time-picker
                        v-if="menu3"
                        v-model="time"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="duration"
                      type="number"
                      label="Duration*"
                    />
                  </v-col>
                  <v-col cols="12" sm="9">
                    <p class="mb-0 mt-7">
                      Minutes (Max 1hr per clip)
                    </p>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1" />
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="createArchive">
                Create Clip
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-layout>
</template>

<style scope>
.custom-table {
  width: 100%;
  background-color: white;
}
.player-size {
  min-height: 100px;
}
.full-size {
  height: 100%;
  width: 100%;
}
.edit-link {
  color: #428bca;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  background-color: #fff;
  border-radius: 30px !important;
  border: 1px solid #428bca;
  height: 28px !important;
  padding: 0 10px !important;
  margin: 0 25px;
  text-decoration: none;
}
.buttons {
  position: absolute;
  z-index: 1;
}
.button {
  opacity: 0.5;
}
.loading {
  position: absolute;
  top: 50%;
}
.active2 {
  background-color: #82b1ff !important;
}
.active2 > span {
  color: white;
}
.inactive {
  background-color: white !important;
}
.imageLoading {
  opacity: 0.5;
  filter: alpha(opacity=50);
}
.disabled {
  box-shadow: none;
  pointer-events: none;
  color: rgba(0, 0, 0, 0.26) !important;
}
.custom-dot {
  display: none;
}
</style>

<script>
import { mapGetters } from "vuex"
import moment from "moment"
import VueSlider from "vue-slider-component"
import "vue-slider-component/theme/default.css"
import "fullcalendar/dist/fullcalendar.css"
import FullCalendar from "@fullcalendar/vue"
import { Calendar } from "@fullcalendar/core"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import momentPlugin from "@fullcalendar/moment"
import "@fullcalendar/core/main.css"
import "@fullcalendar/daygrid/main.css"

export default {
  name: "Live",
  components: {
    VueSlider,
    FullCalendar
  },
  data: () => ({
    setSnapshot: null,
    snackbar: false,
    color: "",
    mode: "",
    text: "",
    timeout: 3000,
    y: "top",
    totalImageFileSize: "",
    monthlyImageFileSize: "",
    imageSize: "",
    imageDimensions: "",
    dialogInfo: false,
    dialogSchedule: false,
    selected_status: "",
    selected_schedule: [],
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      momentPlugin
    ],
    axisFormat: "HH",
    defaultView: "timeGridWeek",
    allDaySlot: false,
    slotDuration: "00:60:00",
    columnFormat: "dddd",
    columnHeaderFormat: { weekday: "short" },
    defaultDate: "1970-01-01",
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    eventLimit: true,
    eventOverlap: false,
    eventColor: "#458CC7",
    firstDay: 1,
    height: "auto",
    selectHelper: true,
    selectable: true,
    timezone: "UTC",
    header: {
      left: "",
      center: "",
      right: ""
    },
    editable: true,
    events: null,
    edit_status: false,
    edit_duration: false,
    edit_frequency: false,
    op_status: [
      { value: "on", text: "Continuous" },
      { value: "off", text: "Off" },
      { value: "pause", text: "Paused" },
      { value: "on-scheduled", text: "On Schedule" }
    ],
    op_duration: [
      { value: 1, text: "Infinity" },
      { value: 7, text: "24 hours recording" },
      { value: 30, text: "7 days recording" },
      { value: 90, text: "30 days recording" },
      { value: -1, text: "90 days recording" }
    ],
    op_frequency: [
      { value: 60, text: "60 (1 per second)" },
      { value: 30, text: "30 (1 every 2 second)" },
      { value: 12, text: "12 (1 every 5 second)" },
      { value: 6, text: "6 (1 every 10 second)" },
      { value: 1, text: "1 (1 every 60 second)" },
      { value: 5, text: "1 (1 every 5 minutes)" },
      { value: 10, text: "1 (1 every 10 minutes)" }
    ],
    recordings: [],
    hasRight: false,
    interval: 1,
    menu3: false,
    menu2: false,
    title: "",
    duration: null,
    date: new Date().toISOString().substr(0, 10),
    time: new Date().getHours() + ":00",
    dialog: false,
    isPlaying: false,
    value: 0,
    formatter1: v => this.getString(v),
    selected_hour: [],
    count: 1,
    publicPath: process.env.BASE_URL,
    currentSnapshot: [],
    isLoading: true,
    disabledDays: [],
    allowedHours: [],
    datePicker: moment().format("YYYY-MM-DD"),
    timePicker: moment().format("HH:mm"),
    pickerDate: null,
    buttonActive: 0
  }),
  computed: {
    ...mapGetters(["token"]),
    selected_camera: function() {
      return this.$store.state.cameras.find(o => o.id === this.$route.params.id)
    },
    isDisabled: function() {
      return this.count == 0 ? true : false
    },
    status: function() {
      let status = ""
      switch (this.recordings.status) {
        case "on":
          status = this.op_status[0].text
          break
        case "off":
          status = this.op_status[1].text
          break
        case "paused":
          status = this.op_status[2].text
          break
        case "on-scheduled":
          status = this.op_status[3].text
          break
      }
      return status
    },
    storage_duration: function() {
      let storage_duration = ""
      switch (this.recordings.storage_duration) {
        case -1:
          storage_duration = this.op_duration[0].text
          break
        case 1:
          storage_duration = this.op_duration[1].text
          break
        case 7:
          storage_duration = this.op_duration[2].text
          break
        case 30:
          storage_duration = this.op_duration[3].text
          break
        case 90:
          storage_duration = this.op_duration[4].text
          break
      }
      return storage_duration
    },
    frequency: function() {
      let frequency = ""
      switch (this.recordings.frequency) {
        case 60:
          frequency = this.op_frequency[0].text
          break
        case 30:
          frequency = this.op_frequency[1].text
          break
        case 12:
          frequency = this.op_frequency[2].text
          break
        case 6:
          frequency = this.op_frequency[3].text
          break
        case 1:
          frequency = this.op_frequency[4].text
          break
        case 5:
          frequency = this.op_frequency[5].text
          break
        case 10:
          frequency = this.op_frequency[6].text
          break
      }
      return frequency
    }
  },
  watch: {
    pickerDate(val) {
      this.get_disable_dates(val)
    }
  },
  created() {
    this.get_disable_dates(this.datePicker)
    this.getRecordings()
  },
  beforeDestroy() {},
  methods: {
    go_to_get_snapshot() {
      this.isLoading = true
      if (this.selected_hour.length > 0) {
        this.get_snapshot(this.selected_hour[this.value].created_at)
      } else {
        this.isLoading = false
      }
    },
    getRecordings() {
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/apps/cloud-recording"
        )
        .then(response => {
          this.hasRight = true
          this.recordings = response.cloud_recordings[0]
          this.selected_status = this.recordings.status
          this.selected_duration = this.recordings.storage_duration
          this.selected_frequency = this.recordings.frequency
          this.selected_schedule = this.recordings.schedule
        })
        .catch(error => {
          this.hasRight = false
        })
    },
    updateRecordings() {
      if (
        this.selected_frequency != this.recordings.frequency ||
        this.selected_duration != this.recordings.storage_duration ||
        this.selected_status != this.recordings.status ||
        this.selected_schedule != this.recordings.schedule
      ) {
        let formData = new FormData()
        formData.append("frequency", this.selected_frequency)
        formData.append("storage_duration", this.selected_duration)
        formData.append("status", this.selected_status)
        formData.append("schedule", JSON.stringify(this.selected_schedule))
        this.$axios
          .$post(
            process.env.API_URL +
              "cameras/" +
              this.selected_camera.id +
              "/apps/cloud-recording",
            formData
          )
          .then(response => {
            this.getRecordings()
          })
      }
    },
    firstFrame() {
      this.isLoading = true
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/oldest"
        )
        .then(response => {
          let date = moment(response.created_at).format("YYYY-MM-DD")
          let hour = moment(response.created_at).format("HH")
          this.setSnapshot = response
          this.timePicker = hour + ":00"
          this.disabledDays.push(date)
          this.datePicker = date
          this.pickerDate = date
        })
    },
    lastFrame() {
      this.isLoading = true
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/latest"
        )
        .then(response => {
          let date = moment(response.created_at).format("YYYY-MM-DD")
          let hour = moment(response.created_at).format("HH")
          this.setSnapshot = response
          this.timePicker = hour
          this.disabledDays.push(date)
          this.datePicker = date
          this.pickerDate = date
        })
    },
    async play() {
      let future_value = this.value + this.interval
      if (future_value < 0) {
        future_value = 0
      }
      if (future_value >= this.count) {
        future_value = this.count - 1
      }
      if (this.isPlaying) {
        this.$axios
          .$get(
            process.env.API_URL +
              "cameras/" +
              this.selected_camera.id +
              "/recordings/snapshots/" +
              this.selected_hour[future_value].created_at +
              "/nearest"
          )
          .then(response => {
            if (response.snapshots.length != 0) {
              this.currentSnapshot = response.snapshots[0]
            }
          })
        this.value = future_value
        if (future_value == this.count - 1 || !future_value) {
          this.isPlaying = false
        }
        await this.timeoutPlayer(1000)
        this.play()
      }
    },
    timeoutPlayer(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    increase(v) {
      if (this.value < this.count) {
        this.isLoading = true
        if (this.value + v > this.selected_hour.length) {
          this.value = this.count
        } else {
          this.value = this.value + v
        }
        this.get_snapshot(this.selected_hour[this.value - 1].created_at)
      }
    },
    decrease(v) {
      if (this.value > 0) {
        this.isLoading = true
        if (this.value - v < 0) {
          this.value = 0
        } else {
          this.value = this.value - v
        }
        this.get_snapshot(this.selected_hour[this.value].created_at)
      }
    },
    get_all_snapshots() {
      let date = moment(this.datePicker + " " + this.timePicker)
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            date.year() +
            "/" +
            (date.month() + 1) +
            "/" +
            date.date() +
            "/" +
            date.hour()
        )
        .then(response => {
          this.selected_hour = response.snapshots
          this.count = this.selected_hour.length
          this.value = 0
          if (this.setSnapshot) {
            this.currentSnapshot = this.setSnapshot
            this.setSnapshot = null
            this.isLoading = false
          } else {
            this.get_snapshot(this.selected_hour[0].created_at)
          }
        })
    },
    getString(val) {
      var date = new Date(val * 1000)
      var str =
        date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()
      return str
    },
    getSeconds(date) {
      var mydate = date.split(" ")
      var mydate2 = mydate[0].split("-")
      var date = new Date(mydate2[0], mydate2[1], mydate2[2])
      var seconds = date.getTime() / 1000
      return seconds
    },
    get_snapshot(timestamp) {
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            timestamp +
            "/nearest"
        )
        .then(response => {
          if (response.snapshots.length != 0) {
            this.currentSnapshot = response.snapshots[0]
            if (!this.imageDimensions) {
              this.getDimensions()
            }
            this.isLoading = false
          }
        })
    },
    getDimensions() {
      var img = new Image()
      img.onload = () => {
        this.imageDimensions = img.width + "x" + img.height
      }
      this.imageSize = this.calculateImageSize(this.currentSnapshot.data)
      let image_store_duration
      if (this.recordings.storage_duration == -1) {
        image_store_duration = 30
      } else {
        image_store_duration = this.recordings.storage_duration
      }
      this.totalImageFileSize = this.convertFromBytes(
        this.imageSize *
          image_store_duration *
          this.recordings.frequency *
          24 *
          60
      )
      if (
        this.recordings.storage_duration == -1 ||
        this.recordings.storage_duration > 30
      ) {
        image_store_duration = 30
      } else {
        image_store_duration = this.recordings.storage_duration
      }
      this.monthlyImageFileSize = this.convertFromBytes(
        this.imageSize *
          image_store_duration *
          this.recordings.frequency *
          24 *
          60
      )
      img.src = this.currentSnapshot.data
    },
    calculateImageSize(base64String) {
      let padding, inBytes, base64StringLength
      if (base64String.endsWith("==")) padding = 2
      else if (base64String.endsWith("=")) padding = 1
      else padding = 0
      base64StringLength = base64String.length
      inBytes = (base64StringLength / 4) * 3 - padding
      this.kbytes = inBytes / 1000
      return this.kbytes.toFixed(2)
    },
    convertFromBytes(bytes) {
      if (bytes == 0) {
        return "0 Bytes"
      }
      let k = 1024
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / k ** i).toFixed(2))
    },
    allowedDates(val) {
      return this.disabledDays.find(v => v === val)
    },
    get_disable_dates(date) {
      let last_day = moment(date)
        .endOf("month")
        .format("DD")
      let year = moment(date).format("YYYY")
      let month = moment(date).format("MM")

      let month_all_days = []
      for (let i = 1; i <= last_day; i++) {
        month_all_days.push(i)
      }

      let availible_days
      let disabled_days_value = []
      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/days"
        )
        .then(response => {
          availible_days = response.days
          availible_days.forEach(function(day) {
            let month_val = ("0" + month).slice(-2)
            let day_val = ("0" + day).slice(-2)
            let complete_date = year + "-" + month_val + "-" + day_val
            disabled_days_value.push(complete_date)
          })
        })
      this.disabledDays = disabled_days_value
      this.get_disable_hours(this.datePicker)
    },

    get_disable_hours(date) {
      if (!date) {
        date = this.datePicker
      }
      date = date + " " + this.timePicker

      let first_day = moment(date).format("DD")
      let year = moment(date).format("YYYY")
      let month = moment(date).format("MM")
      let hour = parseInt(moment(date).format("HH"))

      let availible_hours
      let disabled_hours_value = []

      let timestamp = moment(this.datePicker + " " + this.timePicker)
        .subtract(1, "hours")
        .format("YYYY-MM-DDTHH:mm:ss.000+00:00")

      this.$axios
        .$get(
          process.env.API_URL +
            "cameras/" +
            this.selected_camera.id +
            "/recordings/snapshots/" +
            year +
            "/" +
            month +
            "/" +
            first_day +
            "/hours"
        )
        .then(response => {
          this.allowedHours = response.hours
          if (this.allowedHours.find(v => v == hour) == hour) {
            this.buttonActive = hour
          } else {
            this.buttonActive = this.allowedHours[this.allowedHours - 1]
          }
          this.get_all_snapshots()
        })
    },
    createArchive() {
      let formData = new FormData()
      let d = new Date()
      formData.append("title", this.title)
      var from = new Date(this.date + " " + this.time)
      var to = new Date(this.date + " " + this.time)
      let dur = this.duration * 60
      to.setSeconds(to.getSeconds() + dur)
      this.file_type = "clip"
      formData.append("from_date", from.toISOString())
      formData.append("to_date", to.toISOString())
      formData.append("is_nvr_archive", false)
      formData.append("type", this.file_type)
      this.$axios
        .$post(
          `${process.env.API_URL}cameras/${this.$route.params.id}/archives`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(() => {
          this.color = "success"
          this.text = "Title changed successfuly"
          this.snackbar = true
          this.archive.title = this.title
        })
        .catch(() => {
          this.color = "error"
          this.text = "We can not change the title"
          this.snackbar = true
        })
    },
    selectCalendar(event) {
      let api = this.$refs.fullCalendar.getApi()
      api.addEvent(event)
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    clickCalendar(event) {
      if (window.confirm("Are you sure you want to delete this event?")) {
        let api = this.$refs.fullCalendar.getApi()
        let findingID = null
        if (event.event.id === "") {
          findingID = event.el
        } else {
          findingID = event.event.id
        }
        let removeEvent = api.getEventById(findingID)
        removeEvent.remove()
      }
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    dropCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    resizeCalendar(event) {
      this.schedule = JSON.stringify(this.parseCalendar())
    },
    parseCalendar() {
      var events = this.$refs.fullCalendar.getApi().getEvents()
      var schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      }
      events.map(function(event) {
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
        var startTime = moment(event.start).get("hours")
        var endTime = moment(event.end).get("hours")
        var day = moment(event.start).get("day")
        schedule[days[day]] = schedule[days[day]].concat(
          startTime + "-" + endTime
        )
      })
      return schedule
    }
  }
}
</script>
