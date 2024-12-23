# trame-react: a trame-iframe client wrapper for React-based application

`trame-react` provides a React wrapper around the [trame-iframe](https://www.npmjs.com/package/@kitware/trame-iframe) package.  
Use it if you want to integrate a trame-based application inside a react-based application through an iframe.  
Just run `npm install @kitware/trame-react` in your project. `react` and `react-dom` are peer dependencies of this library.

## Example
The [example](./example) shows how you can use trame-react to integrate multiple trame application through an iframe.  
```bash
cd example/trame-app
pip install -r requirements.txt
python app.py --server --port 8080
python app.py --server --port 8081
cd ../react-app
npm install
npm run start
```

## Usage
```js
import { TrameIframeApp } from '@kitware/trame-react';

// callback that will be called when the iframe and the trame application are ready
const onViewerReady = (communicator) => {
    communicator.state.onReady(() => {
        communicator.state.watch(['a'], (a) => {
            // ...
        })
    })
}

// the HTML id which is going to be assigned to the actual iframe tag
const iframeId = "my_iframe";

// the URL of the remote trame server
const url = "https://trame.app";

<TrameIframeApp
    style={{ height: '80%' }}
    iframeId={iframeId}
    url={url}
    onCommunicatorReady={onViewerReady}
/>
```
