import {connect} from "react-redux";
import {Dispatch} from "redux";
import Ranking from "./Ranking";
import {DispatchActions} from "../DispatchActions";

function mapStateToProps(state: any):any {
    return { state: state.consoleCommand };
}

function mapDispatchToProps(dispatch: Dispatch<any>):any {
    return {
        actions: new DispatchActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);