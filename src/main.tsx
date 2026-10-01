import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/global.css";
import { App } from "./presentation/App";

const rootElement = document.getElementById("root");

if (rootElement instanceof HTMLDivElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Theme
        accentColor="teal"
        appearance="light"
        grayColor="sand"
        hasBackground={false}
        panelBackground="solid"
        radius="large"
        scaling="100%"
      >
        <App />
      </Theme>
    </React.StrictMode>,
  );
}
