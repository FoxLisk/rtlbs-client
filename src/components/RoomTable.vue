<template>
  <div style="position: relative;">
    <v-btn
      v-if="isRoomDetail() && isLoggedIn()"
      color="green"
      @click="addRoomtime(currentRoomDetailRoom)"
      style="z-index: 1"
      fab
      absolute
      top right
      icon
      dark
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-data-table
      id="room-table"
      :headers="headers"
      :items="rooms || []"
      :loading="rooms === null"
      ref="dTable"
      hide-actions
      expand
      item-key="key"
    >
      <template slot="items" slot-scope="props">
        <tr
          @click="expandRow(props, $event)"
          :class="getMediaClasses(props.item)"
          :key="'seg-tr-' + props.item.slug + '-' + (props.item.roomtime.id || 'empty')"
        >
          <!-- No / Rank -->
          <td class="text-xs-left" v-if="isRoomDetail()">
            <span v-if="props.item.no !== ''">#</span>{{ props.item.no }}
          </td>
          <td class="text-xs-left no" v-else>{{ props.index + 1 }}</td>

          <!-- Room name -->
          <td class="text-xs-left" v-if="!isRoomDetail()" style="white-space: nowrap;">
            <router-link :to="{ name: 'room-detail', params: { slug: props.item.slug } }" class="big-link">
              {{ props.item.name }}
            </router-link>
            <v-icon v-if="props.item.roomtime.description" small>description</v-icon>
            <v-icon v-if="isVideo(props.item)" small>movie</v-icon>
            <v-icon v-if="isImage(props.item)" small>photo</v-icon>
          </td>

          <!-- Player name -->
          <td class="text-xs-left" style="white-space: nowrap;">
            <span v-if="!isPlayerDetail() && props.item.roomtime.player">
              <router-link :to="{ name: 'player-detail', params: { slug: props.item.roomtime.player } }" class="big-link">
                {{ props.item.roomtime.player }}
              </router-link>
              <small v-if="isRoomList() && props.item.roomtime.shared_ranks > 1">
                (+{{ props.item.roomtime.shared_ranks - 1 }} other{{ props.item.roomtime.shared_ranks - 1 | pluralize }})
              </small>
            </span>
            <span v-else>
              <span v-if="props.item.roomtime.rank">
                #{{ props.item.roomtime.rank.rank }}
                <small v-if="props.item.roomtime.shared_ranks > 1">
                  (+{{ props.item.roomtime.shared_ranks - 1 }} other{{ props.item.roomtime.shared_ranks - 1 | pluralize }})
                </small>
              </span>
            </span>

            <span v-if="isRoomDetail()">
              <v-icon v-if="props.item.roomtime.description" small>description</v-icon>
              <v-icon v-if="isVideo(props.item)" small>movie</v-icon>
              <v-icon v-if="isImage(props.item)" small>photo</v-icon>
            </span>
          </td>

          <!-- Frames+ -->
          <td class="text-xs-left">
            <span v-if="props.item.roomtime.frames !== undefined">
              {{ props.item.roomtime.frames | frames }}
            </span>
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.roomtime.lag !== undefined">
              {{ props.item.roomtime.lag }}
            </span>
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.roomtime.idle !== undefined">
              {{ props.item.roomtime.idle }}
            </span>
          </td>
          <td class="text-xs-left">
            <span v-if="props.item.roomtime.menues !== undefined">
              {{ props.item.roomtime.menues }}
            </span>
          </td>

          <!-- Edit -->
          <td class="px-0">
            <span v-if="canEdit(props.item)" class="right">
              <v-btn
                color="blue"
                class="mx-1"
                v-if="props.item.roomtime.id !== undefined"
                @click="editRoomtime(props.item)"
                flat
                icon
                small
              >
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn
                color="green"
                class="mx-0"
                @click="addRoomtime(props.item)"
                v-if="isPlayerDetail()"
                flat
                icon
                small
              >
                <v-icon>add</v-icon>
              </v-btn>
            </span>
          </td>
        </tr>
      </template>

      <template slot="expand" slot-scope="props">
        <v-card flat class="rt-description">
          <v-card-text align="left">
            <v-layout>
              <v-flex xs4 v-if="props.item.roomtime.media.url" class="media">
                <template v-if="props.item.roomtime.media.type === 'image'">
                  <image-dialog :src="props.item.roomtime.media.url" />
                </template>
                <template v-else-if="props.item.roomtime.media.type === 'video'">
                  <video
                    controls=""
                    preload=""
                    loop=""
                    muted=""
                    width="95%"
                    :src="props.item.roomtime.media.url"
                  ></video>
                </template>
                <template v-else-if="props.item.roomtime.media.type === 'twitch'">
                  <iframe
                    :src="props.item.roomtime.media.embed_url"
                    frameborder="0"
                    allowfullscreen="true"
                    width="700"
                    height="300"
                    scrolling="no"
                  ></iframe>
                </template>
              </v-flex>
              <v-flex xs8>
                <h3>
                  {{ props.item.name }}
                </h3>
                <div
                  class="vue2-reset"
                  v-if="props.item.roomtime.description"
                  v-html="props.item.roomtime.description"></div>
                <div v-else>
                  <small>No description supplied.</small>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>

    <edit-roomtime-dialog
      v-if="dialogState.rt"
      :dialog-state="dialogState"
      @save="handleSaveRoomtime"
      @remove="handleRemoveRoomtime"
    />
  </div>
