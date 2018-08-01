<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogState.editDescription" scrollable persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit description</span>
        </v-card-title>
        <v-card-text style="text-align: left;">
          <v-progress-linear v-if="isSubmitting" :indeterminate="true"></v-progress-linear>

          <v-alert v-show="error" type="error" :valid="true" v-html="error"></v-alert>

          <vue-editor :disabled="isSubmitting" v-model="description"></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            @click.native="closeDialog"
            :disabled="isSubmitting"
            flat
          >Close</v-btn>
          <v-btn
            color="green"
            @click.native="save"
            :disabled="isSubmitting"
            dark
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import PlayerService from '@/services/PlayerService'
import { restErrorToString } from '@/utils'

export default {
  props: ['dialogState', 'initialDescription'],
  data () {
    return {
      error: null,
      description: this.initialDescription,
      isSubmitting: false
    }
  },
  methods: {
    closeDialog () {
      this.error = null
      this.dialogState.editDescription = false
    },
    async save () {
      this.isSubmitting = true
      try {
        await PlayerService.saveDescription(this.$store.state.user.username, {
          description: this.description
        })
        this.$emit('save', { newDescription: this.description })
        this.closeDialog()
      } catch (error) {
        this.error = restErrorToString(error)
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.alert {
  display: block;
}
</style>
