<template>
  <v-data-table
    :headers="headers"
    :items="players || []"
    :loading="!isLoaded"
    id="leader-boards"
    class="elevation-4"
    hide-actions
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">#{{ props.item.rank }}</td>
      <td class="text-xs-left">
        <router-link :to="{ 'name': 'player-detail', params: { slug: props.item.username } }" class="big-link">
          {{ props.item.username }}
        </router-link>
      </td>
      <td class="text-xs-left">{{ props.item.num_roomtimes }}</td>
      <td class="text-xs-left">{{ props.item.score }}</td>
      <td class="text-xs-left">{{ props.item.avg_score }}</td>
      <td class="text-xs-left best-worst">
        <router-link
          class="big-link"
          v-if="props.item.best_room"
          :to="{ 'name': 'room-detail', params: { slug: props.item.best_room.room } }"
        >
          {{ props.item.best_room | bestWorst }}
        </router-link>
      </td>
      <td class="text-xs-left best-worst">
        <router-link
          class="big-link"
          v-if="props.item.worst_room"
          :to="{ 'name': 'room-detail', params: { slug: props.item.worst_room.room } }"
        >
          {{ props.item.worst_room | bestWorst }}
        </router-link>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['players'],
  data () {
    return {
      headers: [
        { text: 'Rank', value: 'rank' },
        { text: 'Player', value: 'name', sortable: false, class: 'has-big-links' },
        { text: 'Rooms', value: 'num_rooms', sortable: false },
        { text: 'Score', value: 'score', sortable: false },
        { text: 'Average score', value: 'avg_score', sortable: false },
        { text: 'Best room', value: 'best_room', sortable: false, class: 'best-worst has-big-links' },
        { text: 'Worst room', value: 'worst_room', sortable: false, class: 'best-worst has-big-links' }
      ]
    }
  },
  computed: {
    isLoaded () {
      return this.players.length > 0
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 870px) {
  #leader-boards >>> .best-worst {
    display: none;
  }
}
</style>
