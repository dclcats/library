var HtmlUtil = {
	// 1.用浏览器内部转换器实现html编码
	htmlEncode: function(html) {
		// 创建一个元素容器
		var tempDiv = document.createElement('div');
		// 把需要编码的字符串赋值给该元素的innerText(ie支持)或者textContent(火狐、谷歌等) 
		(tempDiv.textContent != undefined) ? (tempDiv.textContent = html) : (tempDiv.innerText = html);
		var output = tempDiv.innerHTML;
		tempDiv = null;
		return output;
	},
	
	// 2.用浏览器内部转换器实现html解码
	htmlDecode: function(text) {
		// 创建一个元素容器
		var tempDiv = document.createElement('div');
		// 把解码字符串赋值给元素innerHTML
		tempDiv.innerHTML = text;
		// 最后返回这个元素的innerText(ie支持)或者textContent(火狐、谷歌等支持)
		var output = tempDiv.innerText || tempDiv.textContent;
		tempDiv = null;
		return output;
	},
	// 3.使用正则实现html编码
	htmlEncodeByRegExp: function(str) {
		var s = '';
		if(str.length === 0) {
			return '';
		}
		s = str.replace(/&/g,'&amp;');
		s = s.replace(/</g,'&lt;');
		s = s.replace(/>/g,'&gt;');
		s = s.replace(/ /g,'&nbsp;');
		s = s.replace(/\'/g,'&#39;');
		s= s.replace(/\"/g,'&quot;');
		return s;
	},
	
	// 4.使用正则实现html解码
	htmlDecodeByRegExp: function(str) {
		var s = '';
		if(str.length === 0) {
			return '';
		}
		s = str.replace(/&amp;/g, '&');
		s = s.replace(/&lt;/g,'<');
		s = s.replace(/&gt;/g,'>');
		s = s.replace(/&nbsp;/g,' ');
		s = s.replace(/&#39;/g,'\'');
		s = s.replace(/&quot;/g,'\"');
		return s;
	}
}
