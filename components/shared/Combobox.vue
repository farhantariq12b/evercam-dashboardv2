<template>
	<div>
    <ValidationProvider name="Recipient" rules="required|email">
      <v-combobox
        v-model="recipients"
        slot-scope="{ errors }"
        :error-messages="errors"
        multiple
        chips
        outlined
        height="20"
        @change="selectedRecipients"
        class="mb-0 pb-0"
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
    </ValidationProvider>
  </div>

</template>
<script>
  export default {
    props: ['recipient'],
    data() {
      return {
        recipients: this.recipient,
      }
    },
    methods: {
      selectedRecipients() {
        this.$emit('selectedRecipients',this.recipients);
      }
    }
  }
</script>