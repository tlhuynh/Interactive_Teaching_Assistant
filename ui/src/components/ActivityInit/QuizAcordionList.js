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

import QuizMonitor from "../ActivityMonitor/QuizMonitor";
import {QuizMonitorContextProvider} from "../ActivityMonitor/QuizMonitorContext";
import Button from "@material-ui/core/Button";

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
        display:' inline-block',
        position: 'absolute',
        right: '50px',
        borderRadius: '10px',
        boxSizing: 'border-box',
        textDecoration:'none',
        fontWeight: '300',
        color: '#000000',
        backgroundColor:'#dfe5e8',
        '&:hover': {
            backgroundColor: '#eaeaea',
            cursor: 'pointer',
        },
        textAlign:'center',
    },
    hidden: {
       display: 'none'
    }

}));

export default function QuizAccordionList({user, sessionName}) {
    const classes = useStyles();
    const [quizList, setQuizList] = useState([]);
    const {monitor, setMonitor, quizSocket, setQuizSocket, open, setOpen, activityRunning, setActivityRunning} = useContext(ActivityMonitorContext);
    let quizzesInfo = [];
    let apiGatewayUrl = '';
    let quizAnswers = {};
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

    const getQuizzes = ()=>{
        if(user.type === 'Teacher'){
            axios.get(apiGatewayUrl + '/quiz/retrieve', {params: {userId: user.User_ID}}).then(function (res) {
                if(res.data.anyQuizzes){
                    quizzesInfo = res.data.quizzes;
                    generateQuizList(res.data.quizzes);
                }
            })
        }
    };

    const generateQuizList=(quizzes)=>{
        let newQuizList = [...quizList];
        quizzes.map((quiz, quizIndex) => {
            newQuizList.push(<Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">

                    <Typography className={classes.heading}>{quiz.quizName}</Typography>
                    <button className={classes.startButton} onClick={startQuiz} name={quizIndex}>Start</button>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {quiz.quizQuestions.map((question)=>{
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
        setQuizList(newQuizList);
    };

    let startQuiz = (e)=>{
        let index = parseInt(e.target.name);
        axios.get(apiGatewayUrl + '/quiz/start', {params: {sessionName: sessionName}}).then(function (res) {
            //Send quiz to students
            socket.emit('teacher start quiz', sockId, quizzesInfo[index]);
            console.log(quizzesInfo[index]);
            quizAnswers = quizzesInfo[index];
            setOpen(true);
            setActivityRunning(true);
            //Clear any past monitor
            setMonitor(null)
            setMonitor(<QuizMonitorContextProvider><QuizMonitor quiz={quizzesInfo[index]}/></QuizMonitorContextProvider>)
        })
    };

    let resumeQuizMonitor = () => {
      setOpen(true);
    };

    useEffect(()=>{
        //Generate quiz components on teacher screen
        getQuizzes();
        socketStart();
    }, []);

    return (
        <div className={classes.root}>
            <Button className={!activityRunning ? classes.hidden : ""} onClick = {resumeQuizMonitor}>Resume Quiz Monitor</Button>
            {quizList}
        </div>
    );
}