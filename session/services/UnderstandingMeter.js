class UnderstandingMeter{
    /**
    * Creating an understanding meter class
    * @constructor
    * @param {String} sessionName the name of the session the understanding meter is associated with
    * @param {Object} io socket.io server object
    * @param {object[]} history - record changes {K = time: S = Student: V = {score:int}}
    * */
    constructor(sessionName, io) {
        this.history = {};
        this.io = io;
        this.sessionName = sessionName;
        this.namespace = io.of('/' + sessionName);
        this.listen();
    }

    //Create a listener here and a function to handle connections from students then send to teacher
    listen() {
        this.namespace.on('connect', this.handleConnection);
    }

    handleConnection = (socket) => {
        socket.join(this.namespace); //Join the proper room

        socket.on('understanding meter update', (userId, teacherSocketIds, newValue) => {
            this.update(userId, teacherSocketIds, newValue);
        });
    };

    update(userId, teacherSocketIds, newValue){
        //socket.emit('update from server', {userId, newValue});
        let data = {};
        data.userId= userId;
        data.newValue = newValue;
        for(let socketId of teacherSocketIds) {
            this.io.to(socketId).emit(data);
        }
    }

    /**
     * Return the understanding score of the student
     * @returns {Number} student's score
     */
    getScore() {
        return this.score;
    }

    /**
     * Allows modification of score
     * @param {int} newScore - the new score to be updated
     */
    setScore(newScore) {

    }

    /**
     * Return the name of the user
     * @returns {string} user
     */
    getUser() {
        return this.user;
    }

    /**
     * Update the history object of the user
     */
    recordChange() {
    }

    /**
     * Return the current time of session during run time
     * @return {Date} currTime - the current time when the func is called
     */
    getTime() {
    }
}

module.exports = UnderstandingMeter;