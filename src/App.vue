<template>
  <v-app :dark="$store.state.darkMode">
    <page-header />
    <main>
      <router-view/>
    </main>
    <dark-mode />
  </v-app>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import DarkMode from '@/components/DarkMode.vue'

export default {
  name: 'app',
  components: {
    PageHeader,
    DarkMode
  }
}
</script>

<style>
html {
  overflow-x: auto;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 64px;
}

h1 {
  font-size: 24px;
  font-weight: normal;
  display: inline;
}

h2 {
  font-size: 22px;
}

h3 {
  font-size: 20px;
}

h3 {
  font-size: 18px;
}

.vue2-reset {
  text-align: left;
  font-size: 16px;
}

.vue2-reset,
.vue2-reset * {
  box-sizing: border-box;
}

.vue2-reset blockquote,
.vue2-reset h1,
.vue2-reset h2,
.vue2-reset h3,
.vue2-reset h4,
.vue2-reset h5,
.vue2-reset h6,
.vue2-reset ol,
.vue2-reset p,
.vue2-reset pre,
.vue2-reset ul {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}

.vue2-reset ul,
.vue2-reset ol {
  margin-left: 18px;
}

a.big-link {
  text-decoration: none;
  display: inline-block;
  padding: 8px 14px;
}

a.big-link:hover {
  text-decoration: underline;
  background: rgba(50, 50, 127, 0.08);
}

.datatable th.has-big-links {
  padding-left: 38px !important;
}

@media screen and (max-width: 750px) {
  .datatable th.has-big-links {
    padding-left: 26px !important;
  }
  a.big-link {
    padding: 4px 4px;
  }
}

.input-group--required label:after {
  color: red;
  content: ' *';
}

.quillWrapper {
  background-color: white;
  color: black;
}

</style>
