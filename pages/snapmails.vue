<template>
  <v-container class="white lighten-5">
    <v-sheet elevation="1">
      <v-tabs>
        <v-tab class="text-capitalize body-2">
          Snapmail - Scheduled Emails
        </v-tab>
      </v-tabs>
    </v-sheet>
    
    <!----------------------------------- Snapmail Text ----------------------------------->
    <v-row v-if="snapmails.length == 0">
      <v-col md="5" class="mt-6 ml-4 body-2">
          Snapmail is a scheduled email that contains a snapshot from your camera. Include as many emails and cameras as you like.
          <br/><br/>
          This clever feature sends you up-to-date, high-resolution images direct to your inbox.
          <br/><br/>
          Send images the day before a site meeting or send all project stakeholders a daily/weekly update.
          <br/><br/>
          Now everyone is updated, and you haven’t left your desk.
      </v-col>
      <v-col>
        <v-img class="mt-6" 
          :src="require('~/assets/snapmails.jpg')"
          max-width="280"
        >  
        </v-img>
      </v-col>
    </v-row>

    <!----------------------------------- Snapmail Card ----------------------------------->
    <div v-if="snapmails.length > 0">
      <v-card
        v-for="(data, key) in snapmails"
        :key="key"
        elevation="2"
        max-width="340"
        class="mt-6 ml-4 mb-8 d-inline-block"
      >

        <v-carousel
          :continuous="false"
          :cycle="cycle"
          interval="2000"
          reverse
          :show-arrows="false"
          hide-delimiter-background
          height="213"
        >

          <v-carousel-item v-for="(camera, i) in data.camera_ids" :key="i">
            <v-img :src="`${cameras.filter(cam => cam.id == camera).map((cam) => cam.thumbnail_url)}?authorization=${token}`" />
            <div class="text-center caption font-weight-regular">
              <span>{{data.camera_names[i]}}</span>
            </div>
          </v-carousel-item>
        </v-carousel>
        
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-clock</v-icon>
                {{data.notify_time}} {{data.timezone}}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-users</v-icon>
                <span v-for="(email, emailKey) in data.recipients" :key="emailKey">{{email}}, </span>
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-calendar-alt</v-icon>
                <span v-for="(day, dayKey) in days" :key="dayKey">
                  <v-chip small
                  :color="data.notify_days.find( notifyDay => day.value == notifyDay) ? '#428bca':'#fff'"
                  :class="['mr-2 pa-0 mt-1 text-center day-border custom-chip',
                      (data.notify_days.find( notifyDay => day.value == notifyDay) ? ' white--text':'darken-4')]"
                  >{{day.text}}</v-chip>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-row>
          <v-col class="text-right">
            <v-icon size="16" class="mr-2" color="#428bca" @click="cloneSnapmail(data)">fas fa-clone</v-icon>
            <v-icon size="16" class="mr-2" color="#428bca" @click="isPaused(data)" v-if="data.is_paused">fas fa-play</v-icon>
            <v-icon size="16" class="mr-2" color="#428bca" @click="isPaused(data)" v-else>fas fa-pause</v-icon>
            <v-icon size="16" class="mr-2" color="#428bca" @click="openDialog(true, 'edit', data.id)">fas fa-edit</v-icon>
            <v-icon size="16" class="mr-2" color="#428bca" @click="removeSnapmail(data.id)">fas fa-trash-alt</v-icon>      
          </v-col>
        </v-row>
      </v-card>
      <!------------------------------------------- Close Modal Button ------------------------------------------->
    </div>
      
      <!----------------------------------- Snapmail Button ----------------------------------->
      <v-btn
        class="mb-10 ml-4 text-capitalize"
        dark
        tile
        elevation="0"
        color="#428bca"
        @click="openDialog(true, 'create', '')">
        Create a new Snapmail
      </v-btn>
      <!----------------------------------- Snapmail Dialog ----------------------------------->
      <SnapmailDialog v-if="dialog" />
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import { getCameraNameArray, reformatDataService, formatToReformatForApi } from '@/services/snapmailUtils';
  import SnapmailDialog from '@/components/SnapmailDialog';

  export default {
    components: {
      SnapmailDialog
    },
    data () {
      return {
        cycle: false,
        cameraNames: [],
        snapmails: {},
        days: [
          {id: 1, value: 'Monday', text: 'M'},
          {id: 2, value: 'Tuesday', text: 'T'},
          {id: 3, value: 'Wednesday', text: 'W'},
          {id: 4, value: 'Thursday', text: 'T'},
          {id: 5, value: 'Friday', text: 'F'},
          {id: 6, value: 'Saturday', text: 'S'},
          {id: 7, value: 'Sunday', text: 'S'},
        ],
      }
    },
    created() {
      this.fetchSnapmailData();
      this.formatData(this.snapmailsData);
      this.getCameraNames();
    },
    computed: {
      ...mapGetters({
        cameras: 'cameras',
        email: 'email',
        token: 'token',
        dialog: 'snapmail/getSnapmailDialog',
        snapmailsData: 'snapmail/getSnapmailData',
      }),
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'snapmail/setSnapmailDialog',
        setSnapmailDialogType: 'snapmail/setSnapmailDialogType',
        setSnapmailCardId: 'snapmail/setSnapmailCardId',
      }),
      ...mapActions({
        fetchSnapmailData: 'snapmail/fetchSnapmailData',
        deleteSnapmail: 'snapmail/deleteSnapmail',
        setSnapmailData: 'snapmail/setSnapmailData',
        updatePauseStatus: 'snapmail/updatePauseStatus',
      }),

      openDialog(bool, type, id) {
        this.setSnapmailCardId(id);
        this.setSnapmailDialog(bool);
        this.setSnapmailDialogType(type);
      },

      async isPaused(data) {
        await this.updatePauseStatus({id: data.id, is_paused: data.is_paused});
        await this.fetchSnapmailData();
      },

      formatData(data) {
        this.snapmails = reformatDataService(data);
      },

      async getCameraNames() {
        this.cameraNames = getCameraNameArray(this.cameras);
      },

      async cloneSnapmail(data) {
        await this.setSnapmailData(formatToReformatForApi(data, this.email));
        await this.fetchSnapmailData();
      },

      removeSnapmail(id) {
        this.deleteSnapmail(id);
      }
    },
    watch: {
      snapmailsData(val) {
        this.formatData(val);
      }
    }
  }
</script>

<style>
  .day-border {
    border:  1px solid #428bca !important;
  }
  .custom-chip {
    border-radius: 24px;
    font-size: 12px;
    height: 24px;
    width: 24px;
    line-height: 24px;
    display: inline-block;
  }
</style>