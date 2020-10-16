# Interactive_Teaching_Assistant

## Instructions to run the application
- Download and install docker here: https://docs.docker.com/get-docker/
- Download and install node here: https://nodejs.org/en/download/
- From the root directory run `docker-compose up --build`
- If the application runs successfully, it should appear on http://localhost:3000/
- To remove containers, run `docker-compose down`


## Instructions to run mocha test suite
- From the root directory run `docker-compose run test npm test`
- After changes to the code, run `docker-compose down` before running a new test run