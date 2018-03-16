import { parse, stringify } from 'src/util'

export function commitAll ({ commit, state }) {
  const history = state.history[state.inspectedStoreIndex]
  if (history.length > 0) {
    commit('COMMIT_ALL')
    travelTo(state, commit, -1)
  }
}

export function revertAll ({ commit, state }) {
  const history = state.history[state.inspectedStoreIndex]
  if (history.length > 0) {
    commit('REVERT_ALL')
    travelTo(state, commit, -1)
  }
}

export function commit ({ commit, state }, entry) {
  const history = state.history[state.inspectedStoreIndex]
  const index = history.indexOf(entry)
  if (index > -1) {
    commit('COMMIT', index)
    travelTo(state, commit, -1)
  }
}

export function revert ({ commit, state }, entry) {
  const history = state.history[state.inspectedStoreIndex]
  const index = history.indexOf(entry)
  if (index > -1) {
    commit('REVERT', index)
    travelTo(state, commit, state.history[state.inspectedStoreIndex].length - 1)
  }
}

export function inspect ({ commit, state }, entryOrIndex) {
  const history = state.history[state.inspectedStoreIndex]
  let index = typeof entryOrIndex === 'number'
    ? entryOrIndex
    : history.indexOf(entryOrIndex)
  if (index < -1) index = -1
  if (index >= history.length) index = history.length - 1
  commit('INSPECT', index)
}

export function timeTravelTo ({ state, commit }, entry) {
  const history = state.history[state.inspectedStoreIndex]
  travelTo(state, commit, history.indexOf(entry))
}

export function toggleRecording ({ state, commit }) {
  commit('TOGGLE')
  bridge.send('vuex:toggle-recording', state.enabled)
}

export function updateFilter ({ commit }, filter) {
  commit('UPDATE_FILTER', filter)
}

export function changeStore ({ commit }, index) {
  commit('CHANGE_STORE', index)
}

function travelTo (state, commit, index) {
  const { history, base, inspectedIndex, inspectedStoreIndex } = state
  const storeHistory = history[inspectedStoreIndex]
  const targetSnapshot = index > -1 ? storeHistory[index].snapshot : base[inspectedStoreIndex]

  bridge.send('vuex:travel-to-state', {
    storeIndex: inspectedStoreIndex,
    state: stringify(parse(targetSnapshot).state)
  })

  if (index !== inspectedIndex) {
    commit('INSPECT', index)
  }
  commit('TIME_TRAVEL', index)
}
