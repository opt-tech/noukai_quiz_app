export class Paths{
    static CONSOLE = 'console';
    static RANKING = 'ranking';
    static RANKING_TOP5 = 'ranking/:rank';
    static MOST_CLICKER = 'ranking/action';
    static NOUKAI = 'noukai/:userId/:dept';
    static NOUKAI_LOGIN = 'noukai_login';
}

export interface IQuestion {
    id: number;
    choices: string[];
    answer: number;
    description: string;
}