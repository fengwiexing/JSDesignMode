

//职责链
var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500元预定金，得到100元优惠券');
    } else {
        return 'nextSuccessor';//不知道下一个执行任务的是谁，反正返回nextSuccessor
    }
}
var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200元预定金，得到50元优惠券');
    } else {
        return 'nextSuccessor';//不知道下一个执行任务的是谁，反正返回nextSuccessor
    }
}
var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，没有优惠券');
    } else {
        console.log('手机库存不足');
    }
}

//把函数包装进职责链
var Chain = function (orderFn) {
    this.orderFn = orderFn;
    this.chainObj = null;
}
Chain.prototype.setNextChain = function (chainObj) {
    this.chainObj = chainObj;//保存下一个链条
}
Chain.prototype.nextOrder = function () {
    var ret = this.orderFn.apply(this, arguments);//执行当前链条的函数
    if (ret === 'nextSuccessor') {
        //执行下一条链条
        return this.chainObj && this.chainObj.nextOrder.apply(this.chainObj, arguments);
    }
    return ret;
}

var chain500 = new Chain(order500);
var chain200 = new Chain(order200);
var chainNormal = new Chain(orderNormal);

chain500.setNextChain(chain200);   //设置链条
chain200.setNextChain(chainNormal);

chain500.nextOrder(1, true, 0);
chain500.nextOrder(2, false, 0);
chain500.nextOrder(2, true, 0);

//异步职责链 ，在上面的包装函数中增加一个next方法,就可以实现异步职责链条
Chain.prototype.next = function () {
    return this.chainObj && this.chainObj.nextOrder.apply(this.chainObj, arguments);
}

var fn1 = new Chain(function () {
    console.log('1');
    return 'nextSuccessor';
});
var fn2 = new Chain(function () {
    console.log('2');
    var self = this;
    setTimeout(function () {//模仿异步返回
        self.next();
    }, 2000);
})
var fn3 = new Chain(function () {
    console.log('3');
});
fn1.setNextChain(fn2);
fn2.setNextChain(fn3);
fn1.nextOrder();


//用AOP实现职责链 简单又巧妙，注意链条的长度，叠加的函数越长，作用域也会跟着叠加
Function.prototype.after = function (fn) {
    var self = this;
    return function () {
        var ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }
        return ret;
    }
}
var order = order500.after(order200).after(orderNormal);
order(1, true, 2);
order(2, true, 2);
order(1, false, 2);
order(3, false, 0);