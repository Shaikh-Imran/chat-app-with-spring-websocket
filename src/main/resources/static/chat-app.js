var user, stompClient;
window.onload = () => {
    //take user name in the sart
    user = prompt("Hey, whats your name?", `user-${new Date().getTime()}`);
    //to show on header
    document.getElementById('user-name').innerHTML = user;

    //connect to websocket and some other stuffs
    startMessaging(user);
}

function startMessaging(user) {
    var socket = new SockJS('/CodersTea-ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        //to recieve messages form other users
        stompClient.subscribe('/topic/receive-msg-at', function (chat) {

            //we only need body and parse it in json
            chat = JSON.parse(chat.body);

            //we want to skip our own chat
            //since we are also subscribing to the same endpoint as others
            if (chat.sentBy === user) {return;}

            //show msg on window ui
            showRecievedMessageOnMsgWindow(chat);
        });
    });

}
function showRecievedMessageOnMsgWindow(chat) {
    const recievedMsgHtml =
        `<div class="row">
        <div class="card message-card rounded m-1 mr-5">
            <div class="card-body bg-danger rounded text-white p-2">
                <div class="p-1">
                    <small class="float-left">
                    ${chat.sentBy}
                    </small>
                    <small class="float-right ml-1">
                        ${chat.sentAt}
                    </small>
                </div>
                <hr class="text-white bg-white ">
                <p class="card-text">
                    ${chat.msg}
                </p>
            </div>
        </div>
    </div>`;

    showMsgOnWindow(recievedMsgHtml);
}

//send messages to other users
document.getElementById('msg-send').onclick = (e) => {
    //prevent default form submit
    e.preventDefault();

    const msgInput = document.getElementById('msg-text');
    const msg = msgInput.value;
    msgInput.value = '';

    //send msg over stomp
    sendMessageToUsers(user, msg);

    //show self msg on righ side
    showSelfMsgOnUi(user, msg);
}


function sendMessageToUsers(user, msg) {

    //endpoint and json object in string
    stompClient.send('/app/send-msg-to', {}, JSON.stringify({
        sentAt: getCurrentTime(),
        sentBy: user,
        msg: msg
    }));
}

//put the msg on right side with blue color
function showSelfMsgOnUi(user, msg) {
    const selfMsgHtml = `<div class="row justify-content-end">
    <div class="card message-card rounded m-1 ml-5">
        <div class="card-body bg-primary rounded text-white p-2">
            <div class="p-1">
                <small class="float-left">
                    ${user}
                </small>
                <small class="float-right ml-1">
                    ${getCurrentTime()}
                </small>
            </div>
            <hr class="text-white bg-white ">
            <p class="card-text">
                ${msg}
            </p>
        </div>
    </div>
</div>`;

    showMsgOnWindow(selfMsgHtml);
}

//to put given html in scollable window
function showMsgOnWindow(msgHtml) {
    const msgWindow = document.getElementById('msg-window');
    const msgBox = document.createElement('div');
    msgBox.innerHTML = msgHtml;

    //add html at the end
    msgWindow.append(msgBox);

    //scroll to the latest msg
    msgWindow.scrollTop = msgWindow.scrollHeight;
}


//time as 12:00 
function getCurrentTime() {
    const now = new Date();
    return now.getHours() + ':' + now.getMinutes();
}