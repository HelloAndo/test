<template>
  <div id="app">
    <!--<router-link :to="{path: '/cascader'}">级联选择器</router-link>
    <router-link :to="{path: '/tagsSelect'}">select2多选</router-link>
    <router-link :to="{path: '/autoComplete'}">select2多选</router-link>-->
    <div id="sortable-list">
      <sortable-list :sortable-data="sortableData"
                      @sort="sort"
                      @clear="clear"></sortable-list>
    </div>
    <!-- <div>
      <date-picker></date-picker>
    </div>

    <div id="cascader">
      <dy-cascader :tree-data="treeData"
                   :default-choice="defaultChoice"
                   @get-result="outputCascaderResult"></dy-cascader>  
      <p>级联选择器,可指定默认值</p>    
    </div>
    <div id="tags-select">
      <tags-select :options="options"
                    @get-options="getOptions"
                    @get-result="outputTagsSelectResutl"></tags-select>  
      <p>select2多选,可随意输入的内容</p>        
    </div>
    <div id="auto-complete">
      <auto-complete :options="list"
                      @get-options="getList"
                      @hit="outputAutoCompleteResult"></auto-complete>
      <p>自动完成/联想输入</p>        
    </div> -->
    <!--<div id="tags-select">
      <router-view></router-view>
    </div>-->

  </div>
</template>

<script>
// import $ from 'jQuery'
// import Hello from './components/Hello'
import tagsSelect from './components/tags-select'
import dyCascader from './components/dy-cascader'
import autoComplete from './components/auto-complete'
import sortableList from './components/sortable-list'
import datePicker from './components/date-picker/index'

