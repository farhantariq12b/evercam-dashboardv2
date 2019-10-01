<template>

  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-row>
        <v-col sm="12">
        </v-col>
      </v-row>
      <v-card-title>
        New Snapmail
        <v-icon @click="setSnapmailDialog(false)">fas fa-times</v-icon>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col sm="3">
              Cameras
            </v-col>
            <v-col sm="9">
              <!--------------------------------- Camera Field --------------------------------->
              <v-autocomplete
                v-model="snapmailData.camera_exids"
                :disabled="isUpdating"
                :items="cameras"
                filled
                chips
                label="Select Cameras"
                item-text="name"
                item-value="id"
                multiple
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="remove(data.item)"
                  >
                    <v-avatar left>
                      <v-img :src="`${data.item.thumbnail_url}?authorization=${token}`"></v-img>
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item"></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img :src="`${data.item.thumbnail_url}?authorization=${token}`">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          
          <!--------------------------------- Email Field --------------------------------->
          <v-row>
            <v-col sm="3">
              Recipients
            </v-col>
            <v-col sm="9">
              <v-combobox
                v-model="snapmailData.recipients"
                multiple
                chips
              >
                <template v-slot:selection="data">
                  <v-chip
                    :key="JSON.stringify(data.item)"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>

          <!--------------------------------- Time Field --------------------------------->
          <v-row>
            <v-col sm="3">
              Time
            </v-col>
            <v-col sm="4">
              <Timepicker v-model="snapmailData.notify_time" :options="pickerSetting"></Timepicker>
            </v-col>
            <v-col sm="5">
              <v-select :items="gmtTimeList" v-model="snapmailData.timezone"></v-select>
            </v-col>
          </v-row>

          <!--------------------------------- Days Field --------------------------------->
          <v-row>
            <v-col sm="3">
              Days
            </v-col>
            <v-checkbox label="All Days" v-model="selectAll"></v-checkbox>
            <v-col sm="2" v-for="(day, key) in dayNames" :key="key" >
              <v-checkbox :label="day.name" :id="`day_${day.id}`" v-model="snapmailData.notify_days" :value="day.name"></v-checkbox>
            </v-col>
          </v-row>

          <!--------------------------------- Save Button --------------------------------->
          <v-btn color="primary" @click="saveSnapmail">Save</v-btn>

        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>
<script>
  import { mapMutations, mapGetters } from 'vuex';
  import Timepicker from 'vue-simple-timepicker';
  export default {
    props: ['cameras'],
    components: {
      Timepicker
    },
    data() {
      return {
        snapmailData: {
          camera_exids: [],
          recipients: [],
          notify_time: {
            hours: 0,
            minutes: 0,
          },
          timezone: null,
          notify_days: [],
        },
        dayNames: [
          {id: 1, name: 'Mo'},
          {id: 2, name: 'Tu'},
          {id: 3, name: 'We'},
          {id: 4, name: 'Th'},
          {id: 5, name: 'Fr'},
          {id: 6, name: 'Sa'},
          {id: 7, name: 'Su'},
        ],
        gmtTimeList: ["(GMT-12:00) International Date Line West",
                  "(GMT-11:00) American Samoa",
                  "(GMT-11:00) Midway Island",
                  "(GMT-10:00) Hawaii",
                  "(GMT-09:00) Alaska",
                  "(GMT-08:00) Pacific Time (US &amp; Canada)",
                  "(GMT-08:00) Tijuana",
                  "(GMT-07:00) Arizona",
                  "(GMT-07:00) Chihuahua",
                  "(GMT-07:00) Mazatlan",
                  "(GMT-07:00) Mountain Time (US &amp; Canada)",
                  "(GMT-06:00) Central America",
                  "(GMT-06:00) Central Time (US &amp; Canada)",
                  "(GMT-06:00) Guadalajara",
                  "(GMT-06:00) Mexico City",
                  "(GMT-06:00) Monterrey",
                  "(GMT-06:00) Saskatchewan",
                  "(GMT-05:00) Bogota",
                  "(GMT-05:00) Eastern Time (US &amp; Canada)",
                  "(GMT-05:00) Indiana (East)",
                  "(GMT-05:00) Lima",
                  "(GMT-05:00) Quito",
                  "(GMT-04:00) Atlantic Time (Canada)",
                  "(GMT-04:00) Caracas"
        ],
        pickerSetting: {
          headerShow: false,
        },
        isUpdating: false,
      }
    },
    computed: {
      ...mapGetters({
        token: 'token',
        dialog: 'common/getSnapmailDialog',
      }),

      selectAll: {
        get () {
          return this.snapmailData.notify_days.length === this.dayNames.length
        },
        set (value) {
          this.snapmailData.notify_days = []

          if (value) {
            this.dayNames.forEach((select) => {
              this.snapmailData.notify_days.push(select.name)
            })
          }
        }
      }, // END selectAll
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'common/setSnapmailDialog',
        setSnapmailData: 'common/setSnapmailData',
      }),
      
      remove (item) {
        const index = this.snapmailData.camera_exids.indexOf(item.id)
        if (index >= 0) this.snapmailData.camera_exids.splice(index, 1)
      },

      saveSnapmail() {
        this.setSnapmailData(this.snapmailData);
        this.setSnapmailDialog(false);
      }
    },
    watch: {
      isUpdating (val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      },
    },
  }
</script>