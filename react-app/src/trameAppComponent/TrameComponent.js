import React from "react";
import "./styleTrameComponent.css";

export default class TrameComponent extends React.Component {
  constructor(props) {
    super(props);

    this.initializeMessagesListeners();
  }

  initializeMessagesListeners() {
    if (!this.props.messagesToListen) {
      return;
    }
    window.addEventListener("message", (msg) => {
      if (!msg.data.emit) {
        return;
      }

      if (msg.data.emit in this.props.messagesToListen) {
        this.props.messagesToListen[msg.data.emit](msg.data.value);
      }
    });
  }

  render() {
    let content = null;

    if (this.props.url !== null) {
      content = <iframe id={this.props.componentId} src={this.props.url} />;
    } else {
      content = (
        <div>
          An error occured while instanciating trame app. Please refer to
          viz-logs files.
        </div>
      );
    }
    return <div className="TrameComponent">{content}</div>;
  }
}

TrameComponent.defaultProps = {
  componentId: "viewer",
  messagesToListen: {},
  url: null,
};
