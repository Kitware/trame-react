import React, { useState, useEffect, useRef } from "react";
import { TrameIframeApp } from "trame-react";
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Slider,
  Switch,
} from "@patternfly/react-core";

function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout); // Clears the previous timeout
    timeout = setTimeout(() => func.apply(context, args), wait); // Sets a new timeout
  };
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  )
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function stateIsSync(localState, trameState) {
  const localStateKeys = Object.keys(localState);
  const trameStatekeys = Object.keys(trameState);

  for (let localKey of localStateKeys) {
    if (!trameStatekeys.includes(localKey) || !deepEqual(localState[localKey], trameState[localKey])) {
      return false;
    }
  }

  return true;
}

const Viewer = ({ viewerId, url }) => {
  const trameCommunicator = useRef(null);
  const synchronizeTrameState = useRef(null);

  const [viewerState, setViewerState] = useState({
    resolution: 20,
    interaction_mode: "interact",
  });

  useEffect(() => {
    synchronizeTrameState.current = debounce((viewerState) => {
      if (!trameCommunicator.current) {
        return;
      }
  
      trameCommunicator.current.state.get().then((trame_state) => {
        if (!stateIsSync(viewerState, trame_state)) {
          trameCommunicator.current.state.update(viewerState);
        }
      })
    }, 25);
  }, []);

  useEffect(() => {
    synchronizeTrameState.current(viewerState);
  }, [viewerState]);

  const resetCamera = (comm) => {
    console.debug("resetting camera");
    trameCommunicator.current.trigger("raise_error").catch((err) => {
      throw err;
    })
    trameCommunicator.current.trigger("reset_camera");
  };

  const resetResolution = (comm) => {
    console.debug("resetting resolution");
    trameCommunicator.current.trigger("reset_resolution");
  };

  const onViewerReady = (comm) => {
    trameCommunicator.current = comm;

    trameCommunicator.current.state.onReady(() => {
      trameCommunicator.current.state.watch(
        ["interactor_settings"],
        (interactor_settings) => {
          console.log({ interactor_settings });
        }
      );

      trameCommunicator.current.state.watch(["resolution", "interaction_mode"], (resolution, interaction_mode) => {
        setViewerState((prevState) => ({
          ...prevState,
          resolution,
          interaction_mode
        }));
      });
    });
  };

  return (
    <div className="viewer" style={{ height: "100%" }}>
      <Toolbar style={{ height: "10%"}}>
        <ToolbarContent>
          <ToolbarItem>
            <div style={{ "min-width": "200px" }}>
              <Slider
                min={3}
                max={60}
                step={1}
                inputLabel="resolution"
                value={viewerState.resolution}
                onChange={
                  (e, res) => {
                    setViewerState((prevViewerState) => ({
                      ...prevViewerState,
                      resolution: res,
                    }));
                  }
                }
              />
            </div>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" onClick={(e) => resetCamera()}>
              Reset Camera
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" onClick={(e) => resetResolution()}>
              Reset Resolution
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" onClick={(e) => trameCommunicator.current.trigger("get_number_of_cells").then(console.log)}>
              Get Number Of Cells
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              label={viewerState.interaction_mode}
              isChecked={viewerState.interaction_mode === "select"}
              onChange={(e, checked) => {
                setViewerState((prevViewerState) => ({
                  ...prevViewerState,
                  interaction_mode: checked ? "select" : "interact",
                }))
              }}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <TrameIframeApp
        style={{ height: "80%"}}
        iframeId={viewerId}
        url={url}
        onCommunicatorReady={onViewerReady}
      />
    </div>
  );
};

export default Viewer;
