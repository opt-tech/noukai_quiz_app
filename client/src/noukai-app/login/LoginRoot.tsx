import * as React from "react";
import * as ReactDOM from "react-dom";
import {browserHistory} from "react-router";
import objectAssign = require('object-assign');
const Select = require('react-select');

interface Props {
    state: any;
}

interface State {
    name: string;
    deps: string;
}

// ご自由に変更してください。
const depsList: string[] = [
    "HackHack",
    "Blouson",
    "Brain Boost",
    "FACECARD",
    "コミュSHOW",
    "paycoin",
    "Ghostwriter",
    "マッスルドーム",
    "DOGScan",
    "Emo_buddy",
    "No Need for Reciept",
    "Otto! Map",
    "howshion",
    "My Pets",
    "エモーショナルカクテル",
    "ModerateClothes",
    "HandOut",
    "On You",
    "clear",
    "Cluster Translater",
    "SHREDULER",
    "JongHelper",
    "大人数時間調整アシスタント",
    "Shout",
    "NagaraMeshi",
    "KAOSS TAKT",
    "Photori",
    "強制学習装置",
    "College Share",
    "Grandea",
    "すぺちゃるペン",
    "パピコはんぶんこ！",
    "かしちゃいな",
    "「かってに服子ちゃん」",
    "ARTRUN",
    "Clover",
    "IKKYOKU",
    "Availee",
    "一夜一会",
    "エミル",
    "Otomo",
    "あなた，摂り過ぎていませんか？",
    "TutoReal",
    "Messenger(仮)",
    "pseudcussion",
    "MapCompass",
    "ManyMoney",
    "Smart Jaguchi",
    "watchMe",
    "待ち合わせ場所はここのはずだけど、あの子が見つからない！を解決するアプリ MeePa",
    "Miga",
    "かぎかいぎ",
    "Power of us",
    "あ、いなかったんで玄関先においときますね",
    "「MOBU」と「ONECO」",
    "TanguesTanguesRevolution",
    "絶対にスベってはいけない宴会",
    "Kashicari",
    "Satomimi",
    "My Block",
    "LOOK BOOK",
    "REMPI（レムピ）",
    "TakeU",
    "Ambient Maker",
    "あのね、",
    "HouseMate",
    "NEWS×MAP",
    "SHELF",
    "LOVER DUCK",
    "Semasky",
    "この中にはない",
    "ハッカソンには参加してない"
];

export default class ChatRoot extends React.Component<Props, State> {

    state: State = {name: "", deps: null};

    depsList: string[] = depsList;

    login(): void {
        if (this.state.name.trim() === '') return;
        browserHistory.push('/noukai/' + this.state.name + '/' + this.state.deps);
    };

    changeName(e:any): void {
        this.setState(objectAssign({}, this.state, {name: e.target.value}));
    };

    changeDeps(val: any) {
        this.setState(objectAssign({}, this.state, {deps: val.value}));
        const comp:any = ReactDOM.findDOMNode(this.refs["nameInput"]);
        comp.focus();
    }

    render() {
        const options = this.depsList.map((v: string) => {return { value: v, label: v }});
        return (
          <div className="login container">
              <div className="row">
                  <div className="panel panel-default col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
                      <div className="panel-body">
                          <div className="form-group">
                              <Select
                                placeholder="製品名（検索できます）"
                                name="form-field-name"
                                value={this.state.deps}
                                options={options}
                                onChange={this.changeDeps.bind(this)} />
                          </div>

                          <div className="form-group">
                              <input
                                onChange={this.changeName.bind(this)}
                                value={this.state.name}
                                className="form-control"
                                ref="nameInput"
                                placeholder="おなまえ" />
                          </div>

                          <div className="text-center">
                              <button onClick={this.login.bind(this)} className="btn btn-warning">スタート</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}
