import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';

import './App.css';
import Main from './components/Main';
import { store } from './store';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    // Name of the component
    MuiAppBar: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          flexDirection: 'row'
        }
      }
    }
  }
});

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById('data-viewer-content')?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MemoryRouter>
        <ScrollToTop />
        <Provider store={store}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
              <Main />
            </ThemeProvider>
          </StyledEngineProvider>
        </Provider>
      </MemoryRouter>
    </LocalizationProvider>
  );
}
