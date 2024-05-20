import React, {useState} from "react";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';

function InputArea(props){

    const [input, setInput] = useState('');

    function handleSend(event){
        event.preventDefault();
        if (input.trim()) {
            props.onSendMessage(input);
            setInput('');
        }
    }

    function handleClear(event){
        event.preventDefault();
        setInput('');

    }

    function handleChange(event){
        setInput(event.target.value)

    }

    return(
        <div className="input-container">
            <form className="input" onSubmit={handleSend}>
                <input type="text" value={input} onChange={handleChange} placeholder="Type your message here..."/>
                <div className="buttons">
                    <button type="button" onClick={handleClear}><ClearIcon/></button>
                    <button type="submit"><SendIcon/></button>
                </div>
            </form>
        </div>
    )

}

export default InputArea;