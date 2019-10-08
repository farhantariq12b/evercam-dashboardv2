<template>
  <v-container class="white lighten-5">
    <v-sheet elevation="1">
      <v-tabs>
        <v-tab class="text-capitalize body-2">
          Snapmail - Scheduled Emails
        </v-tab>
      </v-tabs>
    </v-sheet>
    
    <v-row v-if="snapmailsList.length == 0">
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

    <div v-else>
      <v-card
        v-for="(data, key) in snapmailsList"
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
              <v-list-item-subtitle class="mb-2">
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-clock</v-icon>
                {{data.notify_time}} {{data.timezone}}
              </v-list-item-subtitle>

              <v-list-item-subtitle class="mb-2">
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-users</v-icon>
                <span v-for="(email, emailKey) in data.recipients" :key="emailKey">{{email}}, </span>
              </v-list-item-subtitle>

              <v-list-item-subtitle class="mb-2">
                <v-icon size="14" color="#aaa" class="mr-3">fas fa-calendar-alt</v-icon>
                <span v-for="(day, dayKey) in days" :key="dayKey">
                  <v-chip small
                  :color="data.notify_days.find( notifyDay => day.value == notifyDay) ? '#428bca':'#fff'"
                  :class="['mr-2 pa-0 mt-1 day-border custom-chip',
                      (data.notify_days.find( notifyDay => day.value == notifyDay) ? ' white--text':'darken-4')]"
                  >{{day.letter}}</v-chip>
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
            <v-menu
                v-model="menus['menu'+key]"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-icon 
                    size="16" 
                    class="mr-2" 
                    color="#428bca"
                    v-on="on"
                  >fas fa-trash-alt</v-icon>
                </template>

                <v-card class="pt-0 pl-2 pr-2 pb-2">
                  <v-card-title class="body-1">
                    Are you sure?
                  </v-card-title>
                  <v-card-actions>
                    <v-btn
                      class="width-117 text-capitalize"
                      dark
                      tile
                      elevation="0"
                      color="#428bca"
                      @click="removeSnapmail(data.id, menus['menu'+key], key)">Yes, Remove</v-btn>
                    <v-btn tile elevation="0" class="width-76" height="36" @click="menus['menu'+key] = false">No</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
          </v-col>
        </v-row>
      </v-card>
    </div>
      
      <v-btn
        class="mb-10 ml-4 text-capitalize"
        dark
        tile
        elevation="0"
        color="#428bca"
        @click="openDialog(true, 'create', '')">
        Create a new Snapmail
      </v-btn>
      <SnapmailDialog v-if="dialog" />
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import SnapmailDialog from '@/components/snapmail/SnapmailDialog';
  import { getCameraNames, formatToArray, formatApiToString } from '@/services/snapmail/snapmailUtils';
  import config from '@/services/snapmail/data.config';

  export default {
    components: {
      SnapmailDialog,
    },
    data() {
      return {
        menus: {},
        cycle: false,
        cameraNames: [],
        snapmailsList: {},
        days: null,
      }
    },
    async asyncData({ store, params }) {
      await store.dispatch('snapmail/getSnapmails');
    },
    created() {
      this.days = config.days;
      this.formatSnapmailsToArray(this.snapmails);
      this.getCameraNames();
    },
    computed: {
      ...mapGetters({
        cameras: 'cameras',
        email: 'email',
        token: 'token',
        dialog: 'snapmail/getSnapmailDialog',
        snapmails: 'snapmail/getSnapmails',
      }),
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'snapmail/setSnapmailDialog',
        setSnapmailDialogType: 'snapmail/setSnapmailDialogType',
        setSnapmailId: 'snapmail/setSnapmailId',
      }),
      ...mapActions({
        getSnapmails: 'snapmail/getSnapmails',
        destroySnapmail: 'snapmail/destroySnapmail',
        createSnapmail: 'snapmail/createSnapmail',
        updatePauseStatus: 'snapmail/updatePauseStatus',
      }),

      openDialog(bool, type, id) {
        this.setSnapmailId(id);
        this.setSnapmailDialog(bool);
        this.setSnapmailDialogType(type);
      },

      async isPaused(data) {
        await this.updatePauseStatus({ id: data.id, is_paused: data.is_paused });
        await this.getSnapmails();
      },

      formatSnapmailsToArray(data) {
        this.snapmailsList = formatToArray(data);
      },

      async getCameraNames() {
        this.cameraNames = getCameraNames(this.cameras);
      },

      async cloneSnapmail(data) {
        await this.createSnapmail(formatApiToString(data, this.email));
        await this.getSnapmails();
      },

      removeSnapmail(id, menu, key) {
        console.log(this.menus['menu'+key]);
        this.menus['menu'+key] = false;
        this.destroySnapmail(id);
      },
    },
    watch: {
      snapmails(val) {
        this.formatSnapmailsToArray(val);
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
    display: inline-block;
    line-height: 24px;
    text-align: center;
  }
  .width-117 {
    width: 117px;
  }
  .width-76 {
    width: 76px;
  }
  .v-carousel__controls__item {
    top: -14px;
  }
</style>