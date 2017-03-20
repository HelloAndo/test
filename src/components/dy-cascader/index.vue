<template>
<div class="dy-cascader" v-outerclick="closeCascader">
	<input type="text" readonly autocomplete="off" 
					v-model="cascader"
					@click="showDropdown">
	<span class="remove"
				v-show="choice.length"
				@click="removeChoice">&#10006;</span>
	<transition	name="demo">
	<div class="dropdown"
				v-show="isShowCascader">
		<tree :tree-data="treeData"
					@get-choice="getChoice"></tree>
	</div>
	</transition>
</div>
<!--<p>我是dyCascader</p>-->
</template>
<script>
import $ from 'jquery'
import '../../directives/index.js'
import tree from './tree.vue'
var flag = false;
export default {
	props: {
		treeData: {
			type: Array
		},
		defaultChoice: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	data () {
		return {
			choice: this.defaultChoice,
			count: 0,
			// flag: false,
			isShowCascader: false
		}
	},
	methods: {
		closeCascader () {
			this.isShowCascader = false;
		},
		getChoice (val) {
			flag = true;
			this.getActive(this.treeData, val);
		},
		getActive (data, val) {
			if (flag) {
				this.choice = [];
				flag = false;
			}
			var res = data.find(function (el) {
				return el.active;
			});
			this.choice.push(res.parent);

			res.parent !== val ? this.getActive(res.children, val) : this.$emit('get-result', this.choice);

		},
		showDropdown () {
			this.isShowCascader = true;
		},
		addKey (data) {
			var self = this;
			data.forEach(function (el, i) {
				var bool = el.parent === self.choice[self.count] ? true : false; 
				el = Object.assign({}, el, {'active': bool});
				data.splice(i, 1, el);
				// if (el.children) {
				bool && self.count++;
				el.children && el.children.length && self.addKey(el.children);
				// }
			});

		},
		removeChoice () {
			this.choice = [];
			this.resetList(this.treeData);
			this.$emit('get-result', []);
		},
		resetList (data) {
			var self = this;
			data.forEach(function (el) {
				el.active = false;
				el.children && el.children.length && self.resetList(el.children);
			});
		}
	},
	mounted () {
		var self = this;

		self.addKey(self.treeData);

		// $('html, body').click(function(e) {
		// 	self.isShowCascader = false;
		// });
	},
	computed: {
		cascader: {
			get: function () {
				return this.choice.join('/');
			}
		}
	},
	components: {
		tree
	}
}
</script>
<style scoped>
.dy-cascader{position: relative; width: 100%;}
.remove{/* display: none; */ position: absolute;right: 7px; top: 7px; font-size: 12px; background-color: #e7e7e7; color: #7e7e7e; padding: 3px 6px;  border-radius: 50%; cursor: pointer;
	visibility: hidden;
	opacity: 0;
	transition: all .5s cubic-bezier(0.28, -0.04, 0.42, 1.5);
}
.dy-cascader:hover .remove{ visibility: visible; opacity: 1;}
.demo-enter-active, .demo-leave-active {
  transition: all .4s ease;
  transform: translateY(0);
  opacity: 1;
}
.demo-enter, .demo-leave-active {
  transform: translateY(-10px);
  opacity: 0;
}
</style>