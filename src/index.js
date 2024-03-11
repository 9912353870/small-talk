import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./index.css";
import TodoStore from "./store/main.store";
const appStore = new TodoStore();

const container = document.getElementById("root");
const root = createRoot(container);

// Render the App component to the root
root.render(<App appStore={appStore} />);
