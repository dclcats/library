
/* 参数情况
dragEle：需要拖动的元素（可以为元素本身，也可以为需拖动元素（组）的选择器 "#drag" or ".drag"， 可以是一组的元素）
tarEle：目标位置元素
posArr：定位数组（需要将元素拖至的固定区域,顺序为top,left,width,height）注：tarEle与posArr设置一个即可，两个同时设置则以tarEle为主
onStart：拖动开始时执行函数，参数为即将拖动的元素
onMove：拖动时执行函数，参数为拖动的元素
onMoveIn：拖动过程中拖动元素到达目标位置执行函数，目标位置元素（如果目标位置为一个元素时）
onEnd：拖动结束时拖动元素到达目标位置执行函数，参数为被拖动的元素 */

(function(win, doc){

	var ua = navigator.userAgent,
		eventArr = ['touchstart', 'touchmove', 'touchend'];
	

	function Drag(opts) {
		this.opts = opts || {};
		this.opts.onStart = this.opts.onStart || function(e) {};
		this.opts.onMove = this.opts.onMove || function(e) {};
		this.opts.onMoveIn = this.opts.onMoveIn || function(e) {};
		this.opts.onEnd = this.opts.onEnd || function(e) {};
		
		this.init();
	}

	Drag.prototype = {
		$: function(e) {
			return doc.querySelectorAll(e);
			//选择器使用选择所有匹配元素
		}
	}

	Drag.prototype.init = function () {
		
		//需拖动的元素
		this.dragEle = typeof this.opts.dragEle === "string" ? this.$(this.opts.dragEle) : this.opts.dragEle;
		var len = this.dragEle.length
		if(!!len) {
			for (var i = len - 1; i >= 0; i--) {
				this.addEvent(this.dragEle[i])
			}
			// this.dragEle.forEach(function(v,i) {
			// 	alert('listener')
			// 	this.addEvent(v);
			// }, this);
		} else {
			this.addEvent(this.dragEle);
		}
		if(!!this.opts.tarEle) {
			//目标位置的元素
			this.tarEle = typeof this.opts.tarEle === 'string' ? this.$(this.opts.tarEle)[0] : this.opts.tarEle;
			this.tarT = this.tarEle.offsetTop;
			this.tarL = this.tarEle.offsetLeft;
			this.tarW = this.tarEle.offsetWidth || this.tarEle.clientWidth;
			this.tarH = this.tarEle.offsetHeight || this.tarEle.clientHeight;
		} else {
			this.tarT = this.opts.posArr[0];
			this.tarL = this.opts.posArr[1];
			this.tarW = this.opts.posArr[2];
			this.tarH = this.opts.posArr[3];
		}
	}

	Drag.prototype.addEvent = function(e) {
		for (var i = eventArr.length - 1; i >= 0; i--) {
			e.addEventListener(eventArr[i], this[eventArr[i]].bind(this), false);
		}
		// eventArr.forEach(function(v, i) {
		// 	e.addEventListener(v, this[v].bind(this), false);
		// }, this);
	}

	Drag.prototype.touchstart = function(e) {
		e.preventDefault();
		e.stopPropagation();
		var tar = e.target;
		//执行定义在拖动开始时须执行的函数， 参数为即将拖动的元素
		this.opts.onStart(tar);
		//初始化拖动元素的位置信息；
		this.dragT = tar.offsetTop;
		this.dragL = tar.offsetLeft;
		this.dragW = tar.offsetWidth || tar.clientWidth;
		this.dragH = tar.offsetHeight || tar.clientHeight;
		//定义开始移动位置
		this.startX = e.pageX || e.touches[0].pageX;
		this.startY = e.pageY || e.touches[0].pageY;
		//重置移动参数
		this.moveX = this.moveY = 0;
	}

	Drag.prototype.touchmove = function(e) {
		var tar = e.target;
		this.opts.onMove(tar);
		this.nowX = e.pageX || e.touches[0].pageX;
		this.nowY = e.pageY || e.touches[0].pageY;

		//计算目标元素需移动的距离
		this.moveX = this.nowX - this.startX;
		this.moveY = this.nowY - this.startY;

		//检测是否越界，并调整
		this.checkOver(this.moveX, this.moveY);
		
		//进行拖动元素移动操作
		this.setMove(tar);

		//检测是否落入目标位置
		this.checkPos('move', tar);

	}

	Drag.prototype.touchend = function(e) {
		
		//目标区域的视觉变化
		this.tarEle.style.cssText = "opacity: .5;"
		//检测最终位置
		this.checkPos('end', e.target);
	}

	Drag.prototype.setMove = function(e, type) {
		var x = this.moveX || 0,
			y = this.moveY || 0;
		if(type === 'reset') {
			e.style.cssText = '';
			return;
		}
		e.style.cssText += 'position: absolute;-webkit-transform: translate('+x+'px,'+y+'px);-moz-transform: translate('+x+'px,'+y+'px);-o-transform: translate('+x+'px,'+y+'px);-ms-transform: translate('+x+'px,'+y+'px);';
	}

	Drag.prototype.checkOver = function(moveX, moveY) {
		//检测元素是否越界
		var aW = doc.body.clientWidth || window.screen.width,
			aH = doc.body.clientHeight || window.screen.height,
			x = this.dragL + moveX,
			y = this.dragT + moveY,
			w = this.dragL + this.dragW + moveX,
			h = this.dragT + this.dragH + moveY;
		if(x < 0) {
			this.moveX = - this.dragL;
		} else if(w > aW) {
			this.moveX = aW - this.dragL - this.dragW;
		}
		if(y < 0) {
			this.moveY = - this.dragT;
		} else if(h > aH) {
			this.moveY = aH - this.dragT - this.dragH;
		}
	}

	Drag.prototype.checkPos = function(type, e) {

		//判断拖动元素是否到达目标位置，判断方式更具情况而定，此处判断的依据是：touch事件位置判断，即结束时touch的位置是否在目标区域位置
		if(this.nowX > this.tarL && this.nowX < this.tarL + this.tarW &&  this.nowY > this.tarT && this.nowY < this.tarT + this.tarH) {
			//进入目标区域
			if(type === 'move' && !!this.opts.tarEle) {
				//在移动过程中，进入目标区域
				this.opts.onMoveIn(this.tarEle);
			} else {
				//在拖动结束时进入目标区域
				this.opts.onEnd(e);
			}
		} else {
			this.tarEle.style.cssText = "opacity: .5;"
			if(type === 'end'){
				this.resetFun(e);
			}
		}
	}

	Drag.prototype.resetFun = function(e) {
		this.moveX = this.moveY = 0;
		this.startX = this.startY = 0;
		this.nowY = this.top;
		this.nowX = this.left;
		e.innerHTML = "drag" + e.dataset.num;
		this.setMove(e, 'reset');
	}

	win.Drag = Drag;
})(window, document);