import React, { useEffect, useState } from 'react';
import InputArea from './InputArea';
import ChatWindow from './ChatWindow';
import HomePage from './HomePage';
import Footer from './Footer';


function App() {
    const [messages, setMessages] = useState([]);
    const [showHome, setShowHome] = useState(true);
    const [state, setState] = useState('initial');

  
    useEffect(() => {
      startConversation();

    }, []);

    function handlePageChange(){
      setShowHome(false);
    }

    function startConversation() {
      const initialMessage = "Hello. Are you having a good day?";
      setMessages([{ text: initialMessage, sender: 'bot'}])
    };

    function sleep(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    async function receiveFortune(message){
      try {
        const response = await fetch('http://localhost:3000/check-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages, 
          // { text: message, sender: 'user' }, 
          { text: data.response, sender: 'bot' }
        ]);
        await sleep(5000);
        setMessages((prevMessages) => [
          ...prevMessages, 
          // { text: message, sender: 'user' }, 
          { text: "Do you want me to try again? Yes or No?", sender: 'bot' }
        ]);
        setState('post-fortune');
      } catch (error) {
        console.error('Error:', error);
      }

    }

    async function handleSendMessage(message){
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);

        if (state === 'initial'){
          
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Ok, give me a minute to consult my crystal ball.", sender: 'bot' }
          ]);
          await sleep(5000);
          
          receiveFortune(message);
          
        } else if (state === 'post-fortune') {
          if(message.toLowerCase() === 'yes'){
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Ok, give me a minute to consult my crystal ball again.", sender: 'bot' }
            ]);
            await sleep(5000);
            receiveFortune(message)

          } else if (message.toLowerCase() === 'no'){
            setState('initial');
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Goodbye!", sender: 'bot' }
            ]);
          }
        }

        
        
    };

    async function handleClearMessages(){
        setMessages([]);
        setState('initial')
        startConversation();
    };


    return(
        showHome?
            <div className='App-home'>
                <HomePage onClick={handlePageChange}/>
                <Footer/>
            </div>:
            <div className='App'>
                <ChatWindow messages={messages} />
                <InputArea onSendMessage={handleSendMessage}/>
                <button className="clear-chat" onClick={handleClearMessages}>Clear Chat</button>
            </div>


        

    )
    
  
}

export default App
