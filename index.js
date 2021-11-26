var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var reducer = function reducer(state, action) {
  switch (action.type) {
    case "START":
      return Object.assign({}, state, { isOn: true, markPath: state.distance ? true : false });
    case "STOP":
      return Object.assign({}, state, { isOn: false });
    case "RUNNER":
      return Object.assign({}, state, {
        hrs: action.payload.hrs,
        min: action.payload.min,
        sec: action.payload.sec
      });
    case "RUN_MS":
      return Object.assign({}, state, {
        mSec: state.mSec + 1
      });
    case "RESET_MS":
      return Object.assign({}, state, {
        mSec: 0
      });
    case "RESET":
      return Object.assign({}, state, {
        mSec: 0,
        sec: 0,
        min: 0,
        hrs: 0,
        isOn: false,
        path: 0,
        markPath: 0,
        distance: 0
      });
    case "SET_PATH":
      return Object.assign({}, state, { path: action.payload });
    case "SET_DISTANCE":
      return Object.assign({}, state, { distance: action.payload });

    default:
      throw new Error();
  }
};

var SW = function SW() {
  var _React$useReducer = React.useReducer(reducer, {
    mSec: 0,
    sec: 0,
    min: 0,
    hrs: 0,
    isOn: false,
    path: 0,
    markPath: false,
    distance: 0
  }),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      state = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  var start = function start() {
    dispatch({ type: "START" });
  };

  var stop = function stop() {
    dispatch({ type: "STOP" });
  };

  var reset = function reset() {
    dispatch({ type: "RESET" });
  };

  React.useEffect(function () {
    var timeWorker = void 0;
    if (state.isOn) {
      if (!state.path) {
        dispatch({
          type: "SET_PATH",
          payload: Math.floor(new Date().getTime() / 1000)
        });
      }

      if (state.markPath) {
        dispatch({
          type: "SET_PATH",
          payload: Math.floor(new Date().getTime() / 1000) - state.distance
        });
      }

      timeWorker = setInterval(function () {
        var tempNow = Math.floor(new Date().getTime() / 1000);

        dispatch({ type: "SET_DISTANCE", payload: tempNow - state.path });

        var hours = Math.floor(state.distance % (1000 * 60 * 60 * 24) / (60 * 60));
        var minutes = Math.floor(state.distance % (1000 * 60 * 60) / 60);
        var seconds = Math.abs(Math.floor(state.distance % (1000 * 60) - minutes * 60));

        dispatch({
          type: "RUNNER",
          payload: {
            hrs: hours,
            min: Math.abs(minutes - state.hrs * 60),
            sec: seconds
          }
        });

        state.mSec == 99 ? dispatch({ type: "RESET_MS" }) : dispatch({ type: "RUN_MS" });
      }, 10);
    }

    return function () {
      return clearInterval(timeWorker);
    };
  }, [state.path, state.isOn, state.mSec, state.distance]);

  return React.createElement(
    "div",
    { className: "main-div" },
    React.createElement(
      "p",
      { className: "digit" },
      state.hrs.toString().padStart(2, "0"),
      ":",
      state.min.toString().padStart(2, "0"),
      ":",
      state.sec.toString().padStart(2, "0"),
      ":",
      state.mSec.toString().padStart(2, "0")
    ),
    React.createElement(
      "div",
      { className: "button-div" },
      !state.isOn && React.createElement(
        "button",
        { className: "button", onClick: start },
        !state.mSec ? "Start" : "Resume"
      ),
      state.isOn && React.createElement(
        "button",
        { className: "button yellow-btn", onClick: stop },
        "Pause"
      ),
      React.createElement(
        "button",
        {
          className: "button green-btn",
          disabled: !state.mSec,
          onClick: reset
        },
        "reset"
      )
    )
  );
};

ReactDOM.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(SW, null)
), document.getElementById("sw"));