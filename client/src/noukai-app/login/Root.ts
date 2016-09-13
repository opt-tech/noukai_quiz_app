import {connect} from "react-redux";
import {Dispatch} from "redux";
import LoginRoot from "./LoginRoot";

function mapStateToProps(state: any):any {
    return {
        state: {}
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>):any {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRoot);