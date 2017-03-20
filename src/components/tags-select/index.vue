<template>
<!-- <div class="autoC"
			@keyup.up="upIndex"
			@keyup.down="downIndex"
			@keyup.enter="mychoice">
	<input type="text" placeholder="请输入"
					v-model="key"
					@input="getOptions($event)">
	<transition	name="demo">
		<ul class="searchRes"
				v-show="options.length && isShowOptions">
			<li v-for="(option, index) in options"
					:class="{'hover': index === nowIndex}"
					@click.stop="mychoice($event, index)">{{option}}
				<i class="chooseFlag">√</i>
			</li>
		</ul>
	</transition>
</div> -->
<div class="chosen-box"
			v-outerclick="closeOpts"
			@click="init"
			@keydown.delete="delFlag($event)"
			@keyup="keyupHandle($event)">
	<div class="wrapper">
		<div class="chosen">
		  <transition-group tag="span"
			    enter-active-class="animated zoomIn"
			    leave-active-class="animated zoomOut">
				<span class="li" 
						v-for="(item, index) in mychosen" 
						:key="item">
					{{item}}
					<i class="remove"
							@click="removeChoice(index)">&#10006;</i>
				</span>
			</transition-group>
			<span>
				<input type="text" class="ipt"
								v-model="myinput"
								:style="{width: iptWidth}">		
			</span>
		</div>
	</div>
	<transition	name="demo">
		<ul class="searchRes"
				v-show="pickedList.length && isShowOptions">
			<li v-for="(option, index) in pickedList"
					:class="{'hover': index === nowIndex, selected: isSelected(index)}"
					@click.stop="mychoice($event, index)">{{option}}
				<i class="chooseFlag" ></i>
			</li>
		</ul>
	</transition>
</div>
<!--<p>我是tagsSelect</p>-->
</template>
<script>
import $ from 'jquery'
var fontSetting;
export default {
	props: {
		options: {
			type: Array
		},

	},
	data () {
		return {
			// key: '',
			nowIndex: 0,
			isShowOptions: false,
			myinput: '',
			iptWidth: '14px',
			isInputBreak: true,
			mychosen: [],
			isToDel: false
		}
	},
	computed: {
		pickedList: {
			get: function () {
				var self = this;
				var arr = [];
				self.options.forEach(function (el, i) {
					arr.push(el);
				});
				// if (this.isInputBreak) {
					!!this.myinput && arr.indexOf(this.myinput) === -1 && arr.unshift(this.myinput);
					this.isInputBreak = false;
				// }
				return arr;
			}
		},
	},
	watch: {
		myinput: {
			handler: function () {
				this.iptWidth = this.getIptWordsWidth(this.myinput, fontSetting) + 'px';
			}
		},
		mychosen: {
			handler: function () {
				this.$emit('get-result', this.mychosen);
			}
		}
	},
	methods: {
		closeOpts () {
			this.isShowOptions = false;
		},
		init () {
			$('.ipt').focus();
			this.isShowOptions = true;
			this.isInputBreak = true;
		},
		getOptions (e) {
			var $target = $(e.target || e.srcElement);
			if (!$.trim($target)) {
				this.myinput = '';
				return;
			}
			this.$emit('get-options', this.myinput);
			this.nowIndex = 0;
			
		},
		isSelected (index) {
			return this.mychosen.indexOf(this.pickedList[index]) > -1 ? true : false;
		},
		keyupHandle (e) {
			// console.log(e.which)
			switch (e.which) {
				case 32:           /*space*/
					if (!$.trim(this.myinput)) {
						this.myinput = '';
					}
					break;
				case 13:          /*enter*/
					this.mychoice();
					break;
				case 38: 					/*up*/
					this.upIndex();
					break;
				case 40: 					/*down*/
					this.downIndex();
					break;
				case 8: 					/*backSpace*/
					!this.myinput && this.isToDel && this.mychosen.pop();
					this.isToDel = false;
				default: 
					this.getOptions(e);
					break;
			}
			
		},
		upIndex () {
			this.nowIndex = this.nowIndex <= 0 ? this.pickedList.length - 1 : this.nowIndex - 1;
		},
		downIndex () {
			this.nowIndex = this.nowIndex >= this.pickedList.length - 1 ? 0 : this.nowIndex + 1;
		},
		mychoice (e, index) {
			var index = arguments.length > 1 ? index : this.nowIndex;

			var i = this.mychosen.indexOf(this.pickedList[index]);
			i === -1 ? this.mychosen.push(this.pickedList[index]) :this.mychosen.splice(i, 1);

			// this.$emit('get-result', this.mychosen);
			// if (arguments.length < 2) {
				if (!!this.myinput) {
					this.myinput = '';
					this.pickedList.shift();
				}
			// }
			$('.ipt').focus();
			this.$emit('get-options', '');
		},
		// 点击label删除已选选项
		removeChoice (index) {
			this.mychosen.splice(index, 1);
		},
		//删除输入字符/已选选项的检测函数
		delFlag (e) {
			// if (this.myinput.split('').length < 1) {
			this.isToDel = this.myinput.split('').length < 1 ? true : false;
			// }
		},
		/*获取输入文字的总宽度*/
		getIptWordsWidth (text, font) {
	    var $ele = $('<span>').hide().appendTo($('body')).addClass('font');
	    // var $ele = $('<pre>').hide().appendTo($('body'));
			// font属性包括字体大小及其他,必须整体设置font才能获取到精确的宽度
	    $ele.html(text).css('font', font);
	    var width = $ele.width();
	    $ele.remove();
	    return width;
    }
	},
	mounted () {
		var self = this;
		fontSetting = $(self.$el).find('.ipt').css('font');
		// console.log(fontSetting);
		// document.addEventListener("click", function(){
		//   self.isShowOptions = false;
		//   self.isInputBreak = false;
		//   self.myinput = '';
		// });
	}
}
</script>

