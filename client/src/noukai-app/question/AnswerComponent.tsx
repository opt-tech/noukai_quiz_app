import * as React from "react";
import {NoukaiState, Answer} from "../Entities";
import {Range} from "immutable";
import {DispatchActions} from "../DispatchActions";
import objectAssign = require('object-assign');

interface Props {
    state: NoukaiState;
    actions: DispatchActions;
}

interface State {
    answer?: number;
    isAnswered: boolean;
}

export default class AnswerComponent extends React.Component<Props, State> {

    state: State = {answer: null, isAnswered: false};

    componentDidMount(): void {
        this.props.actions.resetAnsweredNum();
    };

    answer(): void {
        const answer: Answer = {questionId: this.props.state.questions[this.props.state.questionNum].id, answer: this.state.answer};
        if (!(answer.answer > 0)) { return }
        this.props.actions.sendAnswer(this.props.state.ws, answer);
        this.setState(objectAssign({}, this.state, {isAnswered: true}));
    };

    editAnswer(i:number): void {
        if(this.state.isAnswered) return;
        this.setState(objectAssign({}, this.state, {answer: i}));
    };

    render() {
        function answerComponent(){
            if(this.state.isAnswered) return <p>回答しました。</p>;
            const disabledClass = this.state.answer === null ? "disabled" : "";
            return (
                <div>
                    <p>※　一度「回答する」を選ぶと取り消せません。</p>
                    <button onClick={this.answer.bind(this)} className={"btn btn-warning " + disabledClass}>
                        回答する
                    </button>
                </div>
            );
        }

        const question = this.props.state.questions[this.props.state.questionNum];
        const radioButtons = Range(0, question.choices.length)
            .map((i:number) => {
                const key = i + 1; // 選択肢を1から始めるため
                const activeClass = this.state.answer === key ? "active" : "";
                const disabledClass = this.state.isAnswered ? "disabled" : "";
                return <button key={key}
                               type="button"
                               className={"list-group-item " + activeClass + " " + disabledClass}
                               onClick={() => this.editAnswer.bind(this)(key)}
                               children={question.choices[i]} />
            });

        return (
            <div className="row">
                <div className="panel panel-default panel-question-title col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <h2 className="text-center">第{question.id}問</h2>
                    <h3 className="text-center">{question.description}</h3>
                </div>
                <div className="panel panel-default panel-question col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <div className="panel-body text-center">
                        <div className="list-group">
                            {radioButtons}
                        </div>
                        {answerComponent.bind(this)()}
                        <p className="">現在の回答者数 {this.props.state.answeredNum}</p>
                    </div>
                </div>
            </div>
        )
    }
}