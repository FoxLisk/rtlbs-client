<template>
  <v-container fluid grid-list-sm>
    <v-layout>
      <v-flex lg10 offset-lg1 class="elevation-4" style="background-color: white">
        <segment-tabs
          @changed="handleChanged"
          :roomsBySegment="roomsBySegment"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SegmentTabs from '@/components/SegmentTabs'
import RoomtimeService from '@/services/RoomtimeService'
const _ = require('lodash')

export default {
  mounted () {
    this.init()
  },
  data () {
    return {
      roomsBySegment: null
    }
  },
  methods: {
    async init () {
      const leaderboardsList = (await RoomtimeService.leaderboards()).data
      leaderboardsList.forEach((room) => {
        room.key = room.id
      })
      this.roomsBySegment = _.groupBy(leaderboardsList, 'segment')
    },
    handleChanged () {
      this.init()
    }
  },
  components: {
    SegmentTabs
  }
}
</script>

<style scoped>
</style>
