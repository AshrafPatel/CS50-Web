let form = document.querySelector(".form")
let html = document.querySelector("html")
let main = document.querySelector("#main")
let mySidebar = document.querySelector("#mySidebar")
let btnForm = document.querySelector(".btn-form")
let txtForm = document.querySelector("#txt-form")
let channelexist = document.querySelector(".channelexist")
let chatBox = document.querySelector("#chat-textbox")
let chatBtn = document.querySelector("#chat-btn")
let openBtn = document.querySelector(".openbtn")
let messagesContainer = document.querySelector("#messages")
let myMsgs = document.querySelectorAll(".my-msg")
const allMessages = document.createElement('div')
allMessages.setAttribute("class", "messageContainer")


const linksTemplate = Handlebars.compile(document.querySelector('#resultLinks').innerHTML);
let username = localStorage.getItem('chatname');

if (typeof username === undefined || username === null) {
    window.location.replace("/");
}

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

if (localStorage.getItem('chatroom') !== undefined || localStorage.getItem('chatroom') !== null) {
    reJoinRoom(localStorage.getItem("chatroom"))
}

socket.on('newcomer', data => {
    console.log(data)
    data.map(gms => {
        makeMessage(gms)       
    })
    scrollDownChatWindow()
})

// Display all incoming messages
socket.on('message', data => {
    allMessages.innerHTML = ""
    data.map(gms => {
        allMessages.innerHTML += makeMessage(gms).outerHTML
    })
    messagesContainer.append(allMessages)
    scrollDownChatWindow()
});

chatBtn.addEventListener("click", function() {
    let room = localStorage.getItem("chatroom")
    socket.emit('incoming-msg', {
        'msg': chatBox.value,
        'username': username, 
        'room': room
    });
    chatBox.value = '';
})


function logoutUser() {
    name = localStorage.getItem("chatname")
    let room = localStorage.getItem("chatroom")
    if (typeof room !== undefined || room !== null) {
        leaveRoom(room)
    }
    localStorage.clear();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/logout')
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            window.location.href = "/";
        }
    }
    let postVar = 'displayname=' + name;
    xhr.send(postVar)
}

function showForm() {
    form.setAttribute("style", "display: block;");
    main.setAttribute("style", "background: rgba(0, 0, 0, 0.7);")
    html.setAttribute("style", "background: rgba(0, 0, 0, 0.7);")
    chatBox.disabled = true
    openBtn.disabled = true
    closeNav()
}

function hideForm() {
    form.setAttribute("style", "display: none;");
    main.setAttribute("style", "background: white;")
    html.setAttribute("style", "background: white;")
    chatBox.disabled = false
    openBtn.disabled = false
}

function confirmChannel() {
    let xhttp = new XMLHttpRequest();
    let params = "channelname=" + txtForm.value 
    xhttp.open("POST", "/channelexist", true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {//Call a function when the state changes.
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let channelTaken = xhttp.responseText === "true" ? true : false;
            if (channelTaken) {
                btnForm.disabled = true;
                btnForm.setAttribute("style", "background: #AAA;")
                txtForm.setAttribute("style", "background: #DC5151;")
                channelexist.innerHTML = "Channel exists!"
                channelexist.setAttribute("style", "display: block;")
            } else {
                btnForm.disabled = false;
                btnForm.setAttribute("style", "background: white;")
                txtForm.setAttribute("style", "border-color: #69BE6E;")
                channelexist.innerHTML = "";
                channelexist.setAttribute("style", "display: none;")
            }
        }
    }
    xhttp.send(params);
}

