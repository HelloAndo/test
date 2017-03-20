<template>
  <ul class="sortable-ul">
    <li v-for="(node, index) in sortableData">
      <span draggable  :class="[node.name, node.dropType]"
        @dragstart="dragstart($event, node, index)"
        @dragend="dragend($event, node, index)"
        @dragenter.stop.prevent="dragenter($event, node, index)"
        @dragover.stop.prevent="dragover($event, node, index)"
        @dragleave.stop.prevent="dragleave($event, node, index)"
        @drop.stop.prevent="drop($event, node, index)">
        {{node.name}}
      </span>
      <sortable-list v-if="node.children && node.children.length"
      :sortable-data="node.children"
      @sort="sort"
      @clear="clear"></sortable-list>
    </li>
  </ul>
</template>
<script>
import $ from 'jquery'
// 递归文件全局变量可以共享？
let dragNode = null;
let dragEl = null;
let isChild = false;
export default {
  name: 'sortable-list',
  props: ['sortableData'],
  data () {
    return {
      dropH: 0
    }
  },
  mounted () {
    
  },
  methods: {
    sort (dragNode, dropNode) {
      this.$emit('sort', dragNode, dropNode);
    },
    clear () {
      this.$emit('clear');
    },
    changeDropEleStyle (node, index, arr) {
      node = Object.assign({}, node, {
        dropType: {
          'drop-up': arr[0],
          'drop-coincide': arr[1],
          'drop-down': arr[2]
        }
      });
      this.sortableData.splice(index, 1, node);
    },
    dragstart (e, node) {
      // 保存当前node对象
      dragNode = node;
      // 保存当前实例
      dragEl = this;
    },
    dragend (e) {

    },
    dragenter (e, node, index) {
      // console.log(dragNode.name)
      // console.log(node.name)
      this.dropH = $(e.currentTarget).outerHeight();
    },
    dragleave (e, node, index) {
      // 检测x轴
      let top = e.clientY - $(e.currentTarget).offset().top;
    },
    dragover (e, node, index) {
      this.$emit('clear');
      if (node.name === dragNode.name) return;
      // console.log(dragNode)
      // debugger
      let top = e.clientY - $(e.currentTarget).offset().top;
      if (top < 1/4 * this.dropH) {
        this.changeDropEleStyle(node, index, [true, false, false]);
      } else if (top > 3/4 * this.dropH) {
        this.changeDropEleStyle(node, index, [false, false, true]);
      } else {
        this.changeDropEleStyle(node, index, [false, true, false]);
      }
    },
    drop (e, node, index) {
      this.checkDrop(node);
    },
    checkDrop (node) {
      if (this.isSelf(node)) {return;}
      this.isChild(node);
      if (isChild) {
        isChild = false;
        return;
       }
      this.$emit('sort', dragNode, node);

    },
    isSelf (node) {
      // 自己叠自己
      return dragNode.name === node.name;
    },
    isChild (node) {
      if (!dragNode.children || !dragNode.children.length) return;
      this.checkIfChild(node, dragNode.children);
    },
    checkIfChild (node, data) {
      let res = data.some((data) => data.name === node.name);
      if (res) {
        isChild = true;
      } else {
        data.forEach((data) => {
          data.children && data.children.length
          && this.checkIfChild(node, data.children);
        });
      }
    }
  }
}
</script>
<style scoped>
.drag-el{background-color: yellow;}
li{padding-top: 1px; padding-bottom: 1px; border-left: 1px dashed #ccc;}
li span{display: block; border-top: 2px solid #eee; border-bottom: 2px solid #eee;}
.drop-coincide{background-color: #f00;}
.drop-up{border-top-color: #0f0;}
.drop-down{border-bottom-color: #00f;}
</style>