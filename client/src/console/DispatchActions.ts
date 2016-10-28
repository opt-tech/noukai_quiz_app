import "isomorphic-fetch";
import {ActionTypes, Score, Clicker} from "./Entities";
import {IQuestion} from "../Entities";

export const failCB = (err: Error):void => {
  console.error(err);
  alert("予期せぬ例外が発生しました。リロードしてください。");
  return;
};

export class DispatchActions {
  constructor(private dispatch: (action: any) => any){
    this.dispatch = dispatch
  }

  public loadQuestions(){
    const successCB = (response: IResponse):Promise<void> => {
      if(response.status === 200){
        return response.json<IQuestion[]>().then(json => this.dispatch({ type: ActionTypes.LOAD_QUESTIONS, questions: json}));
      }
      this.dispatch({ type: ActionTypes.HTTP_FAILURE, msg: 'quiz command is failed!'});
      return
    };

    return fetch(`/api/questions`, {method: 'GET'})
      .then(successCB)
      .catch(failCB)
  }

  public showQuiz(num: number){
    const successCB = (response: IResponse):Promise<void> => {
      if(response.status === 200){
        return this.dispatch({ type: ActionTypes.SHOW_QUIZ, num: num})
      }
      this.dispatch({ type: ActionTypes.HTTP_FAILURE, msg: 'quiz command is failed!'});
      return
    };

    return fetch(`/api/quizs/${num}`, {method: 'POST'})
      .then(successCB)
      .catch(failCB)
  }

  public showAnswer(num: number):Promise<any> {
    const successCB = (response: IResponse):Promise<void> => {
      if(response.status === 200){
        return this.dispatch({ type: ActionTypes.SHOW_ANSWER, num: num})
      }
      this.dispatch({ type: ActionTypes.HTTP_FAILURE, msg: 'quiz command is failed!'});
      return
    };

    return fetch(`/api/answers/${num}`, {method: 'POST'})
      .then(successCB)
      .catch(failCB)
  }

  public rankList() {
    const successCB = (response: IResponse):Promise<void> => {
      if(response.status === 200){
        return response.json<Score[]>().then(json => this.dispatch({ type: ActionTypes.SHOW_RANKING, ranking: json}));
      }
      this.dispatch({ type: ActionTypes.HTTP_FAILURE, msg: 'rankList command is failed!'});
      return
    };

    return fetch('/api/rankList', {method: 'GET'})
      .then(successCB)
      .catch(failCB)
  }

  public fetchMostClicker() {
    const successCB = (response: IResponse):Promise<void> => {
      if(response.status === 200){
        return response.json<Clicker>().then(json => this.dispatch({ type: ActionTypes.SHOW_CLICKER, clicker: json}));
      }
      this.dispatch({ type: ActionTypes.HTTP_FAILURE, msg: 'mostClicker command is failed!'});
      return
    };

    return fetch('/api/mostClicker', {method: 'GET'})
      .then(successCB)
      .catch(failCB)
  }
}