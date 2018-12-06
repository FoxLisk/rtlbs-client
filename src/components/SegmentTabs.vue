<template>
  <div>
    <v-tabs
      v-model="activeTab"
      slot="extension"
      grow
      @change="handleChangeTab"
    >
      <v-tabs-slider :color="sliderColor"></v-tabs-slider>
      <v-tab v-for="segment in allSegments" :key="segment.slug">
        <span class="hidden-md-and-down">
          {{ segment.name }}
        </span>
        <span class="hidden-lg-and-up">
          {{ segment.slug | segmentShortName }}
        </span>
      </v-tab>
    </v-tabs>
    <room-table
      @changed="handleChanged"
      :rooms="activeRooms"
    />
  </div>
</template>

<script>
import RoomTable from '@/components/RoomTable'
import { segments, segmentsBySlug } from '@/fixtures'
const _ = require('lodash')

export default {
  props: ['roomsBySegment'],
  data () {
    let activeTab = null
    if (window.location.hash) {
      const openSegment = window.location.hash.slice(1).split('/')[0]

      if (segmentsBySlug[openSegment]) {
        activeTab = _.findIndex(segments, { slug: openSegment }).toString()
      }
    }
    return {
      activeTab: activeTab,
      allSegments: segments
    }
  },
  components: {
    RoomTable
  },
  methods: {
    handleChanged () {
      this.$emit('changed')
    },
    handleChangeTab (idx) {
      this.$router.replace('#' + segments[idx].slug)
    }
  },
  computed: {
    currentSegment () {
      return segments[this.activeTab]
    },
    activeRooms () {
      if (!this.currentSegment || !this.roomsBySegment) {
        return null
      }

      return this.roomsBySegment[this.currentSegment.slug]
    },
    sliderColor () {
      return this.$store.state.darkMode ? 'blue' : 'pink'
    }
  }
}
</script>

<style scoped>
</style>
