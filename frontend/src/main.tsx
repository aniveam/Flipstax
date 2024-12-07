import App from "@/App.tsx";
import { persistor, store } from "@/redux/store.ts";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./context/AuthContext.tsx";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "75em",
    xl: "80em",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
