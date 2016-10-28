import {IQuestion} from "../Entities";

export interface NoukaiState {
    questions: IQuestion[];
    questionNum: number;
    ws?: WebSocket;
    isBetweenQuiz: boolean;
    isCorrectLastQuiz?: boolean;
    answeredNum: number;
}

export class Answer{
    constructor(public questionId: number, public answer: number){}
}

export interface MyAction {
    type: string;
    serverMessage?: string;
    name?: string;
    ws?: WebSocket;
    questions?: IQuestion[];
}

export class ActionTypes{
    static FINISH_CORRECT_DISPLAY = 'FINISH_CORRECT_DISPLAY';
    static SEND_MESSAGE = 'SEND_MESSAGE';
    static RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
    static WEBSOCKET_CONNECT_SUCCESS = 'WEBSOCKET_CONNECT_SUCCESS';
    static RESET_ANSWERED_COUNT = "RESET_ANSWERED_COUNT";
    static LOAD_QUESTIONS = 'LOAD_QUESTIONS';
    static HTTP_FAILURE = 'HTTP_FAILURE';
}
