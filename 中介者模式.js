
 
//中介者模式
//游戏玩家
function Player(name,teanColor) {
    this.name = name;          //玩家名称
    this.teanColor = teanColor;//玩家所在的队伍
    this.state = '生'           //玩家生存状态
}
Player.prototype.win = function () {
    console.log(this.name + " 所在的 "+this.teanColor+" 赢了");
}
Player.prototype.lose = function () {
    console.log(this.name + " 所在的 "+this.teanColor+" 输了");
}
Player.prototype.die = function () {
    this.state = '死'
    playerDirector.InterfaceFn('die', this);//玩家死了通知中介
}
Player.prototype.remove = function () {
    console.log(this.name + '已离开所在队伍');
    playerDirector.InterfaceFn('remove', this);//玩家移除了，通知中介
}
Player.prototype.exchange = function (teanColor) {
    console.log(this.name + '已换到' + teanColor + '队伍');
    playerDirector.InterfaceFn('exchange', this, teanColor);//玩家换队，通知中介
}

//工厂函数，生产玩家
var Production = function (name, teanColor) {
    var player = new Player(name, teanColor);//创建一个玩家
    playerDirector.InterfaceFn('add', player);//通知中介增加一个玩家;
    return player;
}

//中介者
var playerDirector = (function () {
    var players = {},//保存所有玩家
        Operation = {}; //中介操作方法

    Operation.add = function (player) { //添加玩家
        var teanColor = player.teanColor;
        players[teanColor] = players[teanColor] || [];
        players[teanColor].push(player);
    }; 
    Operation.remove = function (player) {//移除玩家
        var teanColor = player.teanColor;
        var partner = players[teanColor];//找到当前玩家所在的队伍
        partner ? partner : [];
        for (var i = 0, k = partner.length; i < k; i++) {
            if (partner[i] === player) {
                partner.splice(i, 1);//从玩家队伍中移除玩家
            }
        }
        this.die(player);//移除玩家后检查之前所在队伍中其它玩家生存状态
    }
    Operation.exchange = function (player, color) {//玩家换队
        this.remove(player);     //先从之前的队伍中移除
        player.teanColor = color;//设置要换到的队伍
        this.add(player);        //添加到队伍中
    };
    Operation.die = function (player) {//玩家死亡
        var teanColor = player.teanColor,
            teanPlayers = players[teanColor];//找到当前玩家所在的队伍

        var allDie = true;//假如当前玩家所在的队伍已死完
            
        for (var i = 0, k = teanPlayers.length; i < k;i++) {
            if (teanPlayers[i].state !== '死') { //如果当前玩家所在的队伍还没死完
                allDie = false;//没有死完
                break;
            }
        }

        if (allDie) {//假如当前玩家所在的队伍已死完
            for (var j in players) {
                if (j === teanColor) {
                    var partner = players[j];
                    for (var i = 0, k = partner.length; i < k; i++) {
                        partner[i].lose();//通知队友输了
                    }
                } else {
                    var mate = players[j];
                    for (var i = 0, k = mate.length; i < k; i++) {
                        mate[i].win();//通知敌人赢了
                    }
                }
            }
        }
    }
    var InterfaceFn = function () {
        var message = [].shift.call(arguments);
        Operation[message].apply(Operation, arguments);
    }

    return {
        InterfaceFn: InterfaceFn,
    }
})();



var player1 = Production("狮子", '红色');
var player2 = Production("狐狸", '红色');
var player3 = Production("猩猩", '红色');
var player4 = Production("猕猴", '蓝色');
var player5 = Production("狗仔", '蓝色');
var player6 = Production("老皮", '蓝色');

     
player4.die();
player5.die();
player6.exchange('红色');


//中介者模式，

//选择颜色：<select id="colorSelect">
//    <option value="">请选择</option>
//    <option value="红色">红色</option>
//    <option value="蓝色">蓝色</option>
//</select>
//选择内存：
//<select id="memorySelect">
//    <option value="">请选择</option>
//    <option value="32G">32G</option>
//    <option value="16G">16G</option>
//</select>
//输入购买数量：<input type="number" id="numberInput" name="" placeholder="输入购买数量" />
//<br />
//<div>你选择颜色：<span id="showColor"></span></div>
//<div>你选择内存：<span id="showMemory"></span></div>
//<div>你购买数量：<span id="showCount"></span></div>
  
//<button type="button" id="btn" disabled="true">请选择购买参数</button>

  var goods = {
      '红色｜32G': 3,
      '红色｜16G': 0,
      '蓝色｜32G': 1,
      '蓝色｜16G':6,
  }
var colorSelect = document.getElementById('colorSelect'),
    memorySelect = document.getElementById('memorySelect'),
    numberInput = document.getElementById('numberInput'),
    showColor = document.getElementById('showColor'),
    showMenory = document.getElementById('showMemory'),
    showCount = document.getElementById('showCount'),
    btn = document.getElementById('btn');

var mediator = function () {//扮演一个中介者
    var color = colorSelect.value,
        memory = memorySelect.value,
        number = numberInput.value,
        goodsCount = goods[color + '｜' + memory];

    if (color) {//先检查选择颜色
        showColor.innerHTML = color;
    } else {
        btn.disabled = true;
        showColor.innerHTML = " 请选择购买颜色";
        return
    }
    if (memory) {//再检查选择内存
        showMenory.innerHTML = memory;
    } else {
        btn.disabled = true;
        showMenory.innerHTML = " 请选择内存大小";
        return
    }
    if (goodsCount - 0 <= 0) {//再检查选择库存，注意这项不能放在上面，因为当库存不足时不能及时更新上面这两项
        btn.disabled = true;
        showCount.innerHTML = " 手机库存不足";
        return;
    }
    if ( !(number - 0) <= 0) {//最后检查输入数量
        showCount.innerHTML = number;
    } else {
        btn.disabled = true;
        showCount.innerHTML = " 请选择购买数量";
        return
    }
    btn.disabled = false;
}
colorSelect.onchange = function () {
    mediator()
};
memorySelect.onchange = function () {
    mediator()
};
numberInput.oninput = function () {
    mediator()
};






