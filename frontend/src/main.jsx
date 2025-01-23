import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.jsx";
import store from "@/store/index.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "@/components/auth/auth0-provider-with-navigate";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
