<template>
  <div>
    <v-container fluid grid-list-sm>
      <v-layout style="margin-bottom: 12px;">
        <v-flex lg4 offset-lg1>
          <v-card height="100%">
            <v-card-title>
              <h2>Stats</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="stat">
                <label>
                  Username:
                </label>
                <span>
                  {{ activePlayer.username }}
                </span>
              </div>

              <div class="stat">
                <label>
                  Screens:
                </label>
                <span>
                  {{ activePlayer.num_roomtimes }}
                </span>
              </div>

              <div class="stat">
                <label>
                  Rank:
                </label>
                <span>
                  #{{ activePlayer.rank }}
                </span>
              </div>

              <div class="stat">
                <label>
                  Best screen:
                </label>
                <span>
                  <router-link :to="{ 'name': 'room-detail', params: { slug: activePlayer.best_room.room } }" v-if="activePlayer.best_room">{{ activePlayer.best_room | bestWorst }}</router-link>
                </span>
              </div>

              <div class="stat">
                <label>
                  Worst screen:
                </label>
                <span>
                  <router-link :to="{ 'name': 'room-detail', params: { slug: activePlayer.worst_room.room } }" v-if="activePlayer.worst_room">{{ activePlayer.worst_room | bestWorst }}</router-link>
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex lg6>
          <v-card height="100%">
            <v-card-title>
              <h2>Description</h2>
              <v-btn
                icon
                class="mx-0 edit-description"
                @click="dialogState.editDescription = true"
                v-if="$store.state.user && activePlayer.username == $store.state.user.username"
              >
                <v-icon color="teal">edit</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="vue2-reset" v-html="activePlayer.description"></div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex lg10 offset-lg1 class="elevation-4" style="background-color: white">
          <segment-tabs
            @changed="handleChanged"
            :roomsBySegment="roomsBySegment"
          />
        </v-flex>
      </v-layout>
    </v-container>

    <edit-description-dialog
      v-if="dialogState.editDescription"
      :dialog-state="dialogState"
      :initial-description="activePlayer.description"
      @save="handleSaveDescription"
    />
  </div>
</template>

<script>
import PlayerService from '@/services/PlayerService'
import SegmentTabs from '@/components/SegmentTabs'
import EditDescriptionDialog from '@/components/EditDescriptionDialog'
import RoomtimeService from '@/services/RoomtimeService'
import { rooms } from '@/fixtures'
const _ = require('lodash')

export default {
  mounted () {
    this.init()
  },
  data () {
    return {
      activePlayer: {},
      dialogState: {
        editDescription: false
      },
      roomsBySegment: null
    }
  },
  components: {
    SegmentTabs,
    EditDescriptionDialog
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'player-detail' && from.name === 'player-detail' && from.path !== to.path) {
        this.init()
      }
    }
  },
  methods: {
    async init () {
      // Init
      this.roomsBySegment = null
      this.activePlayer = {}
      this.dialogState.editDescription = false

      // roomtimesPerRoom
      const username = this.$store.state.route.params.slug
      const allRoomtimes = (await RoomtimeService.list_player(username)).data

      const roomtimesPerRoom = _.groupBy(allRoomtimes, 'room')

      // roomsBySegment
      const newRooms = {}
      rooms.forEach((room) => {
        if (newRooms[room.segment.slug] === undefined) {
          newRooms[room.segment.slug] = []
        }

        const roomtimes = roomtimesPerRoom[room.slug] || [{}]
        for (let i = 1; i < roomtimes.length; ++i) {
          roomtimes[i].rank = null
        }

        roomtimes.forEach((rt) => {
          const rtRoom = _.clone(room)
          rtRoom.roomtime = rt
          rtRoom.key = room.slug + '-' + (rt.id || 'empty')
          newRooms[room.segment.slug].push(rtRoom)
        })
      })
      this.roomsBySegment = newRooms

      // activePlayer
      const slug = this.$store.state.route.params.slug
      this.activePlayer = (await PlayerService.get(slug)).data
    },
    handleSaveDescription (payload) {
      this.activePlayer.description = payload.newDescription
    },
    handleChanged () {
      this.init()
    }
  }
}
</script>

<style scoped>
.edit-description {
    right: 5px;
    top: 5px;
    position: absolute;
}

.stat {
  margin-top: 8px;
  margin-bottom: 8px;
}
.stat:first-child {
  margin-top: 0px;
}

.stat label {
  font-size: 1.1em;
  display: inline-block;
}

.stat > span {
  float: right;
  display: inline-block;
}

@media screen and (max-width: 660px) {
  .stat > label {
    font-weight: bold;
  }

  .stat > span {
    display: block;
    float: none;
  }
}
</style>
