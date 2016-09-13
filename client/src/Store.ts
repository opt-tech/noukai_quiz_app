import {createStore, combineReducers} from "redux";
import {consoleCommand} from "./console/Reducer";
import {noukai} from "./noukai-app/Reducer";

const store = createStore(
    combineReducers({
        noukai,
        consoleCommand
    })
);

export default store
