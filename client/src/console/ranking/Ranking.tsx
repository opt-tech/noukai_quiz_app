import * as React from "react";
import {ConsoleState, Score} from "../Entities";
import {List} from "immutable";
import {browserHistory} from "react-router";
import {DispatchActions} from "../DispatchActions";

interface Props {
    state: ConsoleState;
    actions: DispatchActions;
}

interface State {
    ranking: List<Score>;
}


export default class ConsoleRoot extends React.Component<Props, State> {

    state: State = {ranking: List.of<Score>()};

    componentDidMount(){
        this.props.actions.rankList()
    }

    goNext(rank: number){
        if(rank <= 5) return;

        function calcTime(rank: number): number{
            if(rank <= 10) return 1000;
            if(rank <= 50) return 200;
            return 0
        }

        setTimeout(() => {
            const score = this.props.state.ranking[rank -1];
            console.log(score);
            const ranking = this.state.ranking.push(score);
            this.setState({ranking: ranking});
            this.goNext(rank -1)
        }, calcTime(rank));
    }

    render() {
        const rankASC = this.state.ranking.reverse();
        const ranks = rankASC.map((score: Score) =>
          <li key={score.rank} className="list-group-item text-center">
              <span className="glyphicon glyphicon-star" style={{color: "orange"}} />
              {score.rank}位 {score.name}： 正解数 {score.correctNum}, 回答時間 {score.time} 秒
          </li>);

        let nextButton = <h3 className="text-center">50位 〜 6位</h3>;
        if (rankASC.size === 0){
            nextButton = <button className="btn btn-danger btn-lg center-block" onClick={() => this.goNext.bind(this)(this.props.state.ranking.length)}>スタート</button>
        }else if (rankASC.get(0).rank === 6){
            nextButton = <button className="btn btn-danger btn-lg center-block" onClick={() => browserHistory.push("/ranking/5")}>第5位</button>;
        }
        return (
            <div className="ranking container">
                <div className="row">
                    <div className="panel panel-default panel-ranking col-xs-10 col-xs-offset-1">
                        <h2 className="text-center">ランク発表</h2>
                        {nextButton}
                    </div>
                </div>
                <ul className="list-group">
                    {ranks}
                </ul>
            </div>
        )
    }
}
