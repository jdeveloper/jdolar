Array.prototype.each = function(fun){
  if (typeof fun != "function") throw new TypeError();
  for (var i = 0; i < this.length; i++) {
    if (i in this) fun.call(arguments[1], this[i], i)
  }
  return this;
 };

Array.prototype.map = function(fun){
	var res = Array();
	this.each(function(el){res.push(fun(el));});
	return res;
}
//code taken form http://www.anieto2k.com/2009/01/14/selectores-css-y-frameworks-actuales/
var selector = {
	cache: {},
	cleanCache: function(){
		this.cache = {};
	},
	uniq: function(arr){
		var result = new Array();
		for(var i=0;i<arr.length;i++){
			for(var j=i+1;j<arr.length;j++){
				if(arr[i] == arr[j]){
					j = ++i;
				}
			}
			result.push(arr[i]);
		}
		return result;
	},
	trim: function(string){
		return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},
	get: function(selector, context, cache) {
		var cache = cache || false;
		// Navegadore modernos
		if (document.querySelectorAll) return document.querySelectorAll(selector);

		// Navegadores MUY antiguos
		if (!document.getElementsByTagName) { return new Array();}
		if (cache && this.cache[selector]) return this.cache[selector];

		var tokens = selector.split(' ');
		var context = new Array(context || document);
		for (var i = 0; i < tokens.length; i++) {
			var found = new Array, h = 0;
			token = this.trim(tokens[i]);

			// ID
			if (token.indexOf('#') > -1) {
				var el = this.getID(token);
				context = el?new Array(el):new Array;
				continue;
			}    

			// Class
			if (token.indexOf('.') > -1) {
				while(h<context.length)
						found = found.concat(this.getClass(token, context[h++]));
				context = this.uniq(found);
				continue;
			}

			// Tag
			while(h<context.length)
				found = found.concat(this.toArray(this.getTag(token, context[h++])));
			context = this.uniq(found);
		}
		if (cache) this.cache[selector] = context;
		return context;
	},
	getID: function(token){
		var bits = token.split('#');
		return document.getElementById(bits[1]);
	},
	getClass: function(token, context) {
		var context = context || document;
		var bits = token.split('.');
		var tagName = bits[0]?bits[0]:"*",className = bits[1], result = new Array;
		if (context.getElementsByClassName) {
			var found = this.toArray(context.getElementsByClassName(className));
			if (tagName == "*") return found;
			var regExp = new RegExp(tagName, "i");
			for (var x in found)
				if (regExp.test(found[x].tagName)) result.push(found[x]);
		} else {
			var t = context.getElementsByTagName(tagName);
	    	var oRegExp = new RegExp("(^|\\s)" + className.replace(/\-/g, "\\-") + "(\\s|$)");
			for (var y in t)
				if (oRegExp.test(t[y].className)) result.push(t[y]);
		}
		return result;
	},
	getTag: function(token, context){
 	    return (context || document).getElementsByTagName(token);
	},
	toArray: function(els){
			return Array.prototype.slice.call(els);
	}
}
var jdolar=(function(){
	var methods = {
		find: function(selExpr,context,cache){
			return selector.get(selExpr,context,cache).map(this.extend);
		},
		extend: function(el, opt){
	        var opt = opt || methods;
	      	if (typeof el.get != 'undefined') return el;
	        for (var name in opt) el[name] = opt[name];
	        return el;
	    },
		css: function() {
			if(arguments.length == 0){
				return this.style;
			}else if (arguments.length == 1){
				var a = arguments[0];
				if (typeof a == 'string')
					return this.style[a];
				else {for (var p in a) 
					this.style[p] = a[p];
			}else {
				for(var i = 0, l = arguments.length;i<l;)
					this.style[arguments[i++]] = arguments[i++]
			}
			return this;
		}
	}
	
	return methods;
})();