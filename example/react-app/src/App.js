import React from 'react';
import Viewer from './Viewer';
import { Page, PageSection } from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page className="full-height">
        <PageSection
          className="full-height"
          style={{ padding: '0px', width: '50%' }}
        >
          <Viewer url="http://localhost:8080/" viewerId="viewer1" />
        </PageSection>
        <PageSection
          className="full-height"
          style={{ padding: '0px', width: '50%' }}
        >
          <Viewer url="http://localhost:8081/" viewerId="viewer2" />
        </PageSection>
      </Page>
    );
  }
}
