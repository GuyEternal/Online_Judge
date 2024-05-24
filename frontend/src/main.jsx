import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
const rootElement = document.getElementById("root");
axios.defaults.withCredentials = true; // for frontend to make requests which default to allowing cookies
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider resetCSS={true}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
