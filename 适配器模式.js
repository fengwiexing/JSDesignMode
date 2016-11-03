

//适配器模式
var renderMap = function (obj) {
    if (obj.show instanceof Function) {
        obj.show();
    }
};

var googleMap = {
    show: function () {
        console.log('渲染谷歌地图');
    }
}
var baiduMap = {
    show: function () {
        console.log('渲染百度地图');
    }
}
var searchMap = {//搜搜地图没有SHOW的方法，所以要写个适配器转换
    display: function () {
        console.log('渲染搜搜地图');
    }
}
var showSearchMap = {//用于搜搜地图转换的适配器，
    show: function () {
        searchMap.display();
    }
}
renderMap(googleMap);
renderMap(baiduMap);
renderMap(showSearchMap);

//例2
var getGuangdongCity = function () {
    var guangdongCity = [
        { name: 'shenzhen', id: 11 },
        { name: 'guangzhou', id: 12 }
    ]
    return guangdongCity;
}

var newGuangdongCity = function () {//新的广东省城市
    var guangdongCity = {
        'shenzhen': 11,
        'guangzhou': 12,
        'zhuhai': 13,
    }
    return guangdongCity;
}

var newGuangdongCity2 = function () {//适配器，将新的广东省城市转换为旧的写法，用于适应旧的程序接口
    var newGuangdong = [],
        newGuangdong2 = newGuangdongCity();
    for (var i in newGuangdong2) {
        var obj = { name: i, id: newGuangdong2[i] };
        newGuangdong.push(obj);
    }
    return newGuangdong;
}

var render = function (fn) {
    console.log('开始渲染地图');
    document.write(JSON.stringify(fn()));
}
render(getGuangdongCity)
render(newGuangdongCity2)









