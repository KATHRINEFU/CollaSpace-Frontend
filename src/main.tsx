import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import 'unfonts.css'
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <Provider store={store()}>
        <StyleProvider hashPriority="high">
          <ConfigProvider>
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </ConfigProvider>
        </StyleProvider>
      </Provider>
  </React.StrictMode>
);
