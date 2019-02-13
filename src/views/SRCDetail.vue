<template>
  <div>
    <v-container grid-list-xl>
      <v-layout row wrap>
        <v-flex offset-lg1 lg10 offset-md0 md12>
          <v-card height="100%">
            <v-card-title>
              <h2>Speedrun.com Stats</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
              <v-select
                :items="categories"
                :item-text="cat => cat.name + ' (' + cat.type + ')'"
                item-value="id"
                v-model="category"
                @change="fetchStats"
                id="category-selector"
                label="Category"></v-select>
              <highcharts :options="runsOptions"></highcharts>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex offset-lg1 lg5 offset-sm0 sm12>
          <div class="elevation-1">
            <highcharts :options="barOptions"></highcharts>
          </div>
        </v-flex>
        <v-flex lg5 sm12>
          <div class="elevation-1">
            <v-tabs
              v-model="activeTab"
              slot="extension"
            >
              <v-tabs-slider :color="sliderColor"></v-tabs-slider>
              <v-tab v-for="tab in allTabs" :key="'tab-' + tab.key">
                {{ tab.name }}
              </v-tab>
            </v-tabs>
            <v-data-table
              v-if="tableData"
              :headers="tableHeaders[activeTab]"
              :items="tableData[allTabs[activeTab].key]"
              hide-actions
              class="tablestats"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.key }}</td>
                <td>{{ props.item.value }}</td>
              </template>
            </v-data-table>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import StatsService from '@/services/StatsService'

export default {
  mounted () {
    this.fetchCats()
    this.fetchStats(this.category)
  },
  data () {
    return {
      activeTab: 0,
      allTabs: [{
        key: 'pbs',
        name: 'Players'
      }, {
        key: 'country',
        name: 'Countries'
      }, {
        key: 'categories',
        name: 'Categories'
      }, {
        key: 'moderators',
        name: 'Moderators'
      }],
      tableHeaders: [
        [{ text: 'Player', sortable: false, width: '50%' }, { text: 'Runs', sortable: false }],
        [{ text: 'Country', sortable: false, width: '50%' }, { text: 'Runs', sortable: false }],
        [{ text: 'Player', sortable: false, width: '50%' }, { text: 'Categories', sortable: false }],
        [{ text: 'Moderator', sortable: false, width: '50%' }, { text: 'Moderated runs', sortable: false }]
      ],
      tableData: null,
      loading: false,
      categories: [
        { id: 'all', name: 'All', type: 'all' }
      ],
      category: 'all',
      // Runs
      runsOptions: {
        rangeSelector: {
          buttons: [
            { type: 'month', count: 3, text: '3m' },
            { type: 'month', count: 6, text: '6m' },
            { type: 'year', count: 1, text: '1y' },
            { type: 'year', count: 2, text: '2y' },
            { type: 'year', count: 3, text: '3y' },
            { type: 'year', count: 4, text: '4y' },
            { type: 'all', text: 'All' }
          ],
          enabled: true,
          inputEnabled: false
        },
        chart: {
          type: 'area'
        },
        title: { text: 'Runs' },
        yAxis: [
          { title: { text: 'total' } },
          { title: { text: 'new' }, opposite: true }
        ],
        xAxis: {
          type: 'datetime',
          crosshair: true
        },
        series: [
          { name: 'Total PBs', data: [], yAxis: 0, step: false },
          { name: 'New PBs', data: [], yAxis: 1, step: true },
          { name: 'New players', data: [], yAxis: 1, step: true }
        ],
        credits: false
      },
      // PBs
      barOptions: {
        chart: {
          type: 'column',
          stacked: true
        },
        title: {
          text: 'Milestone (NMG)'
        },
        yAxis: {
          title: {
            text: 'runs'
          },
          min: 0
        },
        xAxis: {
          categories: [],
          crosshair: true
        },
        series: [],
        credits: false
      }
    }
  },
  methods: {
    fetchCats: async function () {
      const cats = (await StatsService.getCategories()).data
      cats.forEach(cat => {
        this.categories.push(cat)
      })
    },
    fetchStats: async function (category) {
      this.loading = true
      const data = (await StatsService.getStats(category)).data
      this.loading = false

      // Runs
      this.runsOptions.series[0].data = data.run.total
      this.runsOptions.series[1].data = data.run.runs
      this.runsOptions.series[2].data = data.run['new']

      // NMG
      this.barOptions.xAxis.categories.splice(0)
      data.nmg.pbs.forEach(pb => {
        this.barOptions.xAxis.categories.push(pb)
      })

      // Milestones
      this.barOptions.series.splice(0)
      data.nmg.data.forEach(stats => {
        const year = stats.shift()
        this.barOptions.series.push({
          name: year,
          data: stats
        })
      })

      // Table
      this.tableData = data.table
    }
  },
  computed: {
    sliderColor () {
      return this.$store.state.darkMode ? 'blue' : 'pink'
    }
  }
}
</script>

<style>
.tablestats thead tr:first-child {
    height: 2.9em !important;
}

.tablestats tbody td {
  height: 2.4em !important;
}
</style>
