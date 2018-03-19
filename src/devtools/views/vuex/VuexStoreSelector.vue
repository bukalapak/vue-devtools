<template lang="html">
  <div class="container">
    <span class="label">Store: </span>
    <select class="selector" v-model="selected">
      <option :value="$idx - 1" v-for="$idx in storeCount">Store {{ $idx }}</option>
    </select>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('vuex', [
      'storeCount'
    ]),
    selected: {
      get() {
        return this.$store.state.vuex.inspectedStoreIndex
      },
      set(index) {
        this.$store.dispatch('vuex/changeStore', index)
      }
    }
  },
  methods: {
    ...mapActions('vuex', [
      'changeStore'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.container
  height: 50px
  padding: 15px
  border-bottom: 1px solid #ddd

.label
  display: inline-block
  color: #999
  font-weight: 100
  margin-right: 8px
  font-size: 12px
</style>
