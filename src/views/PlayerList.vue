<template>
  <v-container fluid grid-list-sm>
    <v-layout>
      <v-flex lg8 offset-lg2>
        <leader-boards :players="players"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PlayerService from '@/services/PlayerService'

export default {
  async mounted () {
    this.players = (await PlayerService.list()).data
  },
  data () {
    return {
      players: []
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
