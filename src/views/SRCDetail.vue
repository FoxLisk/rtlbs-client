<template>
  <div>
    <v-container grid-list-sm>
      <v-layout>
        <v-flex offset-lg1 lg10 offset-md0 md12>
          <v-card height="100%">
            <v-card-title>
              <h2>Speedrun.com Stats</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
              <div id="range-selector">
              </div>
              <highcharts :options="runsOptions"></highcharts>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout ma-3>
        <v-flex offset-lg1 lg5 offset-md0 md6>
          <highcharts :options="barOptions"></highcharts>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import StatsService from '@/services/StatsService'

export default {
  mounted () {
    this.fetch()
  },
  data () {
    return {
      loading: false,
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
          { name: 'Total PBs', data: [], yAxis: 0 },
          { name: 'New PBs', data: [], yAxis: 1 },
          { name: 'New players', data: [], yAxis: 1 }
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
          text: 'First-time milestone (NMG)'
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
        series: []
      }
    }
  },
  methods: {
    fetch: async function () {
      this.loading = true
      const data = (await StatsService.getStats()).data
      this.loading = false

      this.runsOptions.series[0].data = data.total
      this.runsOptions.series[1].data = data.runs
      this.runsOptions.series[2].data = data['new']

      data.pbStats.pbs.forEach(pb => {
        this.barOptions.xAxis.categories.push(pb)
      })

      data.pbStats.data.forEach(stats => {
        const year = stats.shift()
        this.barOptions.series.push({
          name: year,
          data: stats
        })
      })
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
