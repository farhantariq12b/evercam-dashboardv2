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
  import { formatToString } from '@/services/snapmail/snapmailUtils';
  import Autocomplete from '@/components/shared/Autocomplete';
  import Combobox from '@/components/shared/Combobox';
  import config from '@/services/snapmail/data.config';

  export default {
    props: ['snapmail'],
    components: {
      Autocomplete,
      Combobox,
    },
    data() {
      return {
        currentSnapmail: this.snapmail,
        timezoneList: null,
        days: null,
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

    created() {
      this.days = config.days;
      this.timezoneList = config.timezoneList;
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
