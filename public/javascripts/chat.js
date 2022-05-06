let ws = new WebSocket("ws://localhost:8181");
ws.onopen = function (e) {
    console.log('Connection to server opened');
}
let userId = new Date().getTime();

// 关闭连接 删除用户
ws.onclose = function (e) {
    console.log('Connection to server closed');
}
flag = false;
ws.onmessage = function (message) {
    console.log("服务器返回的信息");
    const state = message.data.slice(0, 1);//与服务器约定状态
    const mes = message.data.slice(1);//聊天数据
    if (state == 1) {
        updateUserName(JSON.parse(mes))
    }
    console.log(state, mes);
}

function sendMessage() {
    console.log(document.querySelector('#message').value)
    // 发送
    ws.send(document.querySelector('#message').value)
}

// 添加用户
document.querySelector('#confirm').addEventListener('click', () => {
    console.log("11111", ws);
    username = document.querySelector('#username').value
    if (flag) return
    // 修改信息，并且发送信息到服务器
    let mess = {
        id: userId,
        name: username,
        state: 1
    }
    flag = true
    ws.send(JSON.stringify(mess))
})

// 更新用户表
function updateUserName(data) {
    var parent = document.querySelector('#users')
    // parent.innerHTML = ''
    data.forEach((item) => {
        var list = document.createElement('li')
        list.innerHTML = item.name
        parent.appendChild(list)
    })
}

// 关闭连接事件
document.querySelector('#closeWs').addEventListener('click', () => {
    // 取消用户信息
    // 修改信息，并且发送信息到服务器
    let mess = {
        id: userId,
        state: 4
    }
    ws.close(3000, JSON.stringify(mess));
    window.location.reload();//退出之后，刷新页面
})

// 发送聊天信息
document.querySelector('#sendBtn').addEventListener('click', () => {// 发送
    if (!flag) {
        alert('请注册用户')
        return
    }
    if (document.querySelector('#message').value != '' && flag) {
        // 拼接数据
        let mess = {
            id: userId,
            name: username,
            state: 3,
            time: new Date().toLocaleString(),
            value: document.querySelector('#message').value
        }
        ws.send(JSON.stringify(mess))
        document.querySelector('#message').value = ''
    }
})
// 接受聊天信息
ws.onmessage = function (message) {
    console.log('服务器返回的信息', message.data)
    let state = message.data.slice(0, 1)
    let data = JSON.parse(message.data.slice(1))
    if (state == 1 || state == 4) {
        updateUserName(data)
    } else if (state == 3) {
        updateTalkMessage(data)
    }
}
// 更新聊天框信息
function updateTalkMessage(data) {
    console.log(data)
    var parent = document.querySelector('#talk')
    var list = document.createElement('li')
    list.innerHTML = `<strong>${data.time} ${data.name} 说</strong>: <font color="#FF0000">${data.value}</font>`
    parent.appendChild(list)
}