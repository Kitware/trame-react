import React, { useEffect } from 'react';
import ClientCommunicator from '@kitware/trame-iframe';

type TrameIframeAppProps = {
  url: string;
  iframeId: string;
  onCommunicatorReady: (communicator: unknown) => void;
};

const TrameIframeApp: React.FC<TrameIframeAppProps> =
  function TrameIframeAppComponent({ url, iframeId, onCommunicatorReady }) {
    let listeners: Array<(e: Event) => void> = [];
    let iframeClientCommunicator: unknown = null;
    let iframe: HTMLElement | null = null;

    useEffect(() => {
      iframe = document.getElementById(iframeId);

      if (iframe == null) {
        throw new Error(`iframe ${iframeId} not found`);
      }

      const createClientCommunicator = () => {
        iframeClientCommunicator = new ClientCommunicator(iframe, url);
        onCommunicatorReady(iframeClientCommunicator);
      };
      listeners.push(createClientCommunicator);
      iframe.addEventListener('load', createClientCommunicator);

      return function unmount() {
        if (iframe) {
          listeners.forEach((l) => iframe.removeEventListener('load', l));
        }

        listeners = [];

        if (iframeClientCommunicator) {
          iframeClientCommunicator.cleanup();
        }
      };
    }, []);

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <iframe
          id={iframeId}
          src={url}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    );
  };

export default TrameIframeApp;
