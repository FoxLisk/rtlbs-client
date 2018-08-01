<template>
  <v-text-field
    :label="label"
    :autofocus="autofocus"
    :required="required"
    :name="name"
    placeholder="0'00"
    v-model="frames"
    @blur="active = false"
    @focus="active = true"
  />
</template>

<script>
function fromDecimal (value) {
  let floatValue = parseFloat((value || '').toString().replace(/[^\d.]/, '')).toFixed(2)
  let [secs, frames] = floatValue.split('.')

  let newValue
  if (secs === '' || isNaN(secs)) {
    newValue = ''
  } else if (frames === undefined) {
    newValue = secs + '\'00'
  } else {
    if (parseInt(frames) > 60) {
      frames = '59'
    }
    newValue = secs + '\'' + frames
  }
  return newValue
}

function fromFrames (value) {
  let floatValue = parseFloat((value || '').toString().replace('\'', '.').replace(/[^\d.]/, '')).toFixed(2)
  let [secs, frames] = floatValue.split('.')

  let newValue
  if (secs === '' || isNaN(secs)) {
    newValue = ''
  } else if (frames === undefined) {
    newValue = parseFloat(secs)
  } else {
    if (parseInt(frames) > 60) {
      frames = '59'
    }
    newValue = parseFloat(secs + '.' + frames)
  }
  return newValue
}

export default {
  props: ['value', 'label', 'autofocus', 'required', 'name'],
  data () {
    return {
      active: false
    }
  },
  computed: {
    frames: {
      get () {
        if (this.active) {
          return this.value.toString().replace('.', '\'')
        }
        return fromDecimal(this.value)
      },
      set (modifiedValue) {
        this.$emit('input', modifiedValue)
      }
    }
  },
  watch: {
    active (isActive) {
      if (!isActive) {
        this.$emit('input', fromFrames(this.value))
      } else {
        this.$emit('input', fromDecimal(this.value))
      }
    }
  }
}
</script>

<style scoped>
</style>
