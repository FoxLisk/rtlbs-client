<template>
  <div>
    <v-container grid-list-sm>
      <v-layout>
        <v-flex offset-lg3 lg6 offset-sm1 sm10 offset-md2 md8 offset-xs0 xs12>
          <v-card height="100%">
            <v-card-title>
              <h2>Latest room times</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-progress-linear v-if="latestRoomtimes.length === 0" :indeterminate="true"></v-progress-linear>

              <v-list two-line>
                <template v-for="rt in latestRoomtimes">
                  <v-list-tile avatar :key="'tile-' + rt.id" @click="openLatestRoomtime(rt)">
                    <v-list-tile-content>
                      <v-list-tile-sub-title class="text--primary roomtime">
                        <strong>{{ rt.player }}</strong>:
                        {{ rt.segment | segmentNameFromSlug }},
                        {{ rt.room | roomNameFromSlug }}
                        <div class="time-since">
                          {{ rt.datetime_updated | timeSince }}
                          <div style="text-align: right">
                            <v-icon v-if="rt.description" small>description</v-icon>
                            <v-icon v-if="rt.media.type === 'video' || rt.media.type === 'twitch'" small>movie</v-icon>
                            <v-icon v-if="rt.media.type === 'image'" small>photo</v-icon>
                          </div>
                        </div>
                      </v-list-tile-sub-title>

                      <v-list-tile-sub-title class="text--primary rt-summary">
                        <span class="hidden-xs-only">
                          <span class="stat">
                            <strong>frames:</strong>
                            {{ rt.frames | frames }}
                          </span>
                          <span class="stat">
                            <strong>lag:</strong> {{ rt.lag }}
                          </span>
                          <span class="stat">
                            <strong>menues:</strong> {{ rt.menues }}
                          </span>
                          <span v-if="rt.idle" class="stat">
                            <strong>idle:</strong> {{ rt.idle }}
                          </span>
                          <span v-if="rt.rank" class="stat">
                            <strong>rank:</strong>
                            #{{ rt.rank.rank }}
                          </span>
                        </span>
                        <span class="hidden-sm-and-up">
                          <span class="stat">
                            <strong>frm:</strong>
                            {{ rt.frames | frames }}
                          </span>
                          <span class="stat">
                            <strong>lag:</strong> {{ rt.lag }}
                          </span>
                          <span class="stat">
                            <strong>mnu:</strong> {{ rt.menues }}
                          </span>
                          <span v-if="rt.idle" class="stat">
                            <strong>idl:</strong> {{ rt.idle }}
                          </span>
                          <span v-if="rt.rank" class="stat">
                            <strong>rnk:</strong>
                            #{{ rt.rank.rank }}
                          </span>
                        </span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="'divider-' + rt.id" />
                </template>
              </v-list>
              <mugen-scroll :handler="fetchRoomTimes" :should-handle="!loading && !reachedEnd"></mugen-scroll>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import RoomtimeService from '@/services/RoomtimeService'

export default {
  data () {
    return {
      latestRoomtimes: [],
      loading: false,
      reachedEnd: false
    }
  },
  methods: {
    openLatestRoomtime (rt) {
      this.$router.push({ name: 'room-detail', params: { slug: rt.room }, hash: '#' + rt.segment + '/' + rt.id })
    },
    async fetchRoomTimes () {
      this.loading = true

      const numRoomtimes = this.latestRoomtimes.length
      const lastId = numRoomtimes > 0 ? this.latestRoomtimes[numRoomtimes - 1].id : null
      const roomTimes = (await RoomtimeService.latest(lastId)).data

      if (roomTimes.length === 0) {
        this.reachedEnd = true
      } else {
        this.latestRoomtimes = this.latestRoomtimes.concat(roomTimes)
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.time-since {
  position: absolute;
  right: 12px;
  top: 14px;
}

.rt-summary .stat {
  display: inline-block;
  margin-left: 4px;
  margin-right: 4px;
}

.rt-summary .stat:first-child {
  margin-left: 0px;
}

.hidden-sm-and-up .stat {
  margin-left: 1px;
  margin-right: 1px;
}

.roomtime {
  padding-right: 90px;
}
</style>
