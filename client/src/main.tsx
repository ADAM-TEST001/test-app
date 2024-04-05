import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="184096121816-mfg6hcepv5dh7lbc8uo5gup09e45mjfk.apps.googleusercontent.com">
    <Toaster position="bottom-left" />
    <App />
  </GoogleOAuthProvider>
);
