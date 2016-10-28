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

        const clickableSay = this.state.isAction ? " < にゃ〜ん" : "";
        return (
            <div className="question container">
                {mainContents}
                <footer className="footer">
                    <div className="footer-content">
                         <div className="text-center">
                            <img
                                alt="daisuke"
                                onClick={this.doAction.bind(this)}
                                className="img-circle"
                                src="/public/maru.png" />
                            <span style={{verticalAlign: "middle"}}>{clickableSay}</span>
                            <ReactSound
                                url="/public/sound.mp3"
                                playStatus={this.state.isAction ? ReactSound.status.PLAYING : ReactSound.status.STOPPED}
                                onFinishedPlaying={() => this.setState(objectAssign({}, this.state, {isAction: false}))} />
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}