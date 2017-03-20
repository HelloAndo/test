import Vue from 'vue'
Vue.directive('outerclick', {
  bind (el, binding) {
    function handler (e) {
      if (el.contains(e.target)) {
        return
      }
      if (binding.expression) {
        if (typeof binding.value === 'function') {
          binding.value(e)
        } else {
          console.warn('expression in v-outerclick must be a function')
        }
      }
    }
    el.__outerclick = handler;
    document.addEventListener('click', handler, false)
  },
  unbind () {
    document.removeEventListener('click', el.__outerclick, false)
    delete el.__outerclick
  }
})