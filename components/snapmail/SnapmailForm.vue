<template>
	<v-container>
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
      <v-col sm="3" class="pb-0 pt-0">
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
        <v-select outlined
          height="20" :items="timezoneList" v-model="currentSnapmail.timezone"></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="2" class="caption pb-0 pt-4">
        Days
      </v-col>
      <v-col sm="10" class="pb-0 pt-0">
        <v-row>
          <v-col sm="3" class="pt-0 pb-0 mb-0">
            <v-checkbox label="All Days" v-model="selectAll"></v-checkbox>
          </v-col>
          <v-col sm="3" class="pt-0 pb-0 mb-0" v-for="(day, key) in days" :key="key">
            <v-checkbox :label="day.name" :id="`day_${day.id}`" v-model="currentSnapmail.notify_days" :value="day.value"></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <v-btn color="#428bca" class="white--text text-capitalize" tile @click="addSnapmail">Save</v-btn>
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
      Combobox
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
          "(GMT-12:00) International Date Line West",
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
        if(this.dialogType == 'edit'){
          await this.updateSnapmail({ data: formatToString(this.currentSnapmail, this.email), id: this.snapmailEditId });
        }
        else
          await this.createSnapmail(formatToString(this.currentSnapmail, this.email));

        this.setSnapmailDialog(false);
        await this.getSnapmails();
      },

      setSelectedCameras(event) {
        this.currentSnapmail.camera_exids = event;
      },
      setSelectedRecipients(event) {
        this.currentSnapmail.recipients = event;
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
</style>