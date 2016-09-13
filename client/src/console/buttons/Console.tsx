import * as React from "react";
import {Range} from "immutable";
import {ConsoleState} from "../Models";
import {browserHistory} from "react-router";
import {DispatchActions} from "../DispatchActions";

interface Props {
    state: ConsoleState;
    actions: DispatchActions;
}

export default class ConsoleRoot extends React.Component<Props, {}> {

    componentDidMount(){
        this.props.actions.loadQuestions();
    }

    showQuiz(n: number){
        this.props.actions.showQuiz(n)
    }

    showAnswer(n: number){
        this.props.actions.showAnswer(n)
    }

    render() {
        const buttons = Range(1, this.props.state.questions.length + 1).map((n)=> {
            const quizClass = this.props.state.showedQuizs.contains(n) ? 'btn-default' : 'btn-primary';
            const answerClass = this.props.state.showedAnswers.contains(n) ? 'btn-default' : 'btn-primary';
            return (
                <div key={n}>
                    <p>問題{n}</p>
                    <button type="button" className={`btn ${quizClass}`} style={{margin: "15px"}}　onClick={() => this.showQuiz.bind(this)(n)}>問題{n}</button>
                    <button type="button" className={`btn ${answerClass}`} style={{margin: "15px"}}　onClick={() => this.showAnswer.bind(this)(n)}>回答{n}</button>
                </div>
            )
        });

        return (
            <div>
                <h2>管理コンソール</h2>
                {buttons}
                <button className="btn btn-primary" style={{margin: "15px"}}　onClick={() => browserHistory.push('/ranking')}>go ランキング</button>
            </div>
        )
    }
}
