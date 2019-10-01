<template>
  <v-container class="grey lighten-5">
    <v-sheet class="tabs" elevation="1">
      <v-tabs>
        <v-tab>
          Snapmail - Scheduled Emails
        </v-tab>
      </v-tabs>
    </v-sheet>
    
    <!----------------------------------- Snapmail Text ----------------------------------->
    <v-row v-if="snapmailsData.length == 0">
      <v-col md="6" class="mt-8 ml-4">
          Snapmail is a scheduled email that contains a snapshot from your camera. Include as many emails and cameras as you like.
          <br/><br/>
          This clever feature sends you up-to-date, high-resolution images direct to your inbox.
          <br/><br/>
          Send images the day before a site meeting or send all project stakeholders a daily/weekly update.
          <br/><br/>
          Now everyone is updated, and you haven’t left your desk.
      </v-col>
      <v-col>
        <v-img 
          :src="require('~/assets/snapmails.jpg')"
          max-width="280"
        >  
        </v-img>
      </v-col>
    </v-row>

    <!----------------------------------- Snapmail Card ----------------------------------->
    <div v-if="snapmailsData.length > 0">
      <v-card
        v-for="(data, key) in snapmailsData"
        :key="key"
        elevation="2"
        max-width="340"
        class="mt-10 ml-10 d-inline-block"
      >
        <v-carousel
          :continuous="false"
          :cycle="cycle"
          :show-arrows="false"
          hide-delimiter-background
          height="213"
        >
          <v-carousel-item
            v-for="(camera, i) in data.camera_exids"
            :key="i"
          >
            <v-img v-if="cameras[i].id == camera" :src="`${cameras[i].thumbnail_url}?authorization=${token}`" />
          </v-carousel-item>
        </v-carousel>
        
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-icon>fas fa-clock</v-icon>
                {{data.notify_time.hours    < 9 ? `0${data.notify_time.hours}`  :data.notify_time.hours}}:
                {{data.notify_time.minutes  < 9 ? `0${data.notify_time.minutes}`:data.notify_time.minutes }} 
                {{data.timezone}}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <v-icon>fas fa-users</v-icon>
                <span v-for="(email) in data.recipients">{{email}}, </span>
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <v-icon>fas fa-calendar-alt</v-icon>
                <span v-for="(day, dayKey) in days" :key="dayKey">

                  <v-chip :color="data.notify_days.find( notifyDay => day.value == notifyDay) ? 'primary':''">{{day.text}}</v-chip>
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-row>
          <v-col class="text-right">
            <v-icon>fas fa-clone</v-icon>
            <v-icon>fas fa-pause</v-icon>
            <v-icon>fas fa-edit</v-icon>
            <v-icon>fas fa-trash-alt</v-icon>
          </v-col>
        </v-row>
      </v-card>
    </div>
      
      <!----------------------------------- Snapmail Button ----------------------------------->
      <v-btn color="primary" class="mt-10 ml-10" dark @click="setSnapmailDialog(true)">Create a new Snapmail</v-btn>
      <!----------------------------------- Snapmail Dialog ----------------------------------->
      <SnapmailDialog :cameras="cameras" />
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import SnapmailDialog from '@/components/SnapmailDialog';
  export default {
    components: {
      SnapmailDialog
    },
    data () {
      return {
        cycle: false,
        days: [
          {id: 1, value: 'Mo', text: 'M'},
          {id: 2, value: 'Tu', text: 'T'},
          {id: 3, value: 'We', text: 'W'},
          {id: 4, value: 'Th', text: 'T'},
          {id: 5, value: 'Fr', text: 'F'},
          {id: 6, value: 'Sa', text: 'S'},
          {id: 7, value: 'Su', text: 'S'},
        ],
      }
    },
    computed: {
      ...mapGetters({
        cameras: 'cameras',
        token: 'token',
        snapmailsData: 'common/getSnapmailData',
      })
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'common/setSnapmailDialog',
      }),
    },
  }
</script>