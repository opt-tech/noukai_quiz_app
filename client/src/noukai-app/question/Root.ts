import {connect} from "react-redux";
import {Dispatch} from "redux";
import QuestionRoot from "./QuestionRoot";
import {DispatchActions} from "../DispatchActions";

function mapStateToProps(state: any, ownProps: any):any {
    return {
        noukaiState: state.noukai,
        userId: ownProps.params.userId,
        dept: ownProps.params.dept
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>):any {
    return {
        actions: new DispatchActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionRoot);