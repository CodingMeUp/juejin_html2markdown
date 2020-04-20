[

](/post/5d635566e51d4561e224a360)

[](/post/5d635566e51d4561e224a360)

2019年08月26日阅读 33136

关于JS中一些重要的api实现, 巩固你的原生JS功底
===========================

在面试中，常常会遇到一些手写XXX之类的面试题，因此好好总结一下，对于巩固我们的原生js的基础是非常必要的。

尽管在网上已经有了非常多的总结文章，但在我看来有一个普遍的问题，那就是把原理性的东西过于复杂化了。如果站在面试官的角度，他的目的是在最短的时间内考察出面试者对于JS语言的理解程度，但是在看了网站的诸多总结文章后我发现其中的代码有很大一部分是做意义不大的操作，比如实现一个简单的防抖，只要是核心的流程展示即可，至于其他的一些等模式则没有必要再去深挖，一大堆的if-else让人看上去也眼花缭乱，甚至误导别人直接去背代码，另外，核心的逻辑都能展示出来，再去横向的实现其他的类似情况恐怕也不是什么问题了。

在以下的整理中，建议大家先照的核心要点自己写一遍，然后对照下面的代码，复习效果更好。本文的目的就在于以最简洁的代码帮你从第一性原理的角度理解api的内部运作流程，**凡是对于我们理解api没有帮助的的边界情况都不做处理**。

#### 一、用ES5实现数组的map方法

核心要点:

1.回调函数的参数有哪些，返回值如何处理。

2.不修改原来的数组。

    Array.prototype.MyMap = function(fn, context){
      var arr = Array.prototype.slice.call(this);//由于是ES5所以就不用...展开符了
      var mappedArr = [];
      for (var i = 0; i < arr.length; i++ ){
        mappedArr.push(fn.call(context, arr[i], i, this));
      }
      return mappedArr;
    }
    复制代码

#### 二、用ES5实现数组的reduce方法

核心要点:

1、初始值不传怎么处理

2、回调函数的参数有哪些，返回值如何处理。

    Array.prototype.myReduce = function(fn, initialValue) {
      var arr = Array.prototype.slice.call(this);
      var res, startIndex;
      res = initialValue ? initialValue : arr[0];
      startIndex = initialValue ? 0 : 1;
      for(var i = startIndex; i < arr.length; i++) {
        res = fn.call(null, res, arr[i], i, this);
      }
      return res;
    }
    复制代码

#### 三、实现call/apply

思路: 利用this的上下文特性。

    //实现apply只要把下一行中的...args换成args即可 
    Function.prototype.myCall = function(context = window, ...args) {
      let func = this;
      let fn = Symbol("fn");
      context[fn] = func;
    
      let res = context[fn](...args);//重点代码，利用this指向，相当于context.caller(...args)
    
      delete context[fn];
      return res;
    }
    复制代码

#### 四、实现Object.create方法(常用)

    function create(proto) {
        function F() {};
        F.prototype = proto;
        F.prototype.constructor = F;
        
        return new F();
    }
    复制代码

#### 五、实现bind方法

核心要点:

1.对于普通函数，绑定this指向

2.对于构造函数，要保证原函数的原型对象上的属性不能丢失

    Function.prototype.bind = function(context, ...args) {
        let self = this;//谨记this表示调用bind的函数
        let fBound = function() {
            //this instanceof fBound为true表示构造函数的情况。如new func.bind(obj)
            return self.apply(this instanceof fBound ? this : context || window, args.concat(Array.prototype.slice.call(arguments)));
        }
        fBound.prototype = Object.create(this.prototype);//保证原函数的原型对象上的属性不丢失
        return fBound;
    }
    复制代码

大家平时说的手写bind，其实就这么简单：）

#### 六、实现new关键字

核心要点:

