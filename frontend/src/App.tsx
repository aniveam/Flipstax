import { MantineProvider, createTheme } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import { Home } from "@/Pages/Main/Home";

function App() {
  const theme = createTheme({
    breakpoints: {
      xs: '30em',
      sm: '48em',
      md: '64em',
      lg: '75em',
      xl: '80em',
    },
  });
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
