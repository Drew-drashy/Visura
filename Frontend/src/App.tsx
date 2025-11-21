
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import { sidebarSections } from './components/Sidebar/sidebarConfig';
import { useGetProfileQuery } from './features/auth/api/authApi';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { restoreSession, setUser } from './features/auth/slice/authSlice';
import { selectAuthState } from './features/auth/selectors';

const App = () => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector(selectAuthState);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !tokens?.accessToken,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [profile, dispatch]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<AppLayout />}>
          {sidebarSections.flatMap((section) =>
            section.items.map((item) => (
              <Route key={item.id} path={item.path} element={<item.component />} />
            )),
          )}
        </Route>
      </Routes>
    </>
  );
};

export default App;
