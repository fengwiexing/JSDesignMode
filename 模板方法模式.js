
//模板方法模式，相似于抽象类实现，也是继承的一种表现,当使用一个模板方模式时，就意味着子类放弃了控制权，
//而是改为父类通知子类哪些方法应该在什么时候调用，子类只负责提供一些设计上的细节


//这是一个饮料的基类
var Beverage = function () { }
//这个方法是，所有子类实现都是相同，所有提到基类来实现
Beverage.prototype.boilWater = function () {
    console.log('烧开水');
}
//下面一个基类的空方法，让继承它的子类去实现
Beverage.prototype.brew = function () { throw new Error('子类必须重写brew方法'); };
Beverage.prototype.pourInCup = function () { throw new Error('子类必须重写pourInCup方法'); };
Beverage.prototype.addCondiments = function () { throw new Error('子类必须重写addCondiments方法'); };
//在基类放置一个钩子，用于是否执行addCondiments方法，默认是要执行addCondiments方法的
Beverage.prototype.customerWantsCondiments = function () {//这个钩子方法，子类可以选择去实现，如果不实现则用默认的
    return true;
}
//初始化
Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCup();
    //
    if (this.customerWantsCondiments()) {
        this.addCondiments();
    }
}

//实现一个子类，咖啡
var Coffee = function () { }
Coffee.prototype = new Beverage();
Coffee.prototype.constructor = Coffee;
Coffee.prototype.brew = function () {
    console.log('用开水冲咖啡');
}
Coffee.prototype.pourInCup = function () {
    console.log('把咖啡倒进杯子');
};
Coffee.prototype.addCondiments = function () {
    console.log('加糖加牛奶');
}

var coffee = new Coffee();
coffee.init();

//实现一个子类，茶
var Tea = function () { };
Tea.prototype = new Beverage();
Tea.prototype.constructor = Tea;
Tea.prototype.brew = function () {
    console.log('把开水倒入杯子');
}
Tea.prototype.pourInCup = function () {
    console.log('把茶叶倒入杯子');
}
Tea.prototype.addCondiments = function () {
    console.log('添加柠檬');
}
//在茶这个子类中挂个钩子，让客户自行选择是否加柠檬
Tea.prototype.customerWantsCondiments = function () {
    return window.confirm('需要添加柠檬吗？');
}
var tea = new Tea();
tea.init();





//这个方法跟上面的一样效果
//在好来坞原则指引下，实现跟继承一样效果的方法，
var Beverage2 = function (obj) {
    var boilWater = function () {
        console.log('把水烧开');
    };
    var brew = obj.brew || function () { throw new Error('还没有实现brew方法') };
    var pourInCup = obj.pourInCup || function () { throw new Error('还没有实现pourInCup方法') };
    var addCondiments = obj.addCondiments || function () { throw new Error('还没有实现addCondiments方法') };
    var customerWantsCondiments = obj.customerWantsCondiments || function () { return true; };//加入钩子

    var F = function () { };
    F.prototype.init=function(){
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }
    var f = new F();
    return f;
}

var Tea = Beverage2({
    brew: function () { console.log('浸泡茶叶') },
    pourInCup: function () { console.log('把茶叶放入杯子') },
    addCondiments: function () { console.log('加入柠檬') },
    customerWantsCondiments: function () { return window.confirm('是否要加柠檬') },
});
Tea.init();

//和上面是一样的，只是少了 var f = new F();直接返回一个方法
var Beverage2 = function (obj) {
    var boilWater = function () {
        console.log('把水烧开');
    };
    var brew = obj.brew || function () { throw new Error('还没有实现brew方法') };
    var pourInCup = obj.pourInCup || function () { throw new Error('还没有实现pourInCup方法') };
    var addCondiments = obj.addCondiments || function () { throw new Error('还没有实现addCondiments方法') };
    var customerWantsCondiments = obj.customerWantsCondiments || function () { return true; };//加入钩子

    var F = function () {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();

        }
    };
    return F;
}

var Tea = Beverage2({
    brew: function () { console.log('浸泡茶叶') },
    pourInCup: function () { console.log('把茶叶放入杯子') },
    addCondiments: function () { console.log('加入柠檬') },
    customerWantsCondiments: function () { return window.confirm('是否要加柠檬') },
});
Tea();
