<style >
/*pre{box-sizing: border-box; padding-left: 6px;}*/
span.font{box-sizing: border-box; padding: 0; display: inline-block;}
.chosen-box{position: relative; width: 100%; min-height: 34px; border: 1px solid #d9d9d9; border-radius: 4px;cursor: text; word-break: break-all;}
.wrapper:after{clear: both; content: ' '; display: table;}
.chosen{display: inline-block; float: left; margin-left: 4px;}
/*.chosen:after{clear: both; display: table-cell; content: ' ';}*/
.chosen .li{float: left; position: relative; font-size: 14px; color: #fff; padding: 4px 18px 4px 6px; margin: 4px 4px 4px 0; background-color: #41cac0; border-radius: 4px; box-shadow: 2px 2px 1px rgba(0,0,0,.1)}
.chosen .remove{position: absolute; right: 5px; top: 5px; cursor: pointer; transition: color .4s ease;}
.chosen .remove:hover{color: #000; }

.ipt{float: left; min-width: 1em; max-width: 100%; padding: 0; border: none; outline: none; box-shadow: none; }
.ipt:focus{ border: none; outline: none; box-shadow: none;}

.autoC{display: inline-block; width: 160px; position: relative;}
.autoC input{width: 160px;}
.searchRes{position: absolute; z-index: 99; left: 0; right: 0; border: 1px solid #dfdfdf; border-radius: 4px; box-shadow: 0 0 4px rgba(0,0,0,.1); background-color: #fff;}
.searchRes li{    
	display: block;
  padding: 5px 20px;
  clear: both;
  font-weight: normal;
  line-height: 1.42857143;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s ease;
 }
.chooseFlag{float: right; color: #dedede; display: none;}
.chooseFlag:after{content: '\2714';}
.searchRes li.selected:hover .chooseFlag:after{content: '\2716';}
.searchRes li.selected.hover .chooseFlag:after{content: '\2716';}
/*.chooseFlag.chosen{color: #41cac0;}*/
.searchRes li:hover, .searchRes li.hover{color: #fff; background-color: #41cac0;}
.searchRes li:hover .chooseFlag, .searchRes li.hover .chooseFlag{display: inline-block; color: #fff;}
.searchRes li.selected{color: #000; background-color: #f3f3f3;}
.searchRes li.selected .chooseFlag{display: inline-block; color: #000;}
/*.searchRes li.selected:hover .chooseFlag{display: inline-block; color: #41cac0;}*/
/*.searchRes li:after{content: "\E632"; }*/
/*.demo-enter{height: 0;opacity: 0;}
.demo-active-enter{height: auto; opacity: 1;}
.demo-leave{height: auto; opacity: 1;}
.demo-leave-active{height: 0; opacity: 0;}*/
/*.demo{transition: all 0.8s ease;}*/
.demo-enter-active, .demo-leave-active {
  transition: all .4s ease;
  transform: translateY(0);
  opacity: 1;
}
/*.demo-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transition: all .8s ease;
  height: auto;
  opacity: 1;
}*/
.demo-enter, .demo-leave-active {
  transform: translateY(-10px);
  opacity: 0;
}
</style>