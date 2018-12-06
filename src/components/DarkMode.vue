<template>
  <div id="dark-mode">
    <v-checkbox v-model="darkMode" label="Dark Mode" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      darkMode: false
    }
  },
  mounted () {
    this.darkMode = this.$store.state.darkMode
  },
  watch: {
    darkMode: function () {
      if (this.darkMode) {
        this.$vuetify.theme.primary = '#32A6fF'
      } else {
        this.$vuetify.theme.primary = '#1976D2'
      }

      this.$store.dispatch('setDarkMode', this.darkMode)
    }
  }
}
</script>

<style scoped>
#dark-mode {
  position: fixed;
  bottom: 0px;
  right: 0px;
  width: 120px;
}
</style>
