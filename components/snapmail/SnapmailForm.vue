<template>
	<v-container>
    <ValidationObserver v-slot="{ passes }">
      <v-row>
        <v-col sm="2" class="caption pb-0 pt-4">
          Cameras
        </v-col>
        <v-col sm="10" class="pb-0 pt-0">
         <Autocomplete :camera_exids="currentSnapmail.camera_exids" @selectedCameras="setSelectedCameras" />
        </v-col>
      </v-row>
      
      <v-row>
        <v-col sm="2" class="caption pb-0 pt-4">
          Recipients
        </v-col>
        <v-col sm="10" class="pb-0 pt-0">
          <Combobox :recipient="currentSnapmail.recipients" @selectedRecipients="setSelectedRecipients" />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col sm="2" class="caption pb-0 pt-4">
          Time
        </v-col>
        <v-col sm="3" class="pb-0 pt-0 custom-height">
          <VueCtkDateTimePicker 
            format="hh:mm" 
            formatted="hh:mm" 
            v-model="currentSnapmail.notify_time" 
            onlyTime 
            label="Select Time" 
            inputSize="lg"
          />
        </v-col>
        <v-col sm="7" class="pb-0 pt-0">
          <v-select 
            outlined
            height="20" 
            :items="timezoneList"
            item-text="name"
            item-value="value"
            v-model="currentSnapmail.timezone"
            class="custom-height"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col sm="2" class="caption pb-0 pt-10">
          Days
        </v-col>
        <v-col sm="10" class="pb-0 pt-6">
          <v-row>
              <v-col sm="3" class="pt-0 pb-0 mb-0">
                <v-checkbox label="All Days" v-model="selectAll"></v-checkbox>
              </v-col>
              <ValidationProvider class="d-content" name="Day" rules="required" v-slot="{ errors }">
                <v-col sm="3" class="pt-0 pb-0 mb-0 custom-height" v-for="(day, key) in days" :key="key">
                  <v-checkbox :label="day.name" :id="`day-${day.id}`" v-model="currentSnapmail.notify_days" :value="day.value"></v-checkbox>
                </v-col>
                <p class="pl-3">{{ errors[0] }}</p>
              </ValidationProvider>
          </v-row>
        </v-col>
      </v-row>
      
      <v-btn color="#428bca" class="white--text text-capitalize" tile @click="passes(addSnapmail)">Save</v-btn>
    </ValidationObserver>
  </v-container>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import { formatToString } from '@/services/snapmailUtils';
  import Autocomplete from '@/components/shared/Autocomplete';
  import Combobox from '@/components/shared/Combobox';

  export default {
    props: ['snapmail'],
    components: {
      Autocomplete,
      Combobox,
    },
    data() {
      return {
        currentSnapmail: this.snapmail,
        days: [
          {id: 1, name: 'Mo', value: 'Monday'},
          {id: 2, name: 'Tu', value: 'Tuesday'},
          {id: 3, name: 'We', value: 'Wednesday'},
          {id: 4, name: 'Th', value: 'Thursday'},
          {id: 5, name: 'Fr', value: 'Friday'},
          {id: 6, name: 'Sa', value: 'Saturday'},
          {id: 7, name: 'Su', value: 'Sunday'},
        ],
        timezoneList: [
        { name: "(GMT-06:00) Guadalajara", value: "America/Mexico_City"  },
        { name: "(GMT-06:00) Mexico City", value: "America/Mexico_City" },
        { name: "(GMT-06:00) Monterrey", value: "America/Monterrey" },
        { name: "(GMT-06:00) Saskatchewan", value: "America/Regina" },
        { name: "(GMT-05:00) Bogota", value: "America/Bogota" },
        { name:  "(GMT-05:00) Eastern Time (US & Canada)", value: "America/New_York" },
        { name: "(GMT-05:00) Indiana (East)", value: "America/Indiana/Indianapolis" },
        { name: "(GMT-05:00) Lima", value: "America/Lima" },
        { name: "(GMT-05:00) Quito", value: "America/Lima" },
        { name: "(GMT-04:00) Atlantic Time (Canada)", value: "America/Halifax" },
        { name: "(GMT-04:00) Caracas", value: "America/Caracas"  },
        { name: "(GMT-04:00) Georgetown", value: "America/Guyana" },
        { name: "(GMT-04:00) La Paz", value: "America/La_Paz" },
        { name: "(GMT-04:00) Puerto Rico", value: "America/Puerto_Rico" },
        { name: "(GMT-04:00) Santiago", value: "America/Santiago" },
        { name:  "(GMT-03:00) Brasilia", value: "America/Sao_Paulo" },
        { name: "(GMT-03:00) Buenos Aires", value: "America/Argentina/Buenos_Aires" },
        { name: "(GMT-03:00) Greenland", value: "America/Godthab"  },
        { name: "(GMT-03:00) Montevideo", value: "America/Montevideo" },
        { name: "(GMT-02:00) Mid-Atlantic", value: "Atlantic/South_Georgia" },
        { name: "(GMT-01:00) Azores", value: "Atlantic/Azores" },
        { name: "(GMT-01:00) Cape Verde Is.", value: "Atlantic/Cape_Verde" },
        { name: "(GMT+00:00) Edinburgh", value: "Europe/London" },
        { name: "(GMT+00:00) Lisbon", value: "Europe/Lisbon" },
        { name: "(GMT+00:00) London", value: "Europe/London" },
        { name: "(GMT+00:00) Monrovia", value: "Africa/Monrovia" },
        { name: "(GMT+00:00) UTC", value: "Etc/UTC" },
        { name: "(GMT+01:00) Amsterdam", value: "Europe/Amsterdam" },
        { name: "(GMT+01:00) Belgrade", value: "Europe/Belgrade" },
        { name: "(GMT+01:00) Berlin", value: "Europe/Berlin" },
        { name: "(GMT+01:00) Bern", value: "Europe/Zurich" },
        { name: "(GMT+01:00) Bratislava", value: "Europe/Bratislava" },
        { name: "(GMT+01:00) Brussels", value: "Europe/Brussels" },
        { name: "(GMT+01:00) Budapest", value: "Europe/Budapest" },
        { name: "(GMT+01:00) Casablanca", value: "Africa/Casablanca" },
        { name: "(GMT+01:00) Copenhagen", value: "Europe/Copenhagen" },
        { name: "(GMT+01:00) Dublin", value: "Europe/Dublin" },
        { name: "(GMT+01:00) Ljubljana", value: "Europe/Ljubljana" },
        { name: "(GMT+01:00) Madrid", value: "Europe/Madrid" },
        { name: "(GMT+01:00) Paris", value: "Europe/Paris" },
        { name: "(GMT+01:00) Prague", value: "Europe/Prague" },
        { name: "(GMT+01:00) Rome", value: "Europe/Rome" },
        { name: "(GMT+01:00) Sarajevo", value: "Europe/Sarajevo" },
        { name: "(GMT+01:00) Skopje", value: "Europe/Skopje" },
        { name: "(GMT+01:00) Stockholm", value: "Europe/Stockholm" },
        { name: "(GMT+01:00) Vienna", value: "Europe/Vienna" },
        { name: "(GMT+01:00) Warsaw", value: "Europe/Warsaw" },
        { name: "(GMT+01:00) West Central Africa", value: "Africa/Algiers" },
        { name: "(GMT+01:00) Zagreb", value: "Europe/Zagreb" },
        { name: "(GMT+01:00) Zurich", value: "Europe/Zurich" },
        { name: "(GMT+02:00) Athens", value: "Europe/Athens" },
        { name: "(GMT+02:00) Bucharest", value: "Europe/Bucharest" },
        { name: "(GMT+02:00) Cairo", value: "Africa/Cairo" },
        { name: "(GMT+02:00) Harare", value: "Africa/Harare" },
        { name: "(GMT+02:00) Helsinki", value: "Europe/Helsinki"  },
        { name: "(GMT+02:00) Jerusalem", value: "Asia/Jerusalem" },
        { name: "(GMT+02:00) Kaliningrad", value: "Europe/Kaliningrad" },
        { name: "(GMT+02:00) Kyiv", value: "Europe/Kiev" },
        { name: "(GMT+02:00) Pretoria", value: "Africa/Johannesburg" },
        { name: "(GMT+02:00) Riga", value: "Europe/Riga" },
        { name: "(GMT+02:00) Sofia", value: "Europe/Sofia" },
        { name: "(GMT+02:00) Tallinn", value: "Europe/Tallinn" },
        { name: "(GMT+02:00) Vilnius", value: "Europe/Vilnius" },
        { name: "(GMT+03:00) Baghdad", value: "Asia/Baghdad" },
        { name: "(GMT+03:00) Istanbul", value: "Europe/Istanbul" },
        { name: "(GMT+03:00) Kuwait", value: "Asia/Kuwait" },
        { name: "(GMT+03:00) Minsk", value: "Europe/Minsk" },
        { name: "(GMT+03:00) Moscow", value: "Europe/Moscow" },
        { name: "(GMT+03:00) Nairobi", value: "Africa/Nairobi" },
        { name: "(GMT+03:00) Riyadh", value: "Asia/Riyadh" },
        { name: "(GMT+03:00) St. Petersburg", value: "Europe/Moscow" },
        { name: "(GMT+04:00) Abu Dhabi", value: "Asia/Muscat" },
        { name: "(GMT+04:00) Baku", value: "Asia/Baku" },
        { name: "(GMT+04:00) Muscat", value: "Asia/Muscat" },
        { name: "(GMT+04:00) Samara", value: "Europe/Samara" },
        { name: "(GMT+04:00) Tbilisi", value: "Asia/Tbilisi" },
        { name: "(GMT+04:00) Volgograd", value: "Europe/Volgograd" },
        { name: "(GMT+04:00) Yerevan", value: "Asia/Yerevan" },
        { name: "(GMT+05:00) Ekaterinburg", value: "Asia/Yekaterinburg" },
        { name: "(GMT+05:00) Islamabad", value: "Asia/Karachi" },
        { name: "(GMT+05:00) Karachi", value: "Asia/Karachi" },
        { name: "(GMT+05:00) Tashkent", value: "Asia/Tashkent" },
        { name: "(GMT+06:00) Almaty", value: "Asia/Almaty" },
        { name: "(GMT+06:00) Astana", value: "Asia/Dhaka" },
        { name: "(GMT+06:00) Dhaka", value: "Asia/Dhaka" },
        { name: "(GMT+06:00) Urumqi", value: "Asia/Urumqi"  },
        { name: "(GMT+07:00) Bangkok", value: "Asia/Bangkok" },
        { name: "(GMT+07:00) Hanoi", value: "Asia/Bangkok" },
        { name: "(GMT+07:00) Jakarta", value: "Asia/Jakarta" },
        { name: "(GMT+07:00) Krasnoyarsk", value: "Asia/Krasnoyarsk" },
        { name: "(GMT+07:00) Novosibirsk", value: "Asia/Novosibirsk" },
        { name: "(GMT+08:00) Beijing", value: "Asia/Shanghai" },
        { name: "(GMT+08:00) Chongqing", value: "Asia/Chongqing" },
        { name: "(GMT+08:00) Hong Kong", value: "Asia/Hong_Kong" },
        { name: "(GMT+08:00) Irkutsk", value: "Asia/Irkutsk" },
        { name: "(GMT+08:00) Kuala Lumpur", value: "Asia/Kuala_Lumpur" },
        { name: "(GMT+08:00) Perth", value: "Australia/Perth" },
        { name: "(GMT+08:00) Singapore", value: "Asia/Singapore" },
        { name: "(GMT+08:00) Taipei", value: "Asia/Taipei" },
        { name: "(GMT+08:00) Ulaanbaatar", value: "Asia/Ulaanbaatar" },
        { name: "(GMT+09:00) Osaka", value: "Asia/Tokyo" },
        { name: "(GMT+09:00) Sapporo", value: "Asia/Tokyo" },
        { name: "(GMT+09:00) Seoul", value: "Asia/Seoul" },
        { name: "(GMT+09:00) Tokyo", value: "Asia/Tokyo" },
        { name: "(GMT+09:00) Yakutsk", value: "Asia/Yakutsk" },
        { name: "(GMT+10:00) Brisbane", value: "Australia/Brisbane" },
        { name: "(GMT+10:00) Canberra", value: "Australia/Melbourne" },
        { name: "(GMT+10:00) Guam", value: "Pacific/Guam" },
        { name: "(GMT+10:00) Hobart", value: "Australia/Hobart" },
        { name: "(GMT+10:00) Melbourne", value: "Australia/Melbourne" },
        { name: "(GMT+10:00) Port Moresby", value: "Pacific/Port_Moresby" },
        { name: "(GMT+10:00) Sydney", value: "Australia/Sydney" },
        { name: "(GMT+10:00) Vladivostok", value: "Asia/Vladivostok" },
        { name: "(GMT+11:00) Magadan", value: "Asia/Magadan" },
        { name: "(GMT+11:00) New Caledonia", value: "Pacific/Noumea" },
        { name: "(GMT+11:00) Solomon Is.", value: "Pacific/Guadalcanal" },
        { name: "(GMT+11:00) Srednekolymsk", value: "Asia/Srednekolymsk" },
        { name: "(GMT+12:00) Auckland", value: "Pacific/Auckland" },
        { name: "(GMT+12:00) Fiji", value: "Pacific/Fiji" },
        { name: "(GMT+12:00) Kamchatka", value: "Asia/Kamchatka" },
        { name: "(GMT+12:00) Marshall Is.", value: "Pacific/Majuro" },
        { name: "(GMT+12:00) Wellington", value: "Pacific/Auckland" },
        { name: "(GMT+13:00) Nuku'alofa", value: "Pacific/Tongatapu" },
        { name: "(GMT+13:00) Samoa", value: "Pacific/Apia" },
        { name:  "(GMT+13:00) Tokelau Is.", value: "Pacific/Fakaofo" }
        ],
        pickerSetting: {
          headerShow: false,
        },
      }
    },
    computed: {
      ...mapGetters({
        email: 'email',
        token: 'token',
        cameras: 'cameras',
        dialogType: 'snapmail/getSnapmailDialogType',
        snapmailEditId: 'snapmail/getSnapmailEditId',
      }),

      selectAll: {
        get() {
          return this.currentSnapmail.notify_days.length === this.days.length
        },
        set(value) {
          this.currentSnapmail.notify_days = []

          if (value) {
            this.days.forEach((select) => {
              this.currentSnapmail.notify_days.push(select.value)
            })
          }
        }
      },
    },

    methods: {
      ...mapMutations({
        setSnapmailDialog: 'snapmail/setSnapmailDialog',
      }),
      ...mapActions({
        createSnapmail: 'snapmail/createSnapmail',
        updateSnapmail: 'snapmail/updateSnapmail',
        getSnapmails: 'snapmail/getSnapmails',
      }),

      async addSnapmail() {
        if(this.dialogType == 'edit') {
          await this.updateSnapmail({ data: formatToString(this.currentSnapmail, this.email), id: this.snapmailEditId });
        }
        else
          await this.createSnapmail(formatToString(this.currentSnapmail, this.email));

        this.setSnapmailDialog(false);
        await this.getSnapmails();
      },

      setSelectedCameras(value) {
        this.currentSnapmail.camera_exids = value;
      },
      setSelectedRecipients(value) {
        this.currentSnapmail.recipients = value;
      }
    }
  }
</script>
<style>
  .v-input--selection-controls.v-input .v-label {
    margin-bottom: 0;
    font-size: 14px;
    margin-top: 0;
  }
  .field.lg .field-input {
    height: 56px !important;
    min-height: 56px !important;
    font-size: 14px !important;
  }
  .time-picker-column .before {
    display: none;
  }
  .datetimepicker .datepicker {
    top: -56px !important;
  }
  .d-content {
    display: contents !important;
  }
  .custom-height {
    height: 56px !important;
  }
</style>
