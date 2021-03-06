import React, { createContext, useState } from "react";

const QuizContext= createContext({});

const QuizContextProvider = ({ children }) => {
    const [quizInfo, setQuizInfo] = useState({quizName: '', quizQuestions: []});

    return (
        <QuizContext.Provider value={{ quizInfo, setQuizInfo }}>
            {children}
        </QuizContext.Provider>
    );
};

export { QuizContext, QuizContextProvider };