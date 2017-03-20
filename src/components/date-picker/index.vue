<template>
<div>
  <div @click="" class="show-date-picker">展示日历</div>
  <div class="table">
    <div class="tr clearfix">
      <b class="fl" style="cursor: pointer;"
          @click="toPrev">&lt;</b>
      <span class="switch-btn" @click="switchBox">{{heading}}</span>
      <b class="fr" style="cursor: pointer;"
          @click="toNext">&gt;</b>
    </div>
    <component :is="currentBox" :date="date" ref="box"
                @change-date="changeDate"></component>
    <span @click="asyncLoad">异步加载demo</span>
    <component :is="currentAsyncComponent"></component>
  </div>
</div>
</template>
<script>
// import wp from 'webpack'
import Vue from 'vue'
import _ from 'lodash'
var map = {
  10: 'dayBox',
  9: 'monthBox',
  // 8: 'yearBox'
}
export default {
  data () {
    return {
      date: {
        yy: undefined,
        mm: undefined,
      },
      curBoxIdx: 10,
      currentAsyncComponent: ''
      // currentBox: '',
    }
  },
  methods: {
    asyncLoad () {
      this.currentAsyncComponent = 'v-demo'
      Vue.component('v-demo', (resolve, reject) => {
        require(['./demo.vue'], component => {
          resolve(component)
        })
        // require.ensure(["./demo.vue"], function (require) {
        //   resolve(require("./demo.vue"));
        // });
      })

    },
    changeDate (obj, boxIdx) {
      this.date = Object.assign({}, this.date, obj)
      if (!!boxIdx) {
        this.curBoxIdx = boxIdx;
      }
    },
    toPrev () {
      this.$refs.box.toPrev()
    },
    toNext () {
      this.$refs.box.toNext()
    },
    switchBox () {
      map[this.curBoxIdx - 1] && this.curBoxIdx--
    }
  },
  computed: {
    currentBox () {
      return map[this.curBoxIdx];
    },
    heading () {
      let ret;
      switch (this.currentBox) {
        case 'dayBox':
          ret = `${this.date.yy}-${this.date.mm.toString().replace(/^(\d{1})$/, '0$1')}`
          break;
        case 'monthBox':
          ret = `${this.date.yy}`
          break;
        default: break;
      }
      return ret;
    }
  },
  watch: {

  },
  created () {
    this.date.yy = new Date().getFullYear()
    this.date.mm = new Date().getMonth() + 1
    this.curBoxIdx = 10;
    // this.currentBox = map[this.curBoxIdx]
    // this.currentBox = 'monthBox'
  },
  components: {
    dayBox: require('./dayBox'),
    monthBox: require('./monthBox'),
    // yearBox: require('./yearBox')
  }
}
</script>
<style scoped>
.clearfix:before{display: table; clear: both; content: '';}
.table{}
.table .caption{}
.table .tr{width: 250px; margin-left: auto; margin-right: auto;}
.table .td{display: inline-block; width: 32px; min-height: 1px; float: left; text-align: right;}
.table .td.hasWritten{color: #f00;}
.table .box-twelve{float: left; width: 60px; line-height: 3;}
.table .box-twelve:hover{color: #fff; background-color: #5c9ee0; border-radius: 4px;}
.show-date-picker{background-color: yellow; cursor: pointer;} 
.switch-btn:hover{cursor: pointer; color: #fff; background-color: #5c9ee0;
    padding: 1px 8px;
    border-radius: 4px;}
</style>