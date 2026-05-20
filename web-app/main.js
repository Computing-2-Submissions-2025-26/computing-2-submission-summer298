import R from "./ramda.js";

const hello_message = document.getElementById("hello_message");

hello_message.onclick = function () {
    hello_message.textContent = "Bonjour!";

}

hello_message.textContent = "Bonjour!";