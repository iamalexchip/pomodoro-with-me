import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as Routes from "./routes";

export const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/s/:sessionId/tasks" exact children={<Routes.SessionTasks />} />
      <Route path="/" exact children={<Routes.Home />} />
      <Route path="/" children={<Routes.PageNotFound />} />
    </Switch>
  </Router>
);
