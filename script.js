async function handleUserInput() {
    const userInput = document.getElementById('userInput').value.trim();
    const chatbox = document.querySelector('.chatbox');
  
    if (userInput !== "") {
      const userChat = document.createElement('li');
      userChat.classList.add('chat', 'outgoing');
      userChat.innerHTML = `<span class="material-symbols-outlined">person</span><p>You: ${userInput}</p>`;
      chatbox.appendChild(userChat);
      document.getElementById('userInput').value = '';
  
      const loadingMessage = document.createElement('li');
      loadingMessage.classList.add('chat', 'incoming');
      loadingMessage.innerHTML = `
        <span class="material-symbols-outlined">smart_toy</span>
        <p>Loading...</p>
      `;
      chatbox.appendChild(loadingMessage);
  
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: userInput })
        });
  
        chatbox.removeChild(loadingMessage);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const botMessage = formatResponse(data[0]?.generated_text);
  
        const botResponse = document.createElement('li');
        botResponse.classList.add('chat', 'incoming');
        botResponse.innerHTML = `
          <span class="material-symbols-outlined">smart_toy</span>
          <p>${botMessage}</p>
        `;
        chatbox.appendChild(botResponse);
      } catch (error) {
        console.error('Error:', error);
        chatbox.removeChild(loadingMessage);
        const errorResponse = document.createElement('li');
        errorResponse.classList.add('chat', 'incoming');
        errorResponse.innerHTML = `
          <span class="material-symbols-outlined">smart_toy</span>
          <p>Sorry, there was an error processing your request.</p>
        `;
        chatbox.appendChild(errorResponse);
      }
  
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }
  
  function formatResponse(responseText) {
    if (!responseText) return "I'm here to assist you with educational inquiries.";
  
    const educationalResponse = responseText.replace(/hi|hello|hey/gi, "Greetings")
        .replace(/how are you/gi, "I am here to assist you with your educational needs.")
        .replace(/pets|dog/gi, "I can provide information on various topics, including educational resources.")
        .trim();
  
    return educationalResponse.charAt(0).toUpperCase() + educationalResponse.slice(1);
  }
  
  function closeChat() {
    document.querySelector('.chatbot').style.display = 'none';
  }
  