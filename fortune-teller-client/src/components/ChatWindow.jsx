import React, {useState} from "react";

function ChatWindow(props){
    return (
        <div className="chat-window">
            {props.messages.length === 0 ? (
                <div className="no-messages">
                     No messages yet. Start the conversation!
                </div>
            ) : (
                props.messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                 ))
             )}

        </div>

    )

}

export default ChatWindow;