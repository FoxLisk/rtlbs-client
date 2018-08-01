<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogState.register" scrollable persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Register</span>
        </v-card-title>
        <v-card-text>
          <v-progress-linear v-if="isSubmitting" :indeterminate="true"></v-progress-linear>

          <v-alert v-show="error" type="error" :valid="true" v-html="error"></v-alert>

          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Username / handle"
                  v-model="username"
                  @keyup.enter="register"
                  :disabled="isSubmitting"
                  ref="focusField"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Password"
                  type="password"
                  v-model="password"
                  @keyup.enter="register"
                  :disabled="isSubmitting"
                  hint="It will be encrypted on the server, but you should still use a unique password for this site."
                  required
                ></v-text-field>
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
            color="green"
            @click.native="register"
            :disabled="isSubmitting"
            dark
          >Register</v-btn>
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
    this.$watch('dialogState.register', (isShown) => {
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
      this.dialogState.register = false
    },
    async register () {
      if (this.username.length * this.password.length === 0) {
        this.error = 'Please fill in all fields.'
        return
      }

      this.isSubmitting = true
      try {
        const registerResponse = await AuthenticationService.register({
          username: this.username,
          password: this.password
        })

        const user = registerResponse.data
        delete user.password

        const loginResponse = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })

        this.$store.dispatch('setToken', loginResponse.data.token)
        this.$store.dispatch('setUser', loginResponse.data.player)
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
