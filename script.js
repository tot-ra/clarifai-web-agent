document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatHeader = document.getElementById('chat-header');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const resizeHandle = document.getElementById('resize-handle');
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

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            chatContainer.style.left = `${e.clientX - offsetX}px`;
            chatContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        chatContainer.style.cursor = 'default';
        document.body.style.cursor = 'default';
    });

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const newWidth = e.clientX - chatContainer.offsetLeft;
            const newHeight = e.clientY - chatContainer.offsetTop;
            chatContainer.style.width = `${newWidth}px`;
            chatContainer.style.height = `${newHeight}px`;
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
