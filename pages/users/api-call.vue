<template>
<v-container>
  <v-row>
    <v-col cols="auto" lg="12" md="12" sm="12" xs="12" class="api-column">
      <v-card class="card-style">
        <v-card-text>API ID & Keys are for use by developers. <b>Do not share this information,</b> it gives the holder access to your Evercam account.</v-card-text>
        <v-card-text>
          <v-simple-table class="api-key-id">
            <tbody>
              <tr>
                <td class="col-3 cam-label subtitle-1">
                  ID & Key
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="API ID"
                    class="col-4 height-50 float-left"
                    :value="userApiId"
                    solo
                  />
                  <v-text-field
                    label="API KEY"
                    class="col-8 height-50 float-left"
                    :value="userApiKey"
                    solo
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          Live Snapshot
        </v-card-title>
        <v-card-text>
          <v-simple-table class="live-snapshot-area">
            <tbody>
              <tr>
                <td class="col-3 cam-label caption">
                  Choose Camera
                </td>
                <td class="col-8 caption">
                  <v-select
                    class="height-50"
                    :items="items"
                    label="Solo field"
                    solo
                  ></v-select>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to JPEG
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to JPEG"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          Recorded Snapshot
        </v-card-title>
        <v-card-text>
          <v-simple-table class="live-snapshot-area">
            <tbody>
              <tr>
                <td class="col-3 cam-label caption">
                  Choose Camera
                </td>
                <td class="col-8 caption">
                  <v-select
                    class="height-50"
                    :items="items"
                    label="Solo field"
                    solo
                  ></v-select>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  Date & Time
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to JPEG"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Snapshot
                </td>
                <td class="col-8 caption">
                 <v-text-field
                    label="URL to JPEG"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td class="col-3 cam-label caption">
                  URL to Dash
                </td>
                <td class="col-8 caption">
                  <v-text-field
                    label="URL to Dash"
                    class="col-12 height-50 float-left"
                    solo
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
      <v-card class="card-style">
        <v-card-title class="label subtitle-1">
          API Documentation available here.<v-btn icon color="blue" x-small target="blank" href="https://media.evercam.io/v2/swagger/index.html"><v-icon>fa fa-external-link-alt</v-icon></v-btn>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<style scoped>
.cam-label {
  width: 30%;
}
.height-50 {
  height: 50px;
}
.card-style {
  border-radius: 0;
  box-shadow: none;
}
.api-column td {
  border-bottom-width: 0 !important;
  height: auto;
  padding: 5px;
}
</style>

<script>
export default {
  data () {
    return {
      userApiId: '',
      userApiKey: ''
    }
  },
  mounted() {
    this.$axios
      .$get(process.env.API_URL + "auth/credentials")
      .then(response => {
        this.userApiId = response.api_id
        this.userApiKey = response.api_key
        console.log(this.userApiId )
        console.log(this.userApiKey )
      })
  }
}
</script>