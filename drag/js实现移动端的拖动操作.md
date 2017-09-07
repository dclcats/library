
## js实现拖动操作

[demo][1] （请在移动端打开或者模拟移动端打开）

手机请扫

![drag demo 地址二维码][2]

注意： 某些安卓机型不能很好的支持 `forEach` , 所以考虑兼容性尽量不要使用 `forEach` 可以使用 `for` 循环代替
已知不支持 `forEach` 的机型及浏览器： 华为 H30 默认浏览器及该机型下的UC浏览器

### 初始化

就像盖房子需要打地基一样，写程序实现一个功能需要初始化。

初始化主要是对传入参数处理，然后做一些基本定义。在这里实现的拖动操作， 以将页面元素拖入垃圾箱为背景来进行一系列的操作。

首先， 我们需要定义可操作的元素，即需要被拖动的元素。接下来就是对可操作元素进行操作，这里需要绑定事件，也就是touch事件，包括 `touchstart/touchmove/touchend`。在对应的事件内进行相应的操作，从而完成拖动

### 事件绑定

初始化之后，我们就需要对可操作元素进行事件的绑定，
先上代码，以下分别是对应touch事件以及对应的操作

```stylus?linenums
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
```

注：以上代码是基于将元素拖入垃圾箱的相应事件函数，可根据自己项目情况进行调整，这里提供思路。

有了事件监听，探知了我们手指触摸、移动、抬起等，我们要将对应的操作实现到页面内的元素，便需要一个移动元素的操作，便是上边的 `setMove` 函数（以下方法使用前确定你的浏览器支持）

```stylus?linenums
Drag.prototype.setMove = function(e, type) {
	var x = this.moveX || 0,
		y = this.moveY || 0；
	if(type === 'reset') {
		e.style.cssText = '';
		return;
	}
	e.style.cssText += 'position: absolute;-webkit-transform: translate('+x+'px,'+y+'px);';
}
```

没错就是简单粗暴的调整 `css` 来实现移动元素

当然再加上验证元素是否越界（这个界限根据自己情况指定，可以在自己设定的一个盒模型内，也可以是整个屏幕，根据自己情况而定，这里不贴代码）

因为我这里有个垃圾桶，所以需要判断拖动元素是否落入垃圾桶，然后进行后续操作

```stylus?linenums
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
		//落在目标区域外的情况
		this.tarEle.style.cssText = "opacity: .5;"
		if(type === 'end'){
			this.resetFun(e);
		}
	}
}
```

致此整个移动过程都已实现

此处只是指出思路，具体执行过程根据自己的项目情况进行相应的调整

  [1]: https://dclcats.github.io/library/examples/index.html
  [2]: images/1502175937.png "drag demo 地址二维码"