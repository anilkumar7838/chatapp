const socket = io.connect("http://localhost:8000");
//Get DOM elements in a respective js variables 
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector('.container');
const height = messageContainer.getBoundingClientRect().height;
// var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    // if (position == "left") {
    //     audio.play();
    // }
};
//If the form gets submitted,send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`<span class='person'>You</span>: <span>${message}</span>`, "right");
    socket.emit('send', message);
    messageInput.value = "";
})

//Ask new user for his/her name and let the server know
const client_name = prompt("Enter Your name to join");
socket.emit("new-user-joined",client_name);

//If a new user joins, receive his/her name from the server 
socket.on("user-joined", name => {
    append(`<span class="person">${name}</span>: <span>joined the chat</span>`, "left");
});

//If server sends a message,receive it
socket.on("receive", data => {
    append(`<span class="person">${data.name}</span>: <span>${data.message}</span>`, "left")
});
//If a user leaves the chat,append the info to the container
socket.on("leave", name => {
    append(`<span>${name} left the chat</span>`, 'left')
});
