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
                v-model="runsCategory"
                @change="fetchStats"
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
              v-model="tblStatsActiveTab"
              slot="extension"
            >
              <v-tabs-slider :color="sliderColor"></v-tabs-slider>
              <v-tab v-for="tab in tblStatsTabs" :key="'tab-' + tab.key">
                {{ tab.name }}
              </v-tab>
            </v-tabs>
            <v-data-table
              v-if="tblStatsData"
              :headers="tblStatsHeaders[tblStatsActiveTab]"
              :items="tblStatsData[tblStatsTabs[tblStatsActiveTab].key]"
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
      <v-layout row wrap>
        <v-flex offset-lg1 lg10 offset-md0 md12 v-if="lbsData">
          <v-card>
            <v-card-title>
              Leaderboards
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-layout>
                <v-flex xs6>
                  <v-select
                    :items="categories"
                    :item-text="cat => cat.name + ' (' + cat.type + ')'"
                    item-value="id"
                    v-model="lbsCategory"
                    @change="fetchLeaderboards"
                    label="Category"></v-select>
                </v-flex>
                <v-flex xs6>
                  <v-menu
                    v-model="lbsMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="lbsDate"
                      label="Choose date"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="lbsDate"
                      @input="lbsMenu = false; fetchLeaderboards(lbsCategory)"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-data-table
                :headers="lbsHeaders"
                :items="lbsData"
                hide-actions
                class="lbs"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.index + 1 }}</td>
                  <td>{{ props.item.player }}</td>
                  <td>{{ props.item.time }}</td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
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
    this.fetchStats(this.runsCategory)
    this.fetchLeaderboards(this.lbsCategory)
  },
  data () {
    return {
      // Leaderboards
      lbsHeaders: [
        { text: '#', sortable: false, width: '0%' },
        { text: 'Player', sortable: false },
        { text: 'Time', sortable: false }
      ],
      lbsData: null,
      lbsCategory: '013xwzr1',
      lbsDate: new Date().toISOString().substr(0, 10),
      lbsMenu: false,

      // Table stats
      tblStatsActiveTab: 0,
      tblStatsTabs: [{
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
      tblStatsHeaders: [
        [{ text: 'Player', sortable: false, width: '50%' }, { text: 'Verified runs', sortable: false }],
        [{ text: 'Country', sortable: false, width: '50%' }, { text: 'Verified runs', sortable: false }],
        [{ text: 'Player', sortable: false, width: '50%' }, { text: 'Categories', sortable: false }],
        [{ text: 'Moderator', sortable: false, width: '50%' }, { text: 'Moderated runs', sortable: false }]
      ],
      tblStatsData: null,

      // General
      loading: false,
      categories: [
        { id: 'all', name: 'All', type: 'all' }
      ],

      // Runs
      runsCategory: 'all',
      runsOptions: {
        rangeSelector: {
          buttons: [
            { type: 'month', count: 3, text: '3m' },
            { type: 'year', count: 1, text: '1y' },
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
          text: 'Milestones (NMG)'
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
      this.tblStatsData = data.table
    },
    fetchLeaderboards: async function (category) {
      const date = this.lbsDate
      const data = (await StatsService.getLeaderboards(category, date)).data
      this.lbsData = data.lbs
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

.tablestats .v-table__overflow {
  overflow-y: auto;
  max-height: 352px;
}

.lbs .v-table__overflow {
  overflow-y: auto;
  max-height: 1024px;
}
</style>