1.  创建一个全新的对象，这个对象的\_\_proto\_\_要指向构造函数的原型对象
2.  执行构造函数
3.  返回值为object类型则作为new方法的返回值返回，否则返回上述全新对象

    function myNew(fn, ...args) {
        let instance = Object.create(fn.prototype);
        let res = fn.apply(instance, args);
        return typeof res === 'object' ? res: instance;
    }
    复制代码

#### 七、实现instanceof的作用

核心要点：原型链的向上查找。

    function myInstanceof(left, right) {
        let proto = Object.getPrototypeOf(left);
        while(true) {
            if(proto == null) return false;
            if(proto == right.prototype) return true;
            proto = Object.getPrototypeof(proto);
        }
    }
    复制代码

#### 八、实现单例模式

核心要点: 用闭包和Proxy属性拦截

    function proxy(func) {
        let instance;
        let handler = {
            constructor(target, args) {
                if(!instance) {
                    instance = Reflect.constructor(fun, args);
                }
                return instance;
            }
        }
        return new Proxy(func, handler);
    }
    复制代码

#### 九、实现数组的flat

方式其实很多，之前我做过系统整理，有六种方法，请参考：

[JS数组扁平化(flat)方法总结](https://juejin.im/post/5d0d9c49e51d4577781173ad)

#### 十、实现防抖功能

核心要点:

如果在定时器的时间范围内再次触发，则重新计时。

    const debounce = (fn, delay) => {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    };
    复制代码

#### 十一、实现节流功能

核心要点:

如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器。

    const throttle = (fn, delay = 500) => {
      let flag = true;
      return (...args) => {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
          fn.apply(this, args);
          flag = true;
        }, delay);
      };
    };
    复制代码

#### 十二、用发布订阅模式实现EventEmit

参考我的另一篇文章:

[基于"发布-订阅"的原生JS插件封装](https://juejin.im/post/5cf4c8ce6fb9a07efc4973a6#heading-0)中的手写发布订阅部分。

#### 十三、实现深拷贝

以下为简易版深拷贝，没有考虑循环引用的情况和Buffer、Promise、Set、Map的处理，如果一一实现，过于复杂，面试短时间写出来不太现实，如果有兴趣可以去这里深入实现:

[深拷贝终极探索](https://segmentfault.com/a/1190000016672263)。

    const clone = parent => {
      // 判断类型
      const isType =  (target, type) => `[object ${type}]` === Object.prototype.toString.call(target)
    
      // 处理正则
      const getRegExp = re => {
        let flags = "";
        if (re.global) flags += "g";
        if (re.ignoreCase) flags += "i";
        if (re.multiline) flags += "m";
        return flags;
      };
    
      const _clone = parent => {
        if (parent === null) return null;
        if (typeof parent !== "object") return parent;
    
        let child, proto;
    
        if (isType(parent, "Array")) {
          // 对数组做特殊处理
          child = [];
        } else if (isType(parent, "RegExp")) {
          // 对正则对象做特殊处理
          child = new RegExp(parent.source, getRegExp(parent));
          if (parent.lastIndex) child.lastIndex = parent.lastIndex;
        } else if (isType(parent, "Date")) {
          // 对Date对象做特殊处理
          child = new Date(parent.getTime());
        } else {
          // 处理对象原型
          proto = Object.getPrototypeOf(parent);
          // 利用Object.create切断原型链
          child = Object.create(proto);
        }
        for (let i in parent) {
          // 递归
          child[i] = _clone(parent[i]);
        }
        return child;
      };
      return _clone(parent);
    };
    复制代码

#### 十四、实现Promise

重点难点，比较复杂，请参考我的另一篇步步拆解文章:

[我如何实现Promise](https://juejin.im/post/5d0da5c8e51d455ca0436271)

#### 十五、使用ES5实现类的继承效果

也是重点知识，我之前做过详细拆解，有五个版本，如果每一版本都能说清楚，能够很好的体现自己对于原型链的理解，文章地址:

[ES5实现继承的那些事](https://juejin.im/post/5d0da727518825326d492b2f)