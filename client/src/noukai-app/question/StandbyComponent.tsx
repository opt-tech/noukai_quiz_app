import * as React from "react";
import {NoukaiState} from "../Entities";
import {DispatchActions} from "../DispatchActions";

interface Props {
    state: NoukaiState;
    actions: DispatchActions;
}

export default class StandbyComponent extends React.Component<Props, {}> {

    render() {
        const noukaiState = this.props.state;
        if(noukaiState.isCorrectLastQuiz !== null){
            //20秒間、正解/不正解を表示後にisCorrectLastQuizをnullに戻す
            console.log("timeout start");
            setTimeout(() => {
                console.log("timeout done");
                this.props.actions.finishCorrectDisplay()
            }, 20000);
            if(noukaiState.isCorrectLastQuiz) return (
                <div className="row">
                    <div className="blinking"></div>
                    <div className="panel panel-correct panel-default col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                        <h3 className="text-center">正解です！！！</h3>
                    </div>
                </div>
            );
            return (
                <div className="row">
                    <div className="panel panel-wrong panel-default col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                        <h3 className="text-center">不正解です。。。</h3>
                        <img src="/public/batu.png" className="center-block img-responsive" />
                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="panel panel-standby panel-default col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                    <h4 className="text-center">次の問題までスクリーンをご覧ください。</h4>
                </div>
            </div>
        );
    }
}