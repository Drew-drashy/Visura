
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

import ThemeModeProvider from './theme/ThemeModeProvider.tsx';

import { Provider } from "react-redux";
import { store } from "./store/store.ts"; 
import { SnackbarProvider } from 'notistack';


createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
      <ThemeModeProvider>
        <BrowserRouter>
           <SnackbarProvider
            maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
           > <App /></SnackbarProvider>
        </BrowserRouter>
      </ThemeModeProvider>
   </Provider>
);
