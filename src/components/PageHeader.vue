<template>
  <nav>
    <v-toolbar fixed :flat="$store.state.darkMode" id="main-toolbar">
      <v-toolbar-title class="mr-4">
        <router-link class="home" to="/" id="site-name">ALttP Strategy Hub</router-link>
      </v-toolbar-title>

      <v-toolbar-items>
        <v-btn flat :to="{ name: 'player-list' }">Players</v-btn>
        <v-btn flat :to="{ name: 'room-list' }">Rooms</v-btn>
        <v-btn flat :to="{ name: 'src' }">SRC</v-btn>
        <v-btn flat :to="{ name: 'info' }">Info</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="$store.state.user" :to="{ name: 'player-detail', params: { slug: $store.state.user.username } }">{{ $store.state.user.username }}</v-btn>
        <v-btn flat v-if="$store.state.user" @click="logout">Logout</v-btn>

        <v-btn flat v-if="!$store.state.user" @click.stop="dialogState.login = true">Login</v-btn>
        <v-btn flat v-if="!$store.state.user" @click.stop="dialogState.register = true">Register</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <login-dialog :dialog-state="dialogState" />

    <register-dialog :dialog-state="dialogState" />

    <v-snackbar
      :timeout="6000"
      top
      color="cyan darken-1"
      vertical
      auto-height
      multi-line
      v-model="dialogState.snackbar"
      >
        <div>
          <strong>Welcome {{ username }}!</strong>
        </div>
        <div>
          Click your profile (top right) and start entering times!
        </div>
        <v-btn
          style="margin-top: 4px;"
          @click.native="dialogState.snackbar = false"
          dark
          flat
          fab
        >Close</v-btn>
      </v-snackbar>
  </nav>
</template>

<script>
import LoginDialog from '@/components/LoginDialog'
import RegisterDialog from '@/components/RegisterDialog'

export default {
  data () {
    return {
      dialogState: {
        login: false,
        register: false,
        snackbar: false
      }
    }
  },
  components: {
    LoginDialog,
    RegisterDialog
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
    }
  },
  computed: {
    username () {
      return this.$store.state.user ? this.$store.state.user.username : null
    }
  }
}
</script>

<style scoped>
.home {
  text-decoration: none;
}

.theme--light .home {
  color: rgba(0, 0, 0, 0.87);
}

.theme--dark .home {
  color: rgba(255, 255, 255, 0.87);
}

.theme--light #main-toolbar {
  background: white;
}

.theme--dark #main-toolbar {
  background: #2F2F2F;
}

</style>
