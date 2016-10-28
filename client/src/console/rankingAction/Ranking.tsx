import * as React from "react";
import {ConsoleState} from "../Entities";
import {DispatchActions} from "../DispatchActions";

interface Props {
    state: ConsoleState;
    rank: number;
    actions: DispatchActions;
}

export default class ConsoleRoot extends React.Component<Props, {}> {

    componentDidMount(){
        this.props.actions.fetchMostClicker()
    }


    render() {
        const clicker = this.props.state.clicker;
        if(!clicker) return <p>loading</p>;
        return (
            <div className="panel panel-default panel-top5 col-xs-10 col-xs-offset-1 text-center">
                <h1><span className="glyphicon glyphicon-star" style={{color: "orange"}} />最多Actionクリッカー</h1>
                <h3>{clicker.name}</h3>
                <h3>{clicker.num}回</h3>
            </div>
        )
    }
}
