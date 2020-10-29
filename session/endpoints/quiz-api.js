/**
 * Naming scheme: http://[Container Name]:[Container Port]
 */
const dbUrl = 'http://db:5000';
const Session = require("../services/Session.js");

module.exports = function(app, axios, io) {
    //keeps track of created sessions to prevent creating multiple sessions
    let currentQuizzes = [];

    app.post("/quiz/create", function(req, res) {
        // Get session creation data from post request
        let userId = req.body.userId;
        let quiz = req.body.quiz;
        let quizType = req.body.quizType;

        axios.post(dbUrl + '/quiz/create', {userId: userId, quiz: quiz, quizType: quizType}).then(function(response){
            res.send(response.data);
        }).catch(function(error){
            res.send(error);
        })
    });

    app.get("/quiz/retrieve", function(req, res) {
        //Get session creation data from post request
        let userId = req.query.userId;

        axios.get(dbUrl + '/quiz/retrieve', {params:{userId: userId}}).then(function(response){
            res.send(response.data);
        }).catch(function(error){
            res.send(error);
        });
    });


};