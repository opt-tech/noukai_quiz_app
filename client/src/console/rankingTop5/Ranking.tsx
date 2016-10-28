import * as React from "react";
import {ConsoleState, Score} from "../Entities";
import {browserHistory} from "react-router";
import {DispatchActions} from "../DispatchActions";

interface Props {
  state: ConsoleState;
  rank: number;
  actions: DispatchActions;
}

export default class ConsoleRoot extends React.Component<Props, {}> {

  componentDidMount(){
    this.props.actions.rankList()
  }


  render() {
    if(this.props.state.ranking.length === 0) return <p>loading</p>;
    const score: Score = this.props.state.ranking.filter(v => v.rank === this.props.rank)[0];
    let nextButton:any = null;
    if(score.rank > 1){
      nextButton = <button className="btn btn-danger btn-lg" onClick={() => browserHistory.push(`/ranking/${score.rank -1 }`)}>第{score.rank -1 }位</button>;
    }else{
      nextButton = <button className="btn btn-info one-more-thing" onClick={() => browserHistory.push(`/ranking/action`)}>もうちっとだけ続くんじゃ</button>;
    }

    return (
      <div className="panel panel-default panel-top5 col-xs-10 col-xs-offset-1 text-center">
        <h1><span className="glyphicon glyphicon-star" style={{color: "orange"}} />第{score.rank}位</h1>
        <h3>{score.name}</h3>
        <h4>正解数 : {score.correctNum}, 回答時間 : {score.time} 秒</h4>
        {nextButton}
      </div>
    )
  }
}
