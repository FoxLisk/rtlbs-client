<template>
  <div>
    <v-container fluid grid-list-sm>
      <v-layout>
        <v-flex lg5 offset-lg1 style="margin-bottom: 20px;">
          <h1>
            {{ segment.name }}:
            {{ slug | roomNameFromSlug }}
          </h1>
        </v-flex>
        <v-flex lg6>
          <v-btn small color="blue-grey" class="white--text" :to="{ 'name': 'room-detail', params: { slug: prevRoom.slug } }" v-if="prevRoom">
            <v-icon dark>arrow_left</v-icon>
            {{ prevRoom.name }}
          </v-btn>
          <v-btn small color="blue-grey" class="white--text" :to="{ 'name': 'room-detail', params: { slug: nextRoom.slug } }" v-if="nextRoom">
            {{ nextRoom.name }}
            <v-icon dark>arrow_right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex lg10 offset-lg1 class="elevation-4" style="background-color: white">
          <room-table
            :rooms="rooms"
            @changed="handleChanged"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import RoomTable from '@/components/RoomTable'
import RoomtimeService from '@/services/RoomtimeService'
import { rooms, roomsBySlug } from '@/fixtures'
const _ = require('lodash')

export default {
  mounted () {
    this.init()
  },
  data () {
    return {
      rooms: null
    }
  },
  components: {
    RoomTable
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'room-detail' && from.name === 'room-detail' && from.path !== to.path) {
        this.init()
      }
    }
  },
  methods: {
    async init () {
      const response = (await RoomtimeService.list_room(this.slug)).data

      this.rooms = []
      if (response.roomtimes) {
        response.roomtimes.forEach((rt) => {
          const room = _.clone(roomsBySlug[this.slug])
          room.roomtime = rt
          room.key = rt.id
          room.no = rt.rank ? rt.rank.rank : ''
          this.rooms.push(room)
        })
      }
    },
    handleChanged () {
      this.init()
    }
  },
  computed: {
    slug () {
      return this.$store.state.route.params.slug
    },
    segment () {
      return roomsBySlug[this.slug].segment
    },
    prevRoom () {
      const index = _.findIndex(rooms, { slug: this.slug })
      return rooms[index - 1]
    },
    nextRoom () {
      const index = _.findIndex(rooms, { slug: this.slug })
      return rooms[index + 1]
    }
  }
}
</script>

<style scoped>
</style>
