import { useState } from 'react';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import DashboardContent from '../Dashboard/DashboardContent';
import { sidebarSections, type SidebarItemConfig } from '../Sidebar/sidebarConfig';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 288;

const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(sidebarSections[0].items[0].id);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setMobileOpen(false);
  };

  const handleSelectSidebarItem = (item: SidebarItemConfig) => {
  setSelectedItemId(item.id);      // highlight active item
  navigate(item.path);             // navigate to page

  if (!isDesktop) {
    setMobileOpen(false);          // close sidebar on mobile
  }
};


  const SelectedComponent = (() => {
    for (const section of sidebarSections) {
      const found = section.items.find((item) => item.id === selectedItemId);
      if (found) {
        return found.component;
      }
    }
    return null;
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--primary-text-color)',
      }}
    >
      <Navbar onMenuClick={handleToggleSidebar} sidebarWidth={SIDEBAR_WIDTH} />
      <Sidebar
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop ? true : mobileOpen}
        onClose={handleCloseSidebar}
        width={SIDEBAR_WIDTH}
        sections={sidebarSections}
        selectedItemId={selectedItemId}
        onSelectItem={handleSelectSidebarItem}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2.5, md: 7 },
          pt: { xs: 12, md: 10 },
          pb: { xs: 6, md: 8 },
          transition: theme.transitions.create(['margin', 'padding'], {
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        {SelectedComponent ? <SelectedComponent /> : <DashboardContent />}
      </Box>
    </Box>
  );
};

export default AppLayout;


