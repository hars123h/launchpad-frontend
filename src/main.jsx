import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { UserContextProvider } from "./context/UserContext.jsx";
// import { PostContextProvider } from "./context/PostContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <UserContextProvider>
      <PostContextProvider>
        <ChatContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChatContextProvider>
      </PostContextProvider>
    </UserContextProvider> */}

    <Provider store={store}>
      <ChatContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ChatContextProvider>
    </Provider>
  </React.StrictMode>
);