function submitForm() {
    name = localStorage.getItem("chatname")
    let xhttp = new XMLHttpRequest()
    let params = "channelname=" + txtForm.value + "&username=" + name
    xhttp.open("POST", "/createchannel", true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = function () {//Call a function when the state changes.
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let operationsuccess = xhttp.responseText !== "" ? true : false;
            if (operationsuccess) {
                hideForm();
                getChannels()
                selectRoom(txtForm.value)
                txtForm.value = ""
            }
        }
    }
    xhttp.send(params);
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    getChannels()
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function getChannels() {
    let channels = []
    name = localStorage.getItem("chatname")
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            channels = JSON.parse(xhttp.responseText)
            Handlebars.registerHelper('print_channel', function () {
                return this.name
            })
            const content = linksTemplate({'channels': channels});
            document.querySelector("#links").innerHTML = content
        }
    }
    xhttp.open("GET", "/getchannels", true)
    xhttp.send()
}

function checkMessage() {
    if (chatBox.value == "" || chatBox.value == null) {
        chatBtn.disabled = true
    } else {
        chatBtn.disabled = false
    }
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function scrollDownChatWindow() {
    const chatWindow = messagesContainer;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function selectRoom(room) {
    let oldRoom = localStorage.getItem("chatroom")
    let newRoom = room
    if (newRoom === oldRoom) {
        msg = `You are already in ${room} room.`;
        chatBox.disabled = false
        printSysMsg(msg);
    } else {
        if (typeof oldRoom !== undefined || oldRoom !== null)
            leaveRoom(oldRoom);
        joinRoom(newRoom);
        room = newRoom;
    }
    localStorage.setItem("chatroom", room)
}

function leaveRoom(rm) {
    username = localStorage.getItem('chatname');
    socket.emit('leave', { 'username': username, 'room': rm });
}

function joinRoom(rm) {
    username = localStorage.getItem('chatname');
    localStorage.setItem("chatroom", rm)
    socket.emit('join', { 'username': username, 'room': rm });
    messagesContainer.innerHTML = '';
    chatBox.disabled = false
    chatBox.focus();
}

function reJoinRoom(rm) {
    username = localStorage.getItem('chatname');
    socket.emit('join', { 'username': username, 'room': rm });
    messagesContainer.innerHTML = '';
    chatBox.disabled = false
    chatBox.focus();
    getChannels()
}

function makeMessage(data) {
    messagesContainer.innerHTML = ""
    const div = document.createElement('div');
    const span_username = document.createElement('span');
    const span_timestamp = document.createElement('p');
    const span_delete = document.createElement('span');
    const br = document.createElement('br')

    if (data.username == username) {
        div.setAttribute("class", "my-msg");
        span_username.setAttribute("class", "my-username");
        span_username.innerText = data.username;
        span_timestamp.setAttribute("class", "timestamp");
        span_timestamp.innerText = data.time_display;
        span_delete.setAttribute("class", "delete-my-msg");
        span_delete.innerText = "x"
        span_delete.setAttribute("onclick", `deleteMessage(${data.id})`)
        if (!data.deleted) {
            div.innerHTML += span_username.outerHTML + span_delete.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML
        } else {
            div.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML
        }
        return div
    }

    else if (typeof data.username !== 'undefined') {
        div.setAttribute("class", "others-msg");
        span_username.setAttribute("class", "other-username");
        span_username.innerText = data.username;
        span_timestamp.setAttribute("class", "timestamp");
        span_timestamp.innerText = data.time_display;
        div.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML;
        return div
    }
    else {
        const p = document.createElement('p');
        p.setAttribute("class", "system-msg");
        p.innerHTML = data.msg;
        return p
    }
}

function deleteMessage(id) {
    let rm = localStorage.getItem("chatroom")
    socket.emit("delete-msg", { 'username': username, 'room': rm, "message_id": id})
    let msgToDisappear = event.target.parentNode
    msgToDisappear.classList.add("delete-transition");
    msgToDisappear.onanimationend = () => {
        msgToDisappear.setAttribute("style", "display: none;")
    };
}

function printSysMsg(msg) {
    const p = document.createElement('p');
    p.setAttribute("class", "system-msg");
    p.innerHTML = msg;
    messagesContainer.append(p);
    scrollDownChatWindow()
    chatBox.focus();
}

txtForm.addEventListener("keyup", confirmChannel)
chatBox.addEventListener("keyup", checkMessage)
