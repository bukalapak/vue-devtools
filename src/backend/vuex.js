import { stringify, parse } from 'src/util'

export function initVuexBackend (hook, bridge) {
  // const store = hook.store
  const stores = hook.stores

  let recording = true

  const getSnapshot = (store) =>
    stringify({
      state: store.state,
      getters: store.getters || {}
    })

  const getSnapshots = () =>
    stores.map(store => getSnapshot(store))

  const getStoreIndex = (state) => {
    let storeIndex
    stores.forEach((store, idx) => {
      if (stringify(state) === stringify(store.state)) {
        storeIndex = idx
      }
    })
    return storeIndex
  }

  bridge.send('vuex:init', getSnapshots())

  // deal with multiple backend injections
  hook.off('vuex:mutation')

  // application -> devtool
  hook.on('vuex:mutation', (mutation, state) => {
    if (!recording) return

    const storeIndex = getStoreIndex(state)

    bridge.send('vuex:mutation', {
      mutation: {
        type: mutation.type,
        payload: stringify(mutation.payload)
      },
      timestamp: Date.now(),
      snapshot: getSnapshot(stores[storeIndex]),
      storeIndex
    })
  })

  // devtool -> application
  bridge.on('vuex:travel-to-state', state => {
    hook.emit('vuex:travel-to-state', parse(state, true))
  })

  bridge.on('vuex:import-state', state => {
    hook.emit('vuex:travel-to-state', parse(state, true))
    bridge.send('vuex:init', getSnapshot())
  })

  bridge.on('vuex:toggle-recording', enabled => {
    recording = enabled
  })
}

export function getCustomStoreDetails (store) {
  return {
    _custom: {
      type: 'store',
      display: 'Store',
      value: {
        state: store.state,
        getters: store.getters
      },
      fields: {
        abstract: true
      }
    }
  }
}
