import React, {createContext, useContext, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CreatePollQuestion from "./CreatePollQuestion";
import TextField from "@material-ui/core/TextField";
import {PollContext, PollContextProvider} from "./PollContext";
import axios from 'axios';
const useStyles = makeStyles((theme) => ({

}));

let apiGatewayUrl = '';
if(process.env.REACT_APP_DEPLOY === "False"){
    apiGatewayUrl = `http://localhost:8080`;
}else{
    apiGatewayUrl = `${process.env.REACT_APP_EC2HOST}:8080`;
}

const CreatePoll=({user})=>{
    const classes = useStyles();
    const [questions, setQuestions] = useState([<CreatePollQuestion />]);
    const {pollInfo, setPollInfo} = useContext(PollContext);

    const addPollQuestion=()=>{
        let currentQuestions = [...questions];
        currentQuestions.push(<CreatePollQuestion />);
        setQuestions(currentQuestions);
    };

    const createPoll = () => {
        //combine options with corrects
        let newPollInfo = {...pollInfo};
        let newPollQuestions = [...newPollInfo.pollQuestions];

        //prevent crash on resubmit
        if(newPollQuestions !== undefined){
            for(let question of newPollQuestions){
                for(let i = 0; i < question.options.length; i ++){
                    question.options[i] = {optionText: question.options[i]};
                }
            }
            newPollInfo.pollQuestions = newPollQuestions;
            setPollInfo(newPollInfo);
            //console.log('Poll before sending away: ' + newPollInfo.pollName);
            axios.post(apiGatewayUrl + '/poll/create', {poll:newPollInfo, userId: user.User_ID}).then(function (res) {
                console.log('Response to Poll Create: ' + res.data.questionsAdded);
            })
        }
    };

    const handleChange = (e)=>{
        let newPollInfo = {...pollInfo};
        newPollInfo.pollName = e.target.value;
        setPollInfo(newPollInfo);
    };


    return (
        <div>
            <h2>Poll Creator</h2>
            <form>
                <TextField
                    id="filled-full-width"
                    label="Poll Name"
                    style={{ margin: 8 }}
                    placeholder="Poll Name"
                    helperText="Enter the name of your poll here!"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    onChange={handleChange}
                />
                <h3>Poll Questions:</h3>
                {questions}
            </form>
            <button onClick={()=>{addPollQuestion()}}>+</button>
            <button onClick={()=>{createPoll()}}>
                Create!
            </button>
        </div>
    );
};



export default CreatePoll;