
//<div style="background:red;position:absolute" id="div">dfaf</div>
//<form action="http://....." id="registerForm" method="post">
//    <label>用户名：<input type="text" name="userName" /></label>
//    <label>手机：<input type="tel" name="phoneNumber" /></label>
//    <button type="submit">提交</button>
//</form>
   
  
      
      
       //策略模式
       var strategies = {
           'S': function (salary) { 
               return salary * 4;
           },
           A: function (salary) {
               return salary * 3;
           },
           B: function (salary) {
               return salary * 2;
           }
       };
var calculateBonus = function () {
    var shift = [].shift.call(arguments);
    return strategies[shift].apply(strategies, arguments);
}
alert(calculateBonus('S', 1000));
       

//缓算法，t为动画已消耗时间,b为小球原始位置,c为小球目标位置,d为动画持续的总时间
var tween = {
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    strongEaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    strongEaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    sineaseIn: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    sineaseOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
};
     
var Animate = function (dom) {
    this.dom = dom;          //进行运动的DOM节点、
    this.startTime = 0;      //动画开始时间、
    this.startPos = 0;       //动画开始时，DOM节点位置，即节点初始位置、
    this.endPos = 0;         //动画结束时，DOM节点位置，即节点目标位置、
    this.propertyName = null;//节点要改变的样式名称、
    this.easing = null;      //缓动算法、
    this.duration = null;    //动画持续时间、
}
Animate.prototype.start = function (propertyName, endPos, duration, easing) {//要改变样式名，动画结束位置，动画时间，动画缓动名称
    this.startTime = +new Date();                                   //动画开始时间、
    this.startPos = this.dom.getBoundingClientRect()[propertyName];  //动画开始时，DOM节点位置，即节点初始位置、该方法返回是相对窗口距离
    this.endPos = endPos;               //动画结束时，DOM节点位置，即节点目标位置、
    this.propertyName = propertyName;   //节点要改变的样式名称、
    this.easing = tween[easing] || tween.linear;//缓动算法，默认是匀速、
    this.duration = duration || 500;             //动画持续时间,默认500毫秒、

    var self = this;
    var timeId = setInterval(function () { //启动定时器
        if (self.step() === false) {  //如果动画结束，清除定时器
            clearInterval(timeId);
        }
    }, 17);
};
Animate.prototype.step = function () { 
    var t = +new Date();  //每运行一次的当前时间
    if (t >= this.startTime + this.duration) {//如果当前时间大于或等于 动画开始时间加动画持续时间，则结束动画
        this.update(this.endPos); //设置元素的目标位置
        return false;
    }
    var pos = this.easing(t - this.startTime, this.startPos, this.endPos, this.duration);//返回Dom当前位置
    this.update(pos); //设置元素的当前位置
}
Animate.prototype.update = function (end) {//设置元素位置
    this.dom.style[this.propertyName] = end + 'px';
}

var animate =new Animate(document.getElementById('div'));
animate.start('left', 500, 2000, 'strongEaseOut');


//表单校验规则
var strategies = {
    isNonEmpty: function (value, errorMsg) {
               
        if (value === "") {//值不能为空
            return errorMsg;
        }
    },
    minLength: function (value, length, errorMsg) {
              
        if (value.length < length) {//值的长度不能小于指的长度
            return errorMsg;
        }
    },
    isMobile: function (value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {//值工符合手机的格式
            return errorMsg;
        }
    }
}
        
var Validator = function () {
    this.cache = [];
};
Validator.prototype.add = function (dom,rules) {
    var self = this;
    for (var i=0, rule; rule = rules[i++];) {
        ; (function (rule) {
            var strategyAry = rule.strategy.split(":");//获取校验规则 strategy: "minLength:6",
            var errorMsg = rule.errorMsg;     //获取错误指示信息
                   
            self.cache.push(function () {//把校验函数放入数组中
                var strategy = strategyAry.shift(); //提取校验规则
                strategyAry.unshift(dom.value);     //把元素的值放到数组的第一位置中
                strategyAry.push(errorMsg);      //把指示的信息放到数组的最后位置
                return strategies[strategy].apply(strategies, strategyAry);//执行校验
            })
        })(rule);
    }
          
}
Validator.prototype.start = function () {
    for (var i = 0, validatorFn; validatorFn = this.cache[i++];) {
        var error = validatorFn();
        if (error) {
            return error;
        }
    }
}

//调用
var formEle = document.forms[0];
var varlidataFunc = function () {
    var validator = new Validator();
    validator.add(formEle.phoneNumber, [{
        strategy: 'isNonEmpty',
        errorMsg: '不能为空'
    }, {
        strategy: "minLength:6",
        errorMsg: '最少要输入6位'
    }, {
        strategy: "isMobile",
        errorMsg: '请输入正确的手机格式'
    }]);
    return validator.start();
}
      
formEle.onsubmit = function () {
    var error = varlidataFunc()
    if (error) {
        alert(error);
        return false;
    }
}