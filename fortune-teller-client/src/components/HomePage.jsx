import React from "react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function HomePage(props){

    return(
        <div className="home-container">
            <header>Welcome to My Excellent Fortune Teller</header>
            <h5>Click chat icon below to start a chat</h5>
            <button onClick={props.onClick} className="chat-button"><ChatBubbleOutlineIcon/></button>
        </div>
    )

}

export default HomePage;