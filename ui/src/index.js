import React from 'react';
import ReactDOM from 'react-dom';
//Meters components
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import LaunchScreen from "./components/Launch/LaunchScreen";
import Dashboard from "./components/Dashboard";
import ClassSession from "./components/SessionComps/ClassSession";
import exitTicket from "./components/ActivityCreation/ExitTicketCreation";
import StudentExitTicketDisplay from "./components/ActivityInit/StudentExitTicketDisplay";

ReactDOM.render(
  <React.StrictMode>
      <Router>
          <Switch>
              <Redirect exact from='/' to='/launch'/>
              <Route path='/launch' component={LaunchScreen} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/classSession' component={ClassSession} />
              <Route path='/exitTicket' component={exitTicket} />
              <Route path='/StudentExitTicketDisplay' component={StudentExitTicketDisplay} />
          </Switch>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
