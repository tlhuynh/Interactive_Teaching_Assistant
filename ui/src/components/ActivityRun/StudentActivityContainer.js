//General
import React, {Component, useContext, useEffect, useState} from 'react';

import socketIOClient from "socket.io-client";
import StudentQuiz from "./StudentQuiz";
import {StudentActivityContext} from "./StudentActivityContext";

export default function StudentActivityContainer({user, sessionName, sessionId}) {
    const [activity, setActivity] = useState('no activity started');
    const {open, setOpen, answersInfo, setAnswersInfo} = useContext(StudentActivityContext);

    let currentQuiz = null;
    let currentAnswers = null;

    let ENDPOINT = '';
    if(process.env.REACT_APP_DEPLOY === "False"){
        ENDPOINT = 'http://localhost:7000/';
    }else{
        ENDPOINT = `${process.env.REACT_APP_EC2HOST}:7000/`;
    }
    //Socket info
    let socket = socketIOClient(ENDPOINT + sessionName);
    let sockId = 'empty';

    //Start listening when the component mounts
    useEffect(()=>{
        socketStart();
    },[]);

    const socketStart=()=>{
        socket.on('connect', () => {
            console.log('connected to session socket communication. Ready to accept Quizzes.')
            sockId = socket.id;
            listen();
        });
    };

    const setAnswers = (answers) =>{
        console.log(answers);
        currentAnswers = answers;
    };

    let handleQuizSubmission = () =>{
        console.log(currentAnswers);
        socket.emit('student submit quiz', currentAnswers, user.User_ID, sessionId);
        console.log('Quiz Submitted!');
    };

    let listen=()=>{
       socket.on('quiz for students', (teacherSockId, quiz)=>{
           console.log(quiz);
           currentQuiz = quiz;
           setOpen(true);
           //remove any data from any past quizzes run
           setActivity(null);
           setActivity(<StudentQuiz quiz={quiz} socket={socket} user={user} sessionId={sessionId} setAnswers = {setAnswers} />);
       });
        socket.on('teacher end quiz from server', (quizId)=>{
            if(currentQuiz.quizId === quizId){
                handleQuizSubmission();
                setOpen(false);
                alert("Teacher has ended the quiz");
            }
        });
    };

    return(
        <div>
            {activity}
        </div>
    )


}
