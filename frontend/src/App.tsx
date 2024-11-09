import { Home } from "@/Pages/Main/Home";
import { Login } from "@/Pages/Main/Login";
import { Register } from "@/Pages/Main/Register";
import { MantineProvider, createTheme } from "@mantine/core";
import { Route, Routes } from "react-router-dom";

function App() {
  const theme = createTheme({
    breakpoints: {
      xs: "30em",
      sm: "48em",
      md: "64em",
      lg: "75em",
      xl: "80em",
    },
  });

  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
