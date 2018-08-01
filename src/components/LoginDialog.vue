<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogState.login" scrollable persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-card-text>
          <v-progress-linear v-if="isSubmitting" :indeterminate="true"></v-progress-linear>

          <v-alert v-show="error" type="error" :valid="true" v-html="error"></v-alert>

          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Username"
                  v-model="username"
                  @keyup.enter="login"
                  :disabled="isSubmitting"
                  ref="focusField"
                  required
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="password"
                  @keyup.enter="login"
                  :disabled="isSubmitting"
                  required
                />
              </v-flex>
            </v-layout>
          </v-container>
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
            color="green darken-1"
            :disabled="isSubmitting"
            @click.native="login"
            dark
          >Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { restErrorToString } from '@/utils'

export default {
  props: ['dialogState'],
  mounted () {
    this.$watch('dialogState.login', (isShown) => {
      if (isShown) {
        this.$refs.focusField.focus()
      }
    })
  },
  data () {
    return {
      username: '',
      password: '',
      error: null,
      isSubmitting: false
    }
  },
  methods: {
    closeDialog () {
      this.username = ''
      this.password = ''
      this.error = null
      this.dialogState.login = false
    },
    async login () {
      if (this.username.length * this.password.length === 0) {
        this.error = 'Please fill in all fields.'
        return
      }

      this.isSubmitting = true

      try {
        const loginResponse = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })

        const user = loginResponse.data.player
        delete user.password

        this.$store.dispatch('setToken', loginResponse.data.token)
        this.$store.dispatch('setUser', user)
        this.dialogState.snackbar = true
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
  display: block
}
</style>
