import * as React from "react";
import {NoukaiState} from "../Entities";
import StandbyComponent from "./StandbyComponent";
import AnswerComponent from "./AnswerComponent";
import {DispatchActions} from "../DispatchActions";
import objectAssign = require('object-assign');
const ReactSound = require('react-sound');

interface Props {
    noukaiState: NoukaiState;
    actions: DispatchActions;
    userId: string;
    dept: string;
}

interface State {
    isAction: boolean;
}

export default class QuestionRoot extends React.Component<Props, State> {

    state: State = {isAction: false};

    componentDidMount(): void {
        this.props.actions.requestWebSocketConnection(this.props.userId, this.props.dept);
        this.props.actions.loadQuestions();
    };

    doAction(): void{
        if(this.state.isAction) return;
        this.props.actions.doAction(this.props.noukaiState.ws);
        this.setState(objectAssign({}, this.state, {isAction: true}));
    }

    render() {
        const mainContents = this.props.noukaiState.isBetweenQuiz
          ? <StandbyComponent state={this.props.noukaiState} actions={this.props.actions} />
          : <AnswerComponent state={this.props.noukaiState} actions={this.props.actions} />;

        return (
            <div className="question container">
                {mainContents}
                <footer className="footer">
                    <div className="footer-content">
                         <div className="text-center">
                            <span style={{verticalAlign: "middle"}}>勝手に後夜祭！ 2017</span>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}