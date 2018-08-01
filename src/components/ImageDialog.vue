<template>
  <div class="image-container" data-index="0">
    <img :src="src" @click="open($event)" />
  </div>
</template>

<script>
import fancyBox from 'vue-fancybox'

export default {
  props: {
    src: String
  },
  data () {
    return {
      imageList: [
        { width: 900, height: 675, url: this.src }
      ]
    }
  },
  methods: {
    open (e) {
      fancyBox(e.target, this.imageList)
    }
  }
}
</script>

<style scoped>
.image-container img {
  cursor: pointer;
}
.image-container img:hover {
  opacity: 0.98;
}
</style>
