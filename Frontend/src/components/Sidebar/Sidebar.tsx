  import {
    Avatar,
    Box,
    Chip,
    Divider,
    Drawer,
    type DrawerProps,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
  } from '@mui/material';
  import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
  import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
  import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
  import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
  import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
  import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
  import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
  import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

  const menuItems = [
    { label: 'Overview', icon: <DashboardOutlinedIcon /> },
    { label: 'Create Video', icon: <PlayCircleOutlineOutlinedIcon /> },
    { label: 'Story Builder', icon: <AutoStoriesOutlinedIcon /> },
    { label: 'Media Library', icon: <StorageOutlinedIcon /> },
    { label: 'Analytics', icon: <InsightsOutlinedIcon /> },
  ];

  const secondaryItems = [
    { label: 'Upload Assets', icon: <CloudUploadOutlinedIcon /> },
    { label: 'Settings', icon: <SettingsOutlinedIcon /> },
    { label: 'Help & Support', icon: <HelpOutlineOutlinedIcon /> },
  ];

  type SidebarProps = {
    width: number;
  } & Pick<DrawerProps, 'variant' | 'open' | 'onClose'>;

  const Sidebar = ({ variant, open, onClose, width }: SidebarProps) => (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: `1px solid var(--sidebar-border)`,
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          paddingX: 2,
          paddingY: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 64,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Visura
        </Typography>
        <Chip
          label="Beta"
          size="small"
          sx={{
            backgroundColor: 'var(--muted-color)',
            color: 'var(--primary-text-color)',
            fontWeight: 600,
            letterSpacing: 0.4,
          }}
        />
      </Toolbar>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          paddingX: 1,
          paddingY: 1.5,
          borderRadius: 3,
          backgroundColor: 'var(--card-bg)',
          border: `1px solid var(--muted-color)`,
          boxShadow: `0 18px 40px -24px var(--shadow-color)`,
        }}
      >
        <Avatar
          alt="Ayan Sharma"
          sx={{ width: 44, height: 44, bgcolor: 'var(--accent-color)', color: '#fff', fontWeight: 600 }}
        >
          AS
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Ayan Sharma
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
            Creative Producer
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        <Typography
          variant="overline"
          component="p"
          sx={{ letterSpacing: 1, opacity: 0.6, mb: 1, fontWeight: 600 }}
        >
          Workspace
        </Typography>
        <List sx={{ width: '100%' }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                color: 'inherit',
                '&.Mui-selected': {
                  backgroundColor: 'var(--muted-color)',
                  color: 'var(--accent-color)',
                },
                '&:hover': {
                  backgroundColor: 'var(--muted-color)',
                },
              }}
              selected={item.label === 'Overview'}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderColor: 'var(--muted-color)', my: 2 }} />

        <Typography
          variant="overline"
          component="p"
          sx={{ letterSpacing: 1, opacity: 0.6, mb: 1, fontWeight: 600 }}
        >
          Utilities
        </Typography>
        <List>
          {secondaryItems.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'var(--muted-color)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(103,80,164,0.12), rgba(77,208,225,0.18))',
          border: `1px solid var(--muted-color)`,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          Need inspiration?
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Explore community templates curated for music, product demos, and explainers.
        </Typography>
        <Chip
          label="Browse templates"
          color="primary"
          variant="outlined"
          sx={{ mt: 2, fontWeight: 600, borderRadius: 99 }}
          clickable
        />
      </Box>
    </Drawer>
  );

  export default Sidebar;


