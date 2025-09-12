import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // 👈 Import Provider
import { store } from "./redux/store";

import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/Messages/authWrapper";
import { AppProvider } from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <AppProvider>
          <App />
          </AppProvider>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
