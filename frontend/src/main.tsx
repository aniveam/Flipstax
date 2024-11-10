import App from "@/App.tsx";
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
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
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
