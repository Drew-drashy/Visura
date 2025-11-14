import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import ThemeModeProvider from './theme/ThemeModeProvider.tsx';

import { Provider } from "react-redux";
import { store } from "./store/store.ts"; 

createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
      <ThemeModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeModeProvider>
   </Provider>
);
