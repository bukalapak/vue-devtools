<template lang="html">
  <div>
    Random number: {{ random }}
    <br>
    <button @click="randomize">Randomize</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['random'])
  },
  methods: {
    ...mapActions(['randomize'])
  }
}
</script>
