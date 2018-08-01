import Vue from 'vue'
import moment from 'moment'
import { segmentsBySlug, roomsBySlug } from '@/fixtures'

Vue.filter('bestWorst', (rt) => {
  if (!rt) {
    return 'n/a'
  }

  return segmentsBySlug[rt.segment].name + ': ' + roomsBySlug[rt.room].name
})

Vue.filter('frames', (n) => {
  if (n === null) {
    return ''
  }

  return parseFloat(n).toFixed(2).toString().replace('.', '\'')
})

Vue.filter('roomNameFromSlug', (slug) => {
  return roomsBySlug[slug].name
})

Vue.filter('segmentNameFromSlug', (slug) => {
  return segmentsBySlug[slug].name
})

Vue.filter('segmentShortName', (slug) => {
  const map = {
    escape: 'ESC',
    eastern: 'EAS',
    desert: 'DES',
    hera: 'HER',
    'a-tower': 'AT',
    pod: 'POD',
    thieves: 'TT',
    skull: 'SW',
    ice: 'ICE',
    swamp: 'SWA',
    mire: 'MIR',
    't-rock': 'TR',
    'g-tower': 'GT'
  }
  return map[slug] || slug
})

Vue.filter('timeSince', (s) => {
  const dt = new Date(s)
  return moment(dt).fromNow()
})

Vue.filter('pluralize', (s) => {
  return parseInt(s, 10) === 1 ? '' : 's'
})
