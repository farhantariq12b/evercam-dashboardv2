<template>
	<v-container>
    <v-row>
      <v-col sm="2" class="caption pb-0 pt-4">
        Cameras
      </v-col>
      <v-col sm="10" class="pb-0 pt-0">
        <!--------------------------------- Camera Field --------------------------------->
        <v-autocomplete
          v-model="currentSnapmail.camera_exids"
          :disabled="isUpdating"
          :items="cameras"
          chips
          label="Select Cameras"
          item-text="name"
          item-value="id"
          multiple
          outlined
          dense
          small-chips
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
      <v-col sm="2" class="caption pb-0 pt-4">
        Recipients
      </v-col>
      <v-col sm="10" class="pb-0 pt-0">
        <v-combobox
          v-model="currentSnapmail.recipients"
          multiple
          chips
          outlined
          height="20"
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
          height="20" :items="gmtTimeList" v-model="currentSnapmail.timezone"></v-select>
      </v-col>
    </v-row>

    <!--------------------------------- Days Field --------------------------------->
    <v-row>
      <v-col sm="2" class="caption pb-0 pt-4">
        Days
      </v-col>
      <v-col sm="10" class="pb-0 pt-0">
        <v-row>
          <v-col sm="3" class="pt-0 pb-0 mb-0">
            <v-checkbox label="All Days" v-model="selectAll"></v-checkbox>
          </v-col>
          <v-col sm="3" class="pt-0 pb-0 mb-0" v-for="(day, key) in dayNames" :key="key">
            <v-checkbox :label="day.name" :id="`day_${day.id}`" v-model="currentSnapmail.notify_days" :value="day.value"></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <!--------------------------------- Save Button --------------------------------->
    <v-btn color="#428bca" class="white--text text-capitalize" tile @click="addSnapmail">Save</v-btn>

  </v-container>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import {arrayToString, timeFormat, formatDataService} from '@/services/snapmailUtils';
  export default {
    props: ['snapmailData'],
    data() {
      return {
        currentSnapmail: this.snapmailData,
        dayNames: [
          {id: 1, name: 'Mo', value: 'Monday'},
          {id: 2, name: 'Tu', value: 'Tuesday'},
          {id: 3, name: 'We', value: 'Wednesday'},
          {id: 4, name: 'Th', value: 'Thursday'},
          {id: 5, name: 'Fr', value: 'Friday'},
          {id: 6, name: 'Sa', value: 'Saturday'},
          {id: 7, name: 'Su', value: 'Sunday'},
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
        cameras: 'cameras',
        token: 'token',
        email: 'email',
        dialogType: 'snapmail/getSnapmailDialogType',
        snapmailCardId: 'snapmail/getSnapmailCardId',
      }),

      selectAll: {
        get () {
          return this.currentSnapmail.notify_days.length === this.dayNames.length
        },
        set (value) {
          this.currentSnapmail.notify_days = []

          if (value) {
            this.dayNames.forEach((select) => {
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
        setSnapmailData: 'snapmail/setSnapmailData',
        updateSnapmailData: 'snapmail/updateSnapmailData',
        fetchSnapmailData: 'snapmail/fetchSnapmailData',
      }),
      
      remove (item) {
        const index = this.currentSnapmail.camera_exids.indexOf(item.id)
        if (index >= 0) this.currentSnapmail.camera_exids.splice(index, 1)
      },

      async addSnapmail() {
        if(this.dialogType == 'edit')
          await this.updateSnapmailData({data: formatDataService(this.currentSnapmail, this.email), id: this.snapmailCardId });
        else
          await this.setSnapmailData(formatDataService(this.currentSnapmail, this.email));

        this.setSnapmailDialog(false);
        await this.fetchSnapmailData();
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
<style>
  .v-input--selection-controls.v-input .v-label {
    margin-bottom: 0;
    font-size: 14px;
    margin-top: 0;
  }
  .field.lg .field-input{
    height: 56px !important;
    min-height: 56px !important;
    font-size: 14px !important;
  }
</style>