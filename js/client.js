//Get Logged Client From DB
const user = window.localStorage.getItem('user');
const username = window.localStorage.getItem('username');
if(username==null){
    window.location="index.html";
}

const socket = io('http://localhost:8001', { transports : ['websocket'] });
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.messageList');
const userListContainer = document.querySelector(".userList");
const tone = new Audio('sms.mp3');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`<p>You: ${message}</p>`,'replies');
    socket.emit('send',message);
    messageInput.value = '';
});

const append = (message,position) =>{
    const messageElement = document.createElement('li');
    messageElement.innerHTML = message;
    messageElement.classList.add('sent');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    //tone.play();
    console.log(messageElement);
};

const appendUserList = (userName) =>{
    const liElem  = document.createElement('li');
    liElem.classList.add('contact');
    liElem.classList.add('active');
    liElem.innerHTML = `<div class="wrap">
                            <span class="contact-status online"></span>
                            <img src="louislitt.png" alt="" />
                            <div class="meta">
                            <p class="name">${userName}</p><p class="preview">Joined at 21:00:32 AM</p>
                            </div>
                        </div>`;
    userListContainer.append(liElem);

    messageElement.innerHTML = message;
    messageElement.classList.add('sent');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    console.log(messageElement);
};



//const name = prompt("Enter Your Name To Join CharRoom");
const name = username;
alert(name);
socket.emit('new-user-joined',name);

socket.on('user-joined',name =>{
    append(`<p>${name} joined the Chat</p>`,'sent')
    appendUserList(name);
});

socket.on('receive',data =>{
    append(`<p>${data.name}:${data.message}</p>`,'sent');
    tone.play();
});


socket.on('left',name =>{
    append(`<p>${name} Left chat room </p>`,'sent')
});




