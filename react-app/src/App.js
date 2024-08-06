import React from "react";
import "./styles.css";

import TrameComponent from "./trameAppComponent/TrameComponent";

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resolution: 6,
    };
  }

  sendToTrame() {
    const resolution = document.getElementById("resolutionSlider").value;
    document
      .querySelector("iframe")
      .contentWindow.postMessage(
        { emit: "react-to-trame", value: resolution.toString() },
        "*"
      );
  }

  updateResolution(resolution) {
    this.setState({
      resolution,
    });
  }

  render() {
    const trameMessagesToListen = {
      trame_to_react: this.updateResolution.bind(this),
    };

    return (
      <div className="App">
        <div class="sliderContainer">
          <p>
            Resolution
            <input
              id="resolutionSlider"
              type="range"
              min="3"
              max="60"
              step="1"
              value={this.state.resolution}
              onMouseUp={(e) => this.sendToTrame(e.target.value)}
              onChange={(e) => this.updateResolution(e.target.value)}
            />
          </p>
        </div>
        <TrameComponent
          componentId="viewer"
          url="http://localhost:8080/"
          messagesToListen={trameMessagesToListen}
        />
      </div>
    );
  }
}