export default {
  name: 'app',
  components: {
    tagsSelect,
    dyCascader,
    autoComplete,
    sortableList,
    datePicker
  },
  watch: {
    '$route': {
      handler: function () { 
        console.log('--------')
       }
    }
  },
  mounted () {
    this.addKey(this.sortableData);
  },
  data () {
    return {
      // 可拖拽排序列表数据
      sortableData: [{
        name: '0'
      }, {
        name: '1',
        children: [{
          name: '1-0',
          children: [{
            name: '1-0-0',
            children: [{
              name: '1-0-0-0'
            }, {
              name: '1-0-0-1'
            }]
          }, {
            name: '1-0-1'
          }]
        }]
      }, {
          name: '2',
          children: [{
            name: '2-0'
          }]
        }],
      /*模拟select2和autoComplete的后台数据*/
      dataList: ['abc', 'cba', 'aaa', 'absent', 'banana', 'apple', 'ball', 'Canada', 'chinese', 'love', 'America'],
      /*tags-select数据*/
      options: ['abc', 'cba', 'aaa', 'absent', 'banana', 'apple', 'ball', 'Canada', 'chinese', 'love', 'America'], 
      /*auto-complete数据  */
      list: [],
      /*级联选择器cascader数据*/
			defaultChoice: ['台湾', '垦丁', '美女'],
			// defaultChoice: [],

      treeData: [{
        parent: '广东',
        children: [{
          parent: '广州',
          children: [{
            parent: '天河区',
            children: [{
              parent: '体育西'
            }, {
              parent: '天河南'
            }, {
              parent: '上社'
            }]
          }, {
            parent: '萝岗区',
            children: [{
              parent: '多益'
            }, {
              parent: '顺丰'
            }]
          }]
        }]
      }, {
        parent: '台湾',
        children: [{
          parent: '台北',
          children: [{
            parent: '中正区',
            children: [{
              parent: '芋圆'
            }, {
              parent: '鸡排'
            }]
          }, {
            parent: '中山区',
            children: [{
              parent: '蚵仔煎'
            }]
          }]
        }, {
          parent: '垦丁',
          children: [{
            parent: '阳光'
          }, {
            parent: '沙滩'
          }, {
            parent: '美女'
          }]
        }]
      }, {
        parent: '香港',
        disabled: true,
        children: [{
          parent: '九龙'
        }, {
          parent: '深水埗'
        }]
      }]   
    }
  },
  methods: {
    addKey (data) {
      data.forEach((obj, i) => {
        obj = Object.assign({}, obj, {
          dropType: {
            'drop-coincide': false,
            'drop-up': false,
            'drop-down': false
          }
        });
        data.splice(i, 1, obj);
        obj.children 
        && obj.children.length 
        && this.addKey(obj.children);
      });
    },
    sort (dragNode, dropNode) {
      // debugger
      this.handleDragNode(this.sortableData, dragNode, dropNode);
      this.handleDropNode(this.sortableData, dragNode, dropNode);
      console.log(this.sortableData)
      // debugger
    },
    clear () {
      this.resetStyle(this.sortableData);
    },
    resetStyle (data) {
      data.forEach((node, index) => {
        node = Object.assign({}, node, {
          dropType: {
            'drop-coincide': false,
            'drop-up': false,
            'drop-down': false
          }
        });
        data.splice(index, 1, node);
        node.children && node.children.length
        && this.resetStyle(node.children);
      });
    },
    handleDragNode (data, dragNode, dropNode) {
      var self = this;
      var dragIndex = data.findIndex((el) => 
        dragNode.name === el.name);
      // debugger
      if (dragIndex > -1) {
        data.splice(dragIndex, 1);
      } else {
        data.length && data.forEach((el) => {
          el.children && this.handleDragNode(el.children, dragNode, dropNode);
        });
      }
    },
    handleDropNode (data, dragNode, dropNode) {
      var dropIndex = data.findIndex((el) => dropNode.name === el.name);
// debugger
      if (dropIndex > -1) {
        // debugger
        if (dropNode.dropType['drop-coincide']) {
          // 进入
          data[dropIndex].children
          ? data[dropIndex].children.push(dragNode)
          : data.splice(dropIndex, 1, Object.assign({}, data[dropIndex], {children: [dragNode]}));
        } else if (dropNode.dropType['drop-up']) {
          // 排前
          // dropIndex === 0
          // ? data.unshift(dragNode)
          // : 
          data.splice(dropIndex, 0, dragNode);
          // debugger
        } else if (dropNode.dropType['drop-down']) {
          //排后
          // dropIndex === data.length - 1
          // ? data.push(dragNode)
          // : 
          data.splice(dropIndex + 1, 0, dragNode);
        }

      } else {
        data.length && data.forEach((el) => {
          el.children && this.handleDropNode(el.children, dragNode, dropNode);
        });
      }
    },
    getOptions (val) {
      // if (!val) {
      //   this.options = [];
      //   return;
      // }
      // console.log(val)
      this.options = this.dataList.filter(function (el) {
        return el.indexOf(val) > -1;
      });
      // if (!this.options.length) {
      //   this.options = ['无搜索结果'];
      // }
    },
    getList (val) {
      var self = this;
      // this.list = this.dataList.filter(function (el) {
      //   return el.indexOf(val) > -1;
      // });
      self.list = [];
      setTimeout(function () {
        for (let i=0; i<self.dataList.length; i++) {
          if (self.dataList[i].indexOf(val) > -1) {
            self.list.push(self.dataList[i]);
          }
        }
      }, 400);
    },
    outputAutoCompleteResult (val) {
      console.log('autoComplete组件结果: ', val);
    },
    outputCascaderResult (val) {
      console.log('cascader组件结果: ', val);
    },
    outputTagsSelectResutl (val) {
      console.log('tagsSelect组件结果: ', val);
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
*{margin: 0; padding: 0; box-sizing: border-box;}
ul, li{list-style-type: none; text-align: left;}

#cascader{position: relative; width: 400px; height: 200px; padding: 20px; margin: 0 auto 20px; border: 1px solid #ececec; border-radius: 2px;
  -webkit-transition: box-shadow .6s ease;
  -o-transition: box-shadow .6s ease;
  transition: box-shadow .6s ease;
}
#cascader:hover{box-shadow: 2px 2px 8px rgba(0,0,0,.2);}
#cascader p{position: absolute;left: 0; bottom: 0; right: 0; background-color: #f5f5f5; line-height: 3; border-top: 1px solid #f5f5f5;}

#auto-complete{position: relative; width: 400px; height: 200px; padding: 20px; margin: 0 auto 20px; border: 1px solid #ececec; border-radius: 2px;
  -webkit-transition: box-shadow .6s ease;
  -o-transition: box-shadow .6s ease;
  transition: box-shadow .6s ease;
}
#auto-complete:hover{box-shadow: 2px 2px 8px rgba(0,0,0,.2);}
#auto-complete p{position: absolute;left: 0; bottom: 0; right: 0; background-color: #f5f5f5; line-height: 3; border-top: 1px solid #f5f5f5;}


#tags-select{position: relative; width: 400px; height: 200px; padding: 20px; margin: 0 auto 20px; border: 1px solid #ececec; border-radius: 2px;
  -webkit-transition: box-shadow .6s ease;
  -o-transition: box-shadow .6s ease;
  transition: box-shadow .6s ease;}
#tags-select:hover{box-shadow: 2px 2px 8px rgba(0,0,0,.2);}
#tags-select p{position: absolute;left: 0; bottom: 0; right: 0; background-color: #f5f5f5; line-height: 3; border-top: 1px solid #f5f5f5;}

.demo{display: inline-block; background-color: yellow; cursor: default;}

</style>
