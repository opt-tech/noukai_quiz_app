import {MyAction, ActionTypes, NoukaiState} from "./Entities";
import objectAssign = require('object-assign');

const initialState: NoukaiState = {questions: [], questionNum: 0, isBetweenQuiz: true, isCorrectLastQuiz: null, answeredNum: 0};

export function noukai(state: NoukaiState = initialState, action: MyAction): NoukaiState {
    console.log(action);
    console.log(state);
    switch (action.type) {
        case ActionTypes.LOAD_QUESTIONS:
            return objectAssign({}, state, {questions: action.questions});
        case ActionTypes.SEND_MESSAGE:
            console.log("sended");
            return state;
        case ActionTypes.RESET_ANSWERED_COUNT:
            return objectAssign({}, state, {answeredNum: 0});
        case ActionTypes.RECEIVE_MESSAGE:
            const obj = JSON.parse(action.serverMessage);
            if(obj.quizNum !== undefined){
                //show next quiz
                return objectAssign({}, state, {questionNum: obj.quizNum-1, isBetweenQuiz: false});
            }else if (obj.isCorrect !== undefined){
                //show 正解表彰後にお待ちください画面
                return objectAssign({}, state, {isBetweenQuiz: true, isCorrectLastQuiz: obj.isCorrect});
            }else if(obj === "p"){
                // pingなのでしめやかに無視
                return state;
            }else if(obj.answeredNum !== undefined){
                //show answered number
                return objectAssign({}, state, {answeredNum: obj.answeredNum});
            }else{
                alert("somethins wrong" + obj);
                return state;
            }
        case ActionTypes.WEBSOCKET_CONNECT_SUCCESS:
            return objectAssign({}, state, {ws: action.ws});
        case ActionTypes.FINISH_CORRECT_DISPLAY:
            return objectAssign({}, state, {isCorrectLastQuiz: null});
        default:
            return state;
    }
}