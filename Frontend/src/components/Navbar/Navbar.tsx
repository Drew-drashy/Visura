import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AppBar, Box, Button, Chip, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import { alpha } from '@mui/material/styles';
import { useThemeMode } from '../../theme/ThemeModeProvider';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/selectors';
import { logout } from '../../features/auth/slice/authSlice';
import { useLogoutMutation, useLazyGetVideosQuery, useGetVideosQuery } from '../../features/auth/api/authApi';
import { useSnackbar } from 'notistack';

type NavbarProps = {
  onMenuClick: () => void;
  sidebarWidth: number;
};

const Navbar = ({ onMenuClick, sidebarWidth }: NavbarProps) => {
  const { mode, toggleMode } = useThemeMode();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [fetchVideos] = useLazyGetVideosQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { data: videosData } = useGetVideosQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 10000,
  });
  const pendingCount =
    videosData?.videos?.filter((v) => ['processing', 'queued'].includes(v.status?.toLowerCase?.() || '')).length ?? 0;

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      dispatch(logout());
    }
  };

  const handleNotifications = async () => {
    try {
      const res = await fetchVideos().unwrap();
      const latest = res?.videos?.slice(0, 3) ?? [];
      const message =
        latest.length === 0
          ? 'No video activity yet.'
          : latest.map((v) => `${v.prompt} • ${v.status}`).join('\n');
      enqueueSnackbar(message, { variant: 'info', autoHideDuration: 4000 });
    } catch (error) {
      enqueueSnackbar('Could not fetch notifications.', { variant: 'error' });
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'var(--navbar-bg)',
        boxShadow: `0 1px 2px 0 ${alpha('#000000', 0.08)}`,
        color: 'var(--primary-text-color)',
        borderBottom: `1px solid var(--sidebar-border)`,
        backdropFilter: 'blur(14px)',
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            aria-label="Toggle navigation"
            sx={{ display: { md: 'none' }, color: 'inherit' }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="div" fontWeight={700}>
              Visura
            </Typography>
            <Chip
              label="AI Video Studio"
              size="small"
              sx={{
                fontSize: 12,
                letterSpacing: 0.4,
                fontWeight: 600,
                backgroundColor: 'var(--muted-color)',
                color: 'var(--primary-text-color)',
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="inherit" onClick={handleNotifications}>
            <Badge
              color="secondary"
              badgeContent={pendingCount > 0 ? pendingCount : 0}
              overlap="circular"
              invisible={!pendingCount}
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
          {isAuthenticated ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {/* <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                {currentUser?.name ?? 'Logged in'}
              </Typography> */}
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{
                  fontWeight: 700,
                  borderRadius: 999,
                  textTransform: 'none',
                  px: 2,
                }}
              >
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/login"
              sx={{
                fontWeight: 600,
                borderRadius: 999,
                textTransform: 'none',
                px: 2.5,
                boxShadow: 'none',
              }}
            >
              Sign in
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
