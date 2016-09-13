import * as React from "react";

interface Props {
    children: any
}

export default class Root extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
