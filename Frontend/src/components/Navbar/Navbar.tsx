import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AppBar, Box, Button, Chip, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useThemeMode } from '../../theme/ThemeModeProvider';
import { Link as RouterLink } from 'react-router-dom';

type NavbarProps = {
  onMenuClick: () => void;
  sidebarWidth: number;
};

const Navbar = ({ onMenuClick, sidebarWidth }: NavbarProps) => {
  const { mode, toggleMode } = useThemeMode();

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
          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
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
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


