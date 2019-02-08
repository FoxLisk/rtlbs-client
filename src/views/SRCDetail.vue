<template>
  <div>
    <v-container grid-list-sm>
      <v-layout>
        <v-flex offset-lg3 lg6 offset-sm1 sm10 offset-md2 md8 offset-xs0 xs12>
          <v-card height="100%">
            <v-card-title>
              <h2>Speedrun.com Stats</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
              <highcharts :options="options"></highcharts>
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
    this.fetch()
  },
  data () {
    return {
      loading: false,
      options: {
        rangeSelector: {
          buttons: [{
            type: 'month',
            count: 3,
            text: '3m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'year',
            count: 2,
            text: '2y'
          }, {
            type: 'year',
            count: 3,
            text: '3y'
          }, {
            type: 'year',
            count: 4,
            text: '4y'
          }, {
            type: 'all',
            text: 'All'
          }],
          enabled: true,
          inputEnabled: false
        },
        chart: {
          type: 'area'
        },
        title: {
          text: ''
        },
        yAxis: [{
          title: {
            text: ''
          }
        }, {
          title: {
            text: '',
            opposite: true
          }
        }],
        xAxis: {
          type: 'datetime',
          crosshair: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Total PBs',
          data: [],
          yAxis: 0
        }, {
          name: 'New PBs',
          data: [],
          yAxis: 1
        }, {
          name: 'New players',
          data: [],
          yAxis: 1
        }],
        credits: false
      }
    }
  },
  methods: {
    fetch: async function () {
      this.loading = true
      const data = (await StatsService.getStats()).data
      this.loading = false

      this.options.series[0].data = data.total
      this.options.series[1].data = data.runs
      this.options.series[2].data = data['new']
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
