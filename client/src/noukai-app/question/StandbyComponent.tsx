import * as React from "react";
import {Range} from "immutable";
import {NoukaiState} from "../Entities";
import {DispatchActions} from "../DispatchActions";

interface Props {
    state: NoukaiState;
    actions: DispatchActions;
}

export default class StandbyComponent extends React.Component<Props, {}> {

    componentDidMount(): void {
        this.props.actions.loadNumByChoices(this.props.state.questionNum + 1);//サーバ側の質問番号は1始まり
    };

    render() {
        const noukaiState = this.props.state;

        if(noukaiState.isCorrectLastQuiz !== null){
            const question = noukaiState.questions[noukaiState.questionNum];
            const choices = Range(0, question.choices.length)
                .map((i: number) => {
                    const numByChoice = noukaiState.numByChoices.filter(c => c.choice == i + 1);//サーバ側の選択番号は1始まり
                    return <li key={i + 1} className="list-group-item list-group-item-success">
                        {question.choices[i]}
                        <span className="badge badge-default">{(numByChoice.length > 0) ? numByChoice[0].num : 0}</span>
                    </li>
                });

            return (
                <div className="row">
                    <div className="panel panel-default panel-question-title col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                        <h4 className="text-center">集計結果</h4>
                        <h3 className="text-center">{question.description}</h3>
                    </div>
                    <div className="panel panel-default panel-question col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                        <div className="panel-body text-center">
                            <ul className="list-group">
                                {choices}
                            </ul>
                            <p className="">現在の回答者数 {noukaiState.answeredNum}</p>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="row">
                <div className="panel panel-standby panel-default col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <h4 className="text-center">次の質問が始まるまでお待ちください。</h4>
                </div>
            </div>
        );
    }
}