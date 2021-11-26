const reducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...state, isOn: true, markPath: state.distance ? true : false };
    case "STOP":
      return { ...state, isOn: false };
    case "RUNNER":
      return {
        ...state,
        hrs: action.payload.hrs,
        min: action.payload.min,
        sec: action.payload.sec,
      };
    case "RUN_MS":
      return {
        ...state,
        mSec: state.mSec + 1,
      };
    case "RESET_MS":
      return {
        ...state,
        mSec: 0,
      };
    case "RESET":
      return {
        ...state,
        mSec: 0,
        sec: 0,
        min: 0,
        hrs: 0,
        isOn: false,
        path: 0,
        markPath: 0,
        distance: 0,
      };
    case "SET_PATH":
      return { ...state, path: action.payload };
    case "SET_DISTANCE":
      return { ...state, distance: action.payload };

    default:
      throw new Error();
  }
};

const SW = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    mSec: 0,
    sec: 0,
    min: 0,
    hrs: 0,
    isOn: false,
    path: 0,
    markPath: false,
    distance: 0,
  });

  const start = () => {
    dispatch({ type: "START" });
  };

  const stop = () => {
    dispatch({ type: "STOP" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  React.useEffect(() => {
    let timeWorker;
    if (state.isOn) {
      if (!state.path) {
        dispatch({
          type: "SET_PATH",
          payload: Math.floor(new Date().getTime() / 1000),
        });
      }

      if (state.markPath) {
        dispatch({
          type: "SET_PATH",
          payload: Math.floor(new Date().getTime() / 1000) - state.distance,
        });
      }

      timeWorker = setInterval(() => {
        var tempNow = Math.floor(new Date().getTime() / 1000);

        dispatch({ type: "SET_DISTANCE", payload: tempNow - state.path });

        var hours = Math.floor(
          (state.distance % (1000 * 60 * 60 * 24)) / (60 * 60)
        );
        var minutes = Math.floor((state.distance % (1000 * 60 * 60)) / 60);
        var seconds = Math.abs(
          Math.floor((state.distance % (1000 * 60)) - minutes * 60)
        );

        dispatch({
          type: "RUNNER",
          payload: {
            hrs: hours,
            min: Math.abs(minutes - state.hrs * 60),
            sec: seconds,
          },
        });

        state.mSec == 99
          ? dispatch({ type: "RESET_MS" })
          : dispatch({ type: "RUN_MS" });
      }, 10);
    }

    return () => clearInterval(timeWorker);
  }, [state.path, state.isOn, state.mSec, state.distance]);

  return (
    <div className="main-div">
      <p className="digit">
        {state.hrs.toString().padStart(2, "0")}:
        {state.min.toString().padStart(2, "0")}:
        {state.sec.toString().padStart(2, "0")}:
        {state.mSec.toString().padStart(2, "0")}
      </p>
      <div className="button-div">
        {!state.isOn && (
          <button className="button" onClick={start}>
            {!state.mSec ? "Start" : "Resume"}
          </button>
        )}
        {state.isOn && (
          <button className="button yellow-btn" onClick={stop}>
            Pause
          </button>
        )}
        <button
          className="button green-btn"
          disabled={!state.mSec}
          onClick={reset}
        >
          reset
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <SW />
  </React.StrictMode>,
  document.getElementById("sw")
);
