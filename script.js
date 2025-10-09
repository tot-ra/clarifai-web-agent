document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatHeader = document.getElementById('chat-header');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const collapseBtn = document.getElementById('collapse-btn');
    const chatIcon = document.getElementById('chat-icon');

    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY;

    chatHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatContainer.offsetLeft;
        offsetY = e.clientY - chatContainer.offsetTop;
        chatContainer.style.cursor = 'grabbing';
    });


    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        chatContainer.style.cursor = 'default';
        document.body.style.cursor = 'default';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            chatContainer.style.left = `${e.clientX - offsetX}px`;
            chatContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    collapseBtn.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatIcon.classList.remove('hidden');
    });

    chatIcon.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        chatIcon.classList.add('hidden');
    });

    const adjustChatContainerSize = () => {
        const headerHeight = chatHeader.offsetHeight;
        const inputContainerHeight = document.getElementById('chat-input-container').offsetHeight;
        const messagesHeight = chatMessages.scrollHeight;
        const messagesWidth = chatMessages.scrollWidth;
        
        const totalHeight = headerHeight + inputContainerHeight + messagesHeight + 20;
        const totalWidth = messagesWidth + 40;

        const maxHeight = window.innerHeight * 0.8;
        const maxWidth = window.innerWidth * 0.8;

        chatContainer.style.height = `${Math.min(totalHeight, maxHeight)}px`;
        chatContainer.style.width = `${Math.min(totalWidth, maxWidth)}px`;
    };

    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (sender === 'bot') {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(adjustChatContainerSize, 50);
    };

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';

            try {
                const response = await fetch('http://localhost:3000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from server');
                }

                const data = await response.json();
                addMessage(data.reply, 'bot');

            } catch (error) {
                console.error(error);
                addMessage('Sorry, something went wrong.', 'bot');
            }
        }
    };

    chatSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
