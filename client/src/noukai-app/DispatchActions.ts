import "isomorphic-fetch";
import {Answer, ActionTypes} from "./Entities";
import {IQuestion} from "../Entities";
import {failCB} from "../console/DispatchActions";

export class DispatchActions {
  constructor(private dispatch: (action: any) => any){
    this.dispatch = dispatch
  }

  public sendAnswer(ws: WebSocket, answer: Answer) {
    ws.send(JSON.stringify(answer));
    this.dispatch({ type: ActionTypes.SEND_MESSAGE});
  }

  public doAction(ws: WebSocket) {
    const action = {action: true};
    ws.send(JSON.stringify(action));
    this.dispatch({ type: ActionTypes.SEND_MESSAGE})
  }

  public finishCorrectDisplay() {
    this.dispatch({ type: ActionTypes.FINISH_CORRECT_DISPLAY})
  }

  public requestWebSocketConnection(name: string, dept: string) {
    if (typeof(WebSocket) == 'undefined') {
      alert('WebSocketに対応してないブラウザです。新しめのブラウザ・スマホでお試しください。');
      return
    }

    const ws = new WebSocket("ws://" + location.host + "/quiz?name=" + name + "&dept=" + dept);

    ws.onopen = ((e: Event) => {
      console.log("connected");
    });

    ws.onmessage = ((e: MessageEvent) => {
      console.log("receive message: " + e.data);
      this.dispatch({ type: ActionTypes.RECEIVE_MESSAGE, serverMessage: e.data})
    });

    ws.onclose = ((e: CloseEvent) => {
      console.log("disconnected");
      alert("接続が切れました。リロードしてください。")
    });
    this.dispatch({ type: ActionTypes.WEBSOCKET_CONNECT_SUCCESS, ws: ws});
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

  public resetAnsweredNum() {
    this.dispatch({ type: ActionTypes.RESET_ANSWERED_COUNT})
  }
}
