<template>

  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-container>
        <v-row>
          <v-col md="11" class="body-1 font-weight-medium">
            New Snapmail
          </v-col>
          <v-col md="1" class="mt-n2 pt-0">
            <v-icon  @click="setSnapmailDialog(false)">fas fa-times</v-icon>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <template v-if="loaded">
          <SnapmailForm :snapmailData="dialogType == 'create' ? snapmailData: snapmails" />
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import SnapmailForm from '@/components/SnapmailForm';
  import {arrayToString, timeFormat, formatDataService, reformatDataForEdit} from '@/services/snapmailUtils';
  export default {
    components: {
      SnapmailForm
    },
    data() {
      return {
        loaded: false,
        snapmails: {},
        snapmailData: {
          camera_exids: [],
          recipients: [],
          notify_time: null,
          timezone: null,
          notify_days: [],
        },
      }
    },
    computed: {
      ...mapGetters({
        dialog: 'snapmail/getSnapmailDialog',
        dialogType: 'snapmail/getSnapmailDialogType',
        snapmailDataById: 'snapmail/getSnapmailDataById',
        snapmailCardId: 'snapmail/getSnapmailCardId',
      }),
    },
    async created() {
      if(this.snapmailCardId != ''){
        await this.fetchSnapmailDataById(this.snapmailCardId)
        await this.formatData(this.snapmailDataById);
      }else{
        this.loaded = true;
      }
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'snapmail/setSnapmailDialog',
      }),
      ...mapActions({
        fetchSnapmailDataById: 'snapmail/fetchSnapmailDataById',
      }),

      async formatData(data) {
        this.snapmails = await reformatDataForEdit(data);
        this.loaded = true;
      },
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