import {OrderedSet} from "immutable";
import {IQuestion} from "../Entities";

export interface ConsoleState {
    showedQuizs: OrderedSet<number>;
    showedAnswers: OrderedSet<number>;
    ranking: Score[];
    clicker?: Clicker;
    questions: IQuestion[];
}

export interface ResponseJson1 {
    num: number;
}

export interface Score {
    rank: number;
    name: string;
    correctNum: number;
    time: string;
}

export interface Clicker {
    num: number;
    name: string;
}

export interface MyAction {
    type: string;
    num?: number;
    msg?: string;
    ranking?: Score[];
    clicker?: Clicker;
    questions?: IQuestion[];
}

export class ConsoleMessage {
    constructor(public status: string, public message: string){}
}

export class ActionTypes{
    static LOAD_QUESTIONS = 'LOAD_QUESTIONS';
    static SHOW_QUIZ = 'SHOW_QUIZ';
    static SHOW_ANSWER = 'SHOW_ANSWER';
    static RANK_LIST = 'RANK_LIST';
    static HTTP_FAILURE = 'HTTP_FAILURE';
    static SHOW_RANKING = 'SHOW_RANKING';
    static SHOW_CLICKER = 'SHOW_CLICKER';
}
