import * as React from "react";
import {ConsoleState} from "../../Entities";
import * as TestUtils from "react-addons-test-utils";
import {DispatchActions} from "../../DispatchActions";
import Console from "../Console"
import {initialState} from "../../Reducer";

describe('Console', () => {

    it('rendering', () => {
        const actions: DispatchActions = new DispatchActions(() => fail('Unwanted call'));

        const state: ConsoleState = initialState;
        TestUtils.renderIntoDocument(
          <Console state={state} actions={actions} />
        );
    });
});