<template>
  <v-container>
    <v-row>
      <v-col class="col12">
        <v-simple-table class="shares-table">
          <thead>
            <th class="subtitle-1 table-header">Shared With</th>
            <th class="subtitle-1 table-header">Shared by</th>
            <th class="subtitle-1 table-header">Rights</th>
            <th class="table-header"></th>
            <th class="subtitle-1 table-header">Action</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <v-avatar size="30px" class="float-left gravatar-margin">
                  <img
                    :src="owner.avatar"
                  />
                </v-avatar>
                <v-card flat class="float-left card-background">
                  <v-list-item class="item-padding">
                    <v-list-item-content>
                      <v-list-item-title class="caption text-height">
                        {{ owner.fullname }} <small v-if="owner.email === user_email" class="highlight">(you)</small>
                      </v-list-item-title>
                      <v-list-item-subtitle class="caption text-height">{{ owner.email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td></td>
              <td class="col-rights caption">
                Is Owner
              </td>
              <td class="col-button"></td>
              <td>
                <v-dialog
                  v-model="dialog"
                  width="500"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="owner.email === user_email"
                      class="transfer-link caption"
                      text
                      v-on="on"
                    >
                      Transfer
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title
                      class="subtitle-1 grey lighten-2"
                      primary-title
                    >
                      Transfer Camera Ownership
                    </v-card-title>

                    <v-card-text>
                      <p class="caption gravatar-margin">
                        Transfer ownership to a user who you are already sharing the camera with.
                      </p>
                      <p class="caption">
                        <strong>
                          Once you transfer, Camera will be shared with you with full-rights.
                        </strong>
                      </p>
                      <v-select
                        :items="shares"
                        class="caption remove-padding"
                        placeholder="Select a new owner..."
                        hide-details
                        return-object
                        @change="onChangeOwner"
                      >
                        <template v-slot:selection="data">
                          <v-list-item-content>
                            <v-list-item-title class="caption" v-text="data.item.fullname" />
                          </v-list-item-content>
                        </template>
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title class="caption" v-text="data.item.fullname" />
                          </v-list-item-content>
                        </template>
                      </v-select>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="button-padding">
                      <v-btn
                        color="error"
                        depressed
                        @click="transferOwnership"
                      >
                        Transfer
                      </v-btn>
                      <v-btn
                        class="button-style"
                        outlined
                        depressed
                        @click="dialog = false">
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            <tr v-for="share in shares">
              <td>
                <v-avatar size="30px" class="float-left gravatar-margin">
                  <img
                    :src="share.avatar"
                  />
                </v-avatar>
                <v-card flat class="float-left card-background">
                  <v-list-item class="item-padding">
                    <v-list-item-content>
                      <v-list-item-title class="caption text-height">
                        {{ share.fullname }} <small v-if="share.email === user_email" class="highlight">(you)</small>
                      </v-list-item-title>
                      <v-list-item-subtitle class="caption text-height">{{ share.email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td>
                <v-card flat class="card-background">
                  <v-list-item class="sharer-padding">
                    <v-list-item-content>
                      <v-list-item-title class="caption text-height">{{ share.sharer_name }}</v-list-item-title>
                      <v-list-item-subtitle class="caption text-height">{{ share.sharer_email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td class="col-rights">
                <v-select
                  v-model="share.permission"
                  :items="rights"
                  class="caption remove-padding"
                  hide-details
                  return-object
                  v-on:change="onChangeRights($event, share.id, share.email, 'shares')"
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title class="caption" v-text="data.item.text" />
                    </v-list-item-content>
                  </template>
                </v-select>
              </td>
              <td class="col-button">
                <v-btn
                  v-show="showUpdate == share.id"
                  depressed
                  color="primary"
                  class="caption"
                  @click="updateShare"
                >
                  Save
                </v-btn>
              </td>
              <td>
                <v-menu
                  left
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="smalest-size delete-icon"
                      v-on="on"
                    >
                      fa fa-trash-alt
                    </v-icon>
                  </template>
                  <v-card>
                    <v-card-text>
                      Are you sure?
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        text
                        color="blue darken-1"
                        v-bind:camera-id="share.camera_id"
                        v-bind:share-email="share.email"
                        v-bind:share-id="share.id"
                        @click="deleteShare"
                      >
                        Yes, Remove
                      </v-btn>
                      <v-btn
                        text
                      >
                        CANCEL
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </td>
            </tr>
            <tr v-for="request in share_requests">
              <td>
                <v-avatar size="30px" class="float-left gravatar-margin">
                  <img
                    :src="request.avatar"
                  />
                </v-avatar>
                <v-card flat class="float-left card-background">
                  <v-list-item class="item-padding">
                    <v-list-item-content>
                      <v-list-item-title class="caption text-height">
                        {{ request.email }} <small class="highlight">...pending</small>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td>
                <v-card flat class="card-background">
                  <v-list-item class="sharer-padding">
                    <v-list-item-content>
                      <v-list-item-title class="caption text-height">{{ request.sharer_name }}</v-list-item-title>
                      <v-list-item-subtitle class="caption text-height">{{ request.sharer_email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td class="col-rights">
                <v-select
                  v-model="request.permission"
                  :items="rights"
                  class="caption remove-padding"
                  hide-details
                  return-object
                  v-on:change="onChangeRights($event, request.id, request.email, 'shares/requests')"
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title class="caption" v-text="data.item.text" />
                    </v-list-item-content>
                  </template>
                </v-select>
              </td>
              <td class="col-button">
                <v-btn
                  v-show="showUpdate == request.id"
                  color="primary"
                  class="caption"
                  depressed
                  @click="updateShare"
                >
                  Save
                </v-btn>
              </td>
              <td>
                <v-menu
                  left
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="smalest-size delete-icon"
                      v-on="on"
                    >
                      fa fa-trash-alt
                    </v-icon>
                  </template>
                  <v-card>
                    <v-card-text>
                      Are you sure?
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        text
                        color="blue darken-1"
                        v-bind:camera-id="request.camera_id"
                        v-bind:share-request-email="request.email"
                        v-bind:share-id="request.id"
                        @click="deleteShareRequest"
                      >
                        Yes, Remove
                      </v-btn>
                      <v-btn
                        text
                      >
                        CANCEL
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <v-icon class="smalest-size delete-icon hide" @click="resendNotification">
                  fa fa-paper-plane
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" md="6">
        <v-card class="card-style">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-card-title class="subtitle-1">
              Share Camera with:
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="createRight"
                :items="rights"
                class="caption"
                hide-details
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title class="caption" v-text="data.item.text" />
                  </v-list-item-content>
                </template>
              </v-select>
              <v-text-field
                v-model="shareEmails"
                placeholder="Enter Email Address"
                class="caption"
                :rules="emailRules"
                required
              >
              </v-text-field>
              <v-textarea
                v-model="shareMessage"
                hide-details
                class="share-message"
                placeholder="Message to send in email"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn
                depressed
                color="primary"
                class="button-margin-left"
                @click="createShare"
              >
                Share
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .button-style {
    color: rgba(0, 0, 0, 0.60) !important;
    border: 1px solid rgba(0, 0, 0, 0.30) !important;
  }

  .transfer-link {
    color: #428bca;
    background-color: transition;
    padding: 0 !important;
    text-decoration: none;
  }

  .button-padding {
    padding-left: 24px !important;
  }

  .card-style {
    border-radius: 0;
    box-shadow: none;
  }

  .share-message {
    font-size: 0.75rem !important;
    font-weight: normal !important;
  }

  .highlight {
    color: rgba(0, 0, 0, 0.54);
  }
  .table-header {
    border-bottom: 2px solid #ddd;
  }

  .gravatar-margin {
    margin-top: 10px;
  }

  .text-height {
    line-height: normal !important;
  }

  .item-padding {
    padding: 0 5px;
  }

  .sharer-padding {
    padding: 0;
  }

  .card-background {
    background-color: transparent !important;
  }

  .col-rights {
    width: 16.66666667%;
  }

  .col-button {
    width: 8.33333333%;
  }

  .hide {
    display: none;
  }

  .delete-icon {
    font-size: 1rem !important;
    margin-right: 5px;
  }

  .button-margin-left {
    margin-left: 5px;
  }

  .remove-padding {
    padding-top: 0;
    margin-top: 0;
  }
</style>

<script>
import hex_md5 from "md5-hex"
export default {
  name: "Shares",
  data() {
    return {
      newOwner: null,
      valid: true,
      dialog: false,
      showUpdate: "",
      updateData: {},
      createRight: "minimum",
      shareEmails: "",
      shareMessage: "",
      rights: [
        { text: "Read Only", value: "minimum" },
        { text: "Read Only + Share", value: "minimal+share" },
        { text: "Full Rights", value: "full" }
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^(?!.*\.{2})[a-zA-Z0-9!.#$%&'*+"/=?^_`{|}~-]+@[a-zA-Z\d\-]+(\.[a-zA-Z]+)*\.[a-zA-Z]+\z*$/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  async asyncData({ params, store, $axios }) {
    const { data } = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}/shares`
    )

    const requests = await $axios.get(
      `${process.env.API_URL}cameras/${params.id}/shares/requests`, {
        params: { status: "PENDING" }
      }
    )

    let shares_list = []
    let requests_list = []
    let permission = ""
    let avatar = ""
    data.shares.forEach(function(share) {
      if (share.rights.indexOf("edit") !== -1) {
        permission = "full"
      } else if (share.rights.indexOf("share") !== -1) {
        permission = "minimal+share"
      } else {
        permission = "minimum"
      }

      let index = share.email.indexOf("@")
      let domain = share.email.substr((index+1))
      avatar = `https://gravatar.com/avatar/${hex_md5(share.email)}?d=https://favicon.yandex.net/favicon/${domain}`

      shares_list.push({
        id: share.id,
        avatar: avatar,
        fullname: share.fullname,
        user_id: share.user_id,
        email: share.email,
        sharer_name: share.sharer_name,
        sharer_email: share.sharer_email,
        permission: permission,
        camera_id: share.camera_id
      })
    })

    requests.data.share_requests.forEach(function(request) {
      if (request.rights.indexOf("edit") !== -1) {
        permission = "full"
      } else if (request.rights.indexOf("share") !== -1) {
        permission = "minimal+share"
      } else {
        permission = "minimum"
      }

      let index = request.email.indexOf("@")
      let domain = request.email.substr((index+1))
      avatar = `https://gravatar.com/avatar/${hex_md5(request.email)}?d=https://favicon.yandex.net/favicon/${domain}`

      requests_list.push({
        avatar: avatar,
        user_id: request.user_id,
        sharer_name: request.sharer_name,
        sharer_email: request.sharer_email,
        permission: permission,
        id: request.id,
        email: request.email,
        camera_id: request.camera_id
      })
    })

    let index = data.owner.email.indexOf("@")
    let domain = data.owner.email.substr((index+1))
    avatar = `https://gravatar.com/avatar/${hex_md5(data.owner.email)}?d=https://favicon.yandex.net/favicon/${domain}`
    data.owner.avatar = avatar

    return {
      shares: shares_list,
      owner: data.owner,
      share_requests: requests_list,
      user_email: store.getters.email
    }
  },
  methods: {
    getSahrePermissions(rights) {
      console.log(rights)
      if (rights.indexOf("edit") !== -1) {
        "full"
      } else if (rights.indexOf("share") !== -1) {
        "minimal+share"
      } else {
        "minimum"
      }
    },
    generateRightList(permissions) {
      let rights = ["list", "snapshot"]
      let baseRights = ["snapshot", "view", "edit", "delete", "list", "share"]
      if(permissions === "full") {
        baseRights.forEach(function(right) {
          if(right != "delete") {
            rights.push(right)
            rights.push(`grant~${right}`)
          }
        })
      }
      else if(permissions == "minimal+share") {
        rights = ["list", "snapshot", "share"]
      }
      return rights.join(",")
    },
    getFavicon(email) {
      let signature = hex_md5(email)
      let index = email.indexOf("@")
      let domain = email.substr((index+1))
      let favicon = `https://favicon.yandex.net/favicon/${domain}`
      return `https://gravatar.com/avatar/${signature}?d=${favicon}`
    },
    onChangeRights(e, shareID, email, src) {
      this.updateData = {route: src, email: email, rights: e.value}
      this.showUpdate = shareID
    },
    updateShare() {
      this.$axios
        .$patch(`${process.env.API_URL}cameras/${this.$route.params.id}/${this.updateData.route}`,
          {
            email: this.updateData.email,
            rights: this.generateRightList(this.updateData.rights)
          }
        )
        .then(function(data) {
          console.log("Rights updated.")
        })
        .catch((jqXHR) => {
          console.log(jqXHR)
          console.log("Delete of camera shared failed. Please contact support.")
        })
      this.updateData = {}
      this.showUpdate = ""
    },
    deleteShare(event) {
      let control = $(event.currentTarget)
      let share_id = parseInt(control.attr("share-id"))

      this.$axios
        .$delete(`${process.env.API_URL}cameras/${this.$route.params.id}/shares`, {
          data: { email: control.attr('share-email') }
        })
        .then(function(data) { })
        .catch((jqXHR) => {
          console.log(jqXHR)
          console.log("Delete of camera shared failed. Please contact support.")
        })

      let shares_list = []
      this.shares.forEach(function(share) {
        if (share.id !== share_id) {
          shares_list.push(share)
        }
      })
      this.shares = shares_list
    },
    deleteShareRequest(event) {
      let control = $(event.currentTarget)
      let share_request_id = control.attr("share-id")
      
      this.$axios
        .$delete(`${process.env.API_URL}cameras/${this.$route.params.id}/shares/requests`, {
          data: {
            email: control.attr("share-request-email"),
            key: share_request_id
          }
        })
        .then(function(data) { })
        .catch((jqXHR) => {
          console.log(jqXHR)
          console.log("Delete of share request failed. Please contact support.")
        })

      console.log("Camera share request deleted successfully.")
      let share_requests_list = []
      this.share_requests.forEach(function(request) {
        if (request.id !== share_request_id) {
          share_requests_list.push(request)
        }
      })
      this.share_requests = share_requests_list
    },
    resendNotification() {

    },
    async createShare() {
      if (this.$refs.form.validate()) {
        try {
          const data = await this.$axios
            .$post(`${process.env.API_URL}cameras/${this.$route.params.id}/shares`,
              {
                email: this.shareEmails,
                message: this.shareMessage,
                rights: this.generateRightList(this.createRight)
              }
            )

          let shares_list = this.shares
          let requests_list = this.share_requests
          let avatar = ""
          let permission = this.createRight
          data.shares.forEach(function(share) {
            let index = share.email.indexOf("@")
            let domain = share.email.substr((index+1))
            avatar = `https://gravatar.com/avatar/${hex_md5(share.email)}?d=https://favicon.yandex.net/favicon/${domain}`

            shares_list.push({
              id: share.id,
              avatar: avatar,
              fullname: share.fullname,
              user_id: share.user_id,
              email: share.email,
              sharer_name: share.sharer_name,
              sharer_email: share.sharer_email,
              permission: permission,
              camera_id: share.camera_id
            })
          })
          this.shares = shares_list

          data.share_requests.forEach(function(request) {

            let index = request.email.indexOf("@")
            let domain = request.email.substr((index+1))
            avatar = `https://gravatar.com/avatar/${hex_md5(request.email)}?d=https://favicon.yandex.net/favicon/${domain}`

            requests_list.push({
              avatar: avatar,
              user_id: request.user_id,
              sharer_name: request.sharer_name,
              sharer_email: request.sharer_email,
              permission: permission,
              id: request.id,
              email: request.email,
              camera_id: request.camera_id
            })
          })
          this.share_requests = requests_list

          if(data.errors.length == 0) {
            console.log("Camera successfully shared with user(s).")
          }
          else {
            let $ul = $('<ul style="float: left;">')
            data.errors.forEach(function(error) {
              $ul.append(`<li>${error.text}</li>`)
            })
            console.log(`<p>Camera has been successfully shared but few errors came along, see below.</p>${$ul.html()}`)
          }
          this.clearForm()
        } catch(e) {
          console.log(e)
        }
      }
    },
    clearForm() {
      this.valid = true
      this.$refs.form.resetValidation()
      this.shareEmails = ""
      this.shareMessage = ""
      this.createRight = "minimum"
    },
    onChangeOwner(data) {
      this.newOwner = data
    },
    async transferOwnership() {
      try {
        const response = await this.$axios
          .$put(`${process.env.API_URL}cameras/${this.$route.params.id}`,
            {
              user_id: this.newOwner.user_id
            }
          )

        const { data } = await this.$axios.get(
          `${process.env.API_URL}cameras/${this.$route.params.id}/shares`
        )
        let shares_list = []
        let permission = ""
        let avatar = ""
        data.shares.forEach(function(share) {
          if (share.rights.indexOf("edit") !== -1) {
            permission = "full"
          } else if (share.rights.indexOf("share") !== -1) {
            permission = "minimal+share"
          } else {
            permission = "minimum"
          }

          let index = share.email.indexOf("@")
          let domain = share.email.substr((index+1))
          avatar = `https://gravatar.com/avatar/${hex_md5(share.email)}?d=https://favicon.yandex.net/favicon/${domain}`

          shares_list.push({
            id: share.id,
            avatar: avatar,
            fullname: share.fullname,
            user_id: share.user_id,
            email: share.email,
            sharer_name: share.sharer_name,
            sharer_email: share.sharer_email,
            permission: permission,
            camera_id: share.camera_id
          })
        })
        data.owner.avatar = this.getFavicon(data.owner.email)

        console.log("Camera ownership has been successfully transferred.")
        this.newOwner = null
        this.dialog = false
        this.shares = shares_list
        this.owner = data.owner
      } catch(e) {
        console.log(e)
        console.log("Failed to transfer camera ownership.")
      }
    }
  }
}
</script>