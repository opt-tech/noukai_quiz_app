import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router";
import Root from "./Root";
import NotFound from "./NotFound";
import ConsoleRoot from "./console/buttons/Root";
import RankingRoot from "./console/ranking/Root";
import RankingTop5Root from "./console/rankingTop5/Root";
import RankingActionRoot from "./console/rankingAction/Root";
import NoukaiRoot from "./noukai-app/question/Root";
import LoginRoot from "./noukai-app/login/Root";
import {Provider} from "react-redux";
import store from "./Store";
import {Paths} from "./Entities";

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={Root} >
                <Route path={Paths.CONSOLE} component={ConsoleRoot} />
                <Route path={Paths.RANKING} component={RankingRoot} />
                <Route path={Paths.MOST_CLICKER} component={RankingActionRoot} />
                <Route path={Paths.RANKING_TOP5} component={RankingTop5Root} />
                <Route path={Paths.NOUKAI_LOGIN} component={LoginRoot} />
                <Route path={Paths.NOUKAI} component={NoukaiRoot} />
                <Route path="*" component={NotFound} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
