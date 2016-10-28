import {ActionTypes, ConsoleState, MyAction} from "./Entities";
import {OrderedSet} from "immutable";
import objectAssign = require('object-assign');

export const initialState: ConsoleState = {showedQuizs: OrderedSet.of<number>(), showedAnswers: OrderedSet.of<number>(), ranking: [], clicker: null, questions: []};

export function consoleCommand(state: ConsoleState = initialState, action: MyAction): ConsoleState {
    //console.log(action.type); //check which action has occurred;
    switch (action.type) {
        case ActionTypes.LOAD_QUESTIONS:
            return objectAssign({}, state, { questions: action.questions });
        case ActionTypes.SHOW_QUIZ:
            const quizList = state.showedQuizs.add(action.num);
            console.log('showed quizList -->', JSON.stringify(quizList));
            return objectAssign({}, state, { showedQuizs: quizList });
        case ActionTypes.SHOW_ANSWER:
            const answerList = state.showedAnswers.add(action.num);
            console.log('showed quizList -->', JSON.stringify(answerList));
            return objectAssign({}, state, { showedAnswers: answerList });
        case ActionTypes.HTTP_FAILURE:
            console.log('http failed -->', action);
            return state;
        case ActionTypes.SHOW_RANKING:
            return objectAssign({}, state, { ranking: action.ranking });
        case ActionTypes.SHOW_CLICKER:
            return objectAssign({}, state, { clicker: action.clicker });
        default:
            return state;
    }
}
