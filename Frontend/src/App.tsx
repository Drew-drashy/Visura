
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import { sidebarSections } from './components/Sidebar/sidebarConfig';

const App = () => (
  <>
  <Routes>
   <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

    
        <Route element={<AppLayout />}>
          {sidebarSections.flatMap((section) =>
            section.items.map((item) => (
              <Route
                key={item.id}
                path={item.path}
                element={<item.component />}
              />
            ))
          )}
        </Route>
      </Routes>
        </>
);

export default App;
