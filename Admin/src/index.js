import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import persistor from "./component/context/context";
import store from "./component/context/context";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate loading={<App />} persistor={persistor}></PersistGate>
    </React.StrictMode>
  </Provider>
);
