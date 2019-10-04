<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-container>
        <v-row>
          <v-col md="11" class="body-1 font-weight-medium py-0">
            New Snapmail
          </v-col>
          <v-col md="1" class="mt-n2 pt-0">
            <v-icon  @click="setSnapmailDialog(false)">fas fa-times</v-icon>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <template v-if="hasLoaded">
          <SnapmailForm :snapmail="dialogType == 'create' ? initialSnapmail: snapmails" />
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';
  import SnapmailForm from '@/components/snapmail/SnapmailForm';
  import { formatEditRequestToString } from '@/services/snapmailUtils';
  export default {
    components: {
      SnapmailForm
    },
    data() {
      return {
        hasLoaded: false,
        snapmails: {},
        initialSnapmail: {
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
        snapmailById: 'snapmail/getSnapmailById',
        snapmailEditId: 'snapmail/getSnapmailEditId',
      }),
    },
    async created() {
      if(this.snapmailEditId != '') {
        await this.getSnapmailById(this.snapmailEditId)
        await this.formatToString(this.snapmailById);
      }else {
        this.hasLoaded = true;
      }
    },
    methods: {
      ...mapMutations({
        setSnapmailDialog: 'snapmail/setSnapmailDialog',
      }),
      ...mapActions({
        getSnapmailById: 'snapmail/getSnapmailById',
      }),

      async formatToString(snapmail) {
        this.snapmails = await formatEditRequestToString(snapmail);
        this.hasLoaded = true;
      },
    }
  }
</script>