</template>

<script>
import EditRoomtimeDialog from '@/components/EditRoomtimeDialog'
import ImageDialog from '@/components/ImageDialog'
import { roomsBySlug } from '@/fixtures'
const _ = require('lodash')

const emptyRoom = {
  frames: '',
  lag: '',
  idle: '',
  menues: '',
  description: '',
  media: '',
  lttphackVersion: 9,
  twitchUrl: ''
}

export default {
  props: ['rooms'],
  mounted () {
    if (window.location.hash) {
      const openRoom = window.location.hash.slice(1).split('/')[1]
      if (openRoom) {
        this.openRoom = openRoom
      }
    }
  },
  watch: {
    rooms (rooms, oldRooms) {
      if (oldRooms && oldRooms.length) {
        for (let i = 0; i < oldRooms.length; i += 1) {
          const room = oldRooms[i]
          this.$set(this.$refs.dTable.expanded, room.key, false)
        }
      }

      if (this.openRoom) {
        const room = _.find(rooms, r => r.roomtime && parseInt(r.roomtime.id, 10) === parseInt(this.openRoom, 10))
        if (room) {
          this.$set(this.$refs.dTable.expanded, room.key, true)
        }
      }
    }
  },
  data () {
    const headers = []

    if (this.isRoomDetail()) {
      headers.push({ text: 'Rank', sortable: false, class: 'rank' })
    } else {
      headers.push({ text: 'No', sortable: false, class: 'no' })
      headers.push({ text: 'Room name', sortable: false, class: 'has-big-links' })
    }

    if (this.isPlayerDetail()) {
      headers.push({ text: 'Rank', sortable: false })
    } else {
      headers.push({ text: 'Player name', sortable: false, class: 'has-big-links' })
    }

    headers.push({ text: 'Frames', sortable: false })
    headers.push({ text: 'Lag', sortable: false })
    headers.push({ text: 'Idle', sortable: false })
    headers.push({ text: 'Menus', sortable: false })
    headers.push({ text: '', sortable: false, align: 'center', width: 110 })

    return {
      initialHash: null,
      dialogState: {
        rt: null,
        formData: _.clone(emptyRoom)
      },
      headers: headers,
      openRoom: null
    }
  },
  components: {
    EditRoomtimeDialog,
    ImageDialog
  },
  methods: {
    expandRow (props, event) {
      if (event.target.tagName === 'A' || event.target.classList.contains('btn__content')) {
        return
      }

      if (props.item.roomtime.id) {
        props.expanded = !props.expanded
        if (props.expanded) {
          this.$router.replace('#' + props.item.roomtime.segment + '/' + props.item.roomtime.id)
        } else {
          if (this.isRoomDetail()) {
            this.$router.replace('')
          } else {
            this.$router.replace('#' + props.item.roomtime.segment)
          }
        }
      }
    },
    getMediaClasses (room) {
      if (!room.roomtime.id) {
        return
      }

      const classes = ['has-roomtime']
      if (room.roomtime.media.url) {
        classes.push('has-media')
      }

      return classes
    },
    editRoomtime (room) {
      const rt = _.clone(room.roomtime)
      rt.lttphackVersion = rt.lttphack_version

      this.dialogState.rt = rt
      this.dialogState.formData = _.merge({}, emptyRoom, rt, {
        twitchUrl: rt.twitch_url,
        room: room.slug
      })
    },
    addRoomtime (room) {
      this.dialogState.rt = {}
      this.dialogState.formData = _.merge({}, emptyRoom, {
        room: room.slug
      })
    },
    handleSaveRoomtime (rt, payload) {
      this.openRoom = null
      this.$emit('changed')
    },
    handleRemoveRoomtime (rt, payload) {
      this.openRoom = null
      this.$emit('changed')
    },
    canEdit (room) {
      const myUsername = this.$store.state.user ? this.$store.state.user.username : null

      if (room.roomtime && room.roomtime.id) {
        return room.roomtime.player === myUsername
      }

      if (this.isPlayerDetail()) {
        const viewedUsername = this.$store.state.route.params.slug
        return myUsername === viewedUsername
      }
    },
    isRoomList () {
      return this.$router.currentRoute.name === 'room-list'
    },
    isRoomDetail () {
      return this.$router.currentRoute.name === 'room-detail'
    },
    isPlayerDetail () {
      return this.$router.currentRoute.name === 'player-detail'
    },
    isLoggedIn () {
      return this.$store.state.user
    },
    isVideo (room) {
      return room.roomtime.media && (room.roomtime.media.type === 'video' || room.roomtime.media.type === 'twitch')
    },
    isImage (room) {
      return room.roomtime.media && room.roomtime.media.type === 'image'
    }
  },
  computed: {
    currentRoomDetailRoom () {
      if (!this.isRoomDetail()) {
        return
      }

      const slug = this.$store.state.route.params.slug
      return roomsBySlug[slug]
    }
  }
}
</script>

<style scoped>
.rt-description .media >>> img,
.rt-description .media video,
.rt-description .media iframe {
  width: 100%;
}
.rt-description .media {
  max-width: 95%;
  min-width: 300px;
}

.score {
  font-weight: normal;
  font-size: 0.8em;
  color: green;
}

.has-roomtime {
  cursor: pointer;
}

@media screen and (max-width: 750px) {
  #room-table >>> td.no,
  #room-table >>> th.no {
    display: none;
  }
}
</style>
