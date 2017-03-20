<template>
<div class="tr clearfix">
    <span class="box-twelve" v-for="i in 12"
          @click="chooseMonth(i)">{{i | chinesize}}</span>
</div>
</template>
<script>
import Bus from '../Bus.js'
import '../../filters/index.js'
export default {
  props: ['date'],
  methods: {
    chooseMonth (val) {
      // Bus.$emit('changeMonth', val)
      this.$emit('change-date', {mm: val}, 10)
    },
    toPrev () {
      this.$emit('change-date', {yy: --this.date.yy})
    },
    toNext () {
      this.$emit('change-date', {yy: ++this.date.yy})
    }
  },
  // filters: {
  //   chinesize (val) {
  //     let map = {
  //       0: '零',
  //       1: '一',
  //       2: '二',
  //       3: '三',
  //       4: '四',
  //       5: '五',
  //       6: '六',
  //       7: '七',
  //       8: '八',
  //       9: '九',
  //       10: '十',
  //       11: '十一',
  //       12: '十二'
  //     }
  //     return map[val]
  //   }
  // }
}
</script>