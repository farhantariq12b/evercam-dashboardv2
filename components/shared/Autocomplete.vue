<template>
  <div>
  	<ValidationProvider name="Camera" rules="required">
      <v-autocomplete
          v-model="camera_ids"
          :items="cameras"
          @change="selectedCameras"
          slot-scope="{ errors }"
          :error-messages="errors"
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
    </ValidationProvider>
  </div>
</template>
<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex';

  export default {
    props: ['camera_exids'],
    data() {
      return {
        camera_ids: this.camera_exids,
      }
    },
    computed: {
      ...mapGetters({
        token: 'token',
        cameras: 'cameras',
      }),
    },
    methods: {
      remove(item) {
        const index = this.camera_ids.indexOf(item.id)
        if (index >= 0) this.camera_ids.splice(index, 1)
      },

      selectedCameras(val) {
        this.$emit('selectedCameras',this.camera_ids);
      }
    }
  }
</script>