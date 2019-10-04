<template>
	<v-combobox
    v-model="recipients"
    multiple
    chips
    outlined
    height="20"
    @change="selectedRecipients"
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