import React, { useEffect } from "react";
import ClientCommunicator from "@kitware/trame-iframe";

type TrameIframeAppProps = {
  url: string;
  iframeId: string;
  onCommunicatorReady: (communicator: any) => void;
};

const TrameIframeApp: React.FC<TrameIframeAppProps> =
  function TrameIframeAppComponent({ url, iframeId, onCommunicatorReady }) {
    let listeners: Array<Function> = [];
    let iframeClientCommunicator: unknown = null;
    let iframe: HTMLElement | null = null;

    useEffect(() => {
      // lookup the iframe element
      iframe = document.getElementById(iframeId);

      if (iframe == null) {
        throw new Error("iframe not found");
      }

      const createClientCommunicator = () => {
        iframeClientCommunicator = new ClientCommunicator(iframe, url);
        onCommunicatorReady(iframeClientCommunicator);
      };
      listeners.push(createClientCommunicator);
      iframe.addEventListener("load", createClientCommunicator);

      return function unmount() {
        if (iframe) {
            listeners.forEach((l) => iframe.removeEventListener("load", l));
        }

        listeners = [];

        if (iframeClientCommunicator) {
            iframeClientCommunicator.cleanup();
        }
      };
    }, []);

    let content = null;

    if (url !== null) {
      content = <iframe id={iframeId} src={url} style={{ height: "100%", width: "100%" }} />;
    } else {
      content = (
        <div>
          An error occured while instanciating trame app. Please refer to
          viz-logs files.
        </div>
      );
    }
    return <div style={{ height: "100%", width: "100%" }}>{content}</div>;
  };

export default TrameIframeApp;
