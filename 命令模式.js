

//各种行为封装在对象中
var Ryu = {
    attack: function () {
        console.log('攻击');
    },
    defense: function () {
        console.log('防御');
    },
    jump: function () {
        console.log('跳跃');
    },
    crouch: function () {
        console.log('蹲下');
    }
}
//设置命令
var setCommand = function (obj, state) {
    return function () {
        obj[state]();
    }
}
//各种命令
var commands = {
    '119': 'jump',  //对应键盘 W 键
    '115': 'crouch',//对应键盘 S 键
    '97': 'defense',//对应键盘 A 键
    '100': 'attack',//对应键盘 D 键
}
//用于保存命令对应的各种行为，可用于重播，撤消，各种命令
var commandStack = [];

//事件监听
document.onkeypress = function (e) {
    var keyCode = e.keyCode,
        command = setCommand(Ryu, commands[keyCode]);//调用设置好的命令
    if (command) {
        commandStack.push(command);//保存命令在堆栈中
        command(); //执行命令
    }
}
document.getElementById("重播").onclick = function () {//重新执行命令
    var command;
    while (command = commandStack.shift()) { //从堆栈中依次取出命令并执行
        command();
    }
}











