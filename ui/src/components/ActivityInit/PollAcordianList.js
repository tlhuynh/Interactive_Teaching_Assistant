import React, {useContext, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import axios from "axios";

import socketIOClient from "socket.io-client";

import {ActivityMonitorContext} from "../ActivityMonitor/ActivityMonitorContext";

import PollMonitor from "../ActivityMonitor/PollMonitor";
import {PollMonitorContextProvider} from "../ActivityMonitor/PollMonitorContext";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    correct: {
        color: 'green',
    },
    incorrect: {
        color: 'red',
    },
    startButton: {
        marginLeft: '20px',
    },

}));

export default function PollAccordionList({user, sessionName}) {
    const classes = useStyles();
    const [pollList, setPollList] = useState([]);
    const {monitor, setMonitor} = useContext(ActivityMonitorContext);
    let pollsInfo = [];
    let apiGatewayUrl = '';
    let pollAnswers = {};
    let ENDPOINT = '';

    if(process.env.REACT_APP_DEPLOY === "False"){
        apiGatewayUrl = `http://localhost:8080`;
        ENDPOINT = "http://localhost:7000/";
    }else{
        apiGatewayUrl = `${process.env.REACT_APP_EC2HOST}:8080`;
        ENDPOINT = `${process.env.REACT_APP_EC2HOST}:7000/`;
    }

    //Socket info
    let socket = socketIOClient(ENDPOINT + sessionName);
    let sockId = 'empty';

    const socketStart=()=>{
        socket.on('connect', () => {
            sockId = socket.id;
        });
    };

    const getPolls = ()=>{
        if(user.type === 'Teacher'){
            axios.get(apiGatewayUrl + '/poll/retrieve', {params: {userId: user.User_ID}}).then(function (res) {
                if(res.data.anyPolls){
                    pollsInfo = res.data.polls;
                    generatePollList(res.data.polls);
                }
            })
        }
    };

    const generatePollList=(polls)=>{
        let newPollList = [...pollList];
        polls.map((poll, pollIndex) => {
            newPollList.push(<Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">

                    <Typography className={classes.heading}>{poll.pollName}</Typography>
                    <button className={classes.startButton} onClick={startPoll} name={pollIndex}>Start</button>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {poll.pollQuestions.map((question)=>{
                            return <div>
                                <h3>{question.prompt}</h3>
                                {question.options.map((option)=>{
                                    if(option.isCorrect){
                                        return <p className={classes.correct}>{option.option}</p>
                                    }else{
                                        return <p className={classes.incorrect}>{option.option}</p>
                                    }
                                })}
                            </div>
                        })}
                    </Typography>
                </AccordionDetails>
            </Accordion>)
        });
        setPollList(newQuizList);
    };

    let startQuiz = (e)=>{
        let index = parseInt(e.target.name);
        axios.get(apiGatewayUrl + '/poll/start', {params: {sessionName: sessionName}}).then(function (res) {
            //Send poll to students
            socket.emit('teacher start poll', sockId, pollsInfo[index]);
            console.log(pollsInfo[index]);
            pollAnswers = pollsInfo[index];
            setMonitor(
                <QuizMonitorContextProvider>
                    <QuizMonitor poll={pollsInfo[index]}/>
                </QuizMonitorContextProvider>
            )
        })
    };

    useEffect(()=>{
        //Generate poll components on teacher screen
        getPolls();
        socketStart();
    }, []);

    return (
        <div className={classes.root}>
            {pollList}
        </div>
    );
}