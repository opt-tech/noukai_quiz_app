import {IQuestion, NumByChoice} from "../Entities";

export interface NoukaiState {
    questions: IQuestion[];
    questionNum: number;
    ws?: WebSocket;
    isBetweenQuiz: boolean;
    isCorrectLastQuiz?: boolean;
    answeredNum: number;
    numByChoices: NumByChoice[];
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
    numByChoices?: NumByChoice[];
}

export class ActionTypes{
    static FINISH_CORRECT_DISPLAY = 'FINISH_CORRECT_DISPLAY';
    static SEND_MESSAGE = 'SEND_MESSAGE';
    static RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
    static WEBSOCKET_CONNECT_SUCCESS = 'WEBSOCKET_CONNECT_SUCCESS';
    static RESET_ANSWERED_COUNT = "RESET_ANSWERED_COUNT";
    static LOAD_QUESTIONS = 'LOAD_QUESTIONS';
    static LOAD_NUM_BY_CHOICES = 'LOAD_NUM_BY_CHOICES';
    static HTTP_FAILURE = 'HTTP_FAILURE';
}
