
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';

const App = () => (
  <Routes>
    <Route path="/" element={<AppLayout />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default App;
