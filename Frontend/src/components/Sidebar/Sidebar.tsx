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
import type { SidebarItemConfig, SidebarSectionConfig } from './sidebarConfig';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../features/auth/selectors';

type SidebarSectionListProps = {
  title: string;
  items: SidebarItemConfig[];
  selectedItemId: string;
  onSelect: (item: SidebarItemConfig) => void;
  showDivider: boolean;
};

const SidebarSectionList = ({ title, items, selectedItemId, onSelect, showDivider }: SidebarSectionListProps) => (
   <>
    <Typography variant="overline" component="p" sx={{ letterSpacing: 1, opacity: 0.6, mb: 1, fontWeight: 600 }}>
      {title}
    </Typography>
    <List sx={{ width: '100%' }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isSelected = item.id === selectedItemId;

        return (
          <ListItemButton
            key={item.id}
            onClick={() => onSelect(item)}
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
            selected={isSelected}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        );
      })}
    </List>
    {showDivider && <Divider sx={{ borderColor: 'var(--muted-color)', my: 2 }} />}
  </>
);

type SidebarProps = {
  width: number;
  sections: SidebarSectionConfig[];
  selectedItemId: string;
  onSelectItem: (item: SidebarItemConfig) => void;
} & Pick<DrawerProps, 'variant' | 'open' | 'onClose'>;

const Sidebar = ({ variant, open, onClose, width, sections, selectedItemId, onSelectItem }: SidebarProps) => (
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

      <UserCard />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {sections.map((section, index) => (
          <SidebarSectionList
            key={section.title}
            title={section.title}
            items={section.items}
            selectedItemId={selectedItemId}
            onSelect={onSelectItem}
            showDivider={index !== sections.length - 1}
          />
        ))}
      </Box>

      {/* <Box
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
      </Box> */}
    </Drawer>
  );

export default Sidebar;
const UserCard = () => {
  const user = useAppSelector(selectCurrentUser);
  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || 'VS';

  return (
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
        flexWrap: 'wrap',
      }}
    >
      <Avatar
        alt={user?.name || 'User'}
        src={user?.avatarUrl}
        sx={{ width: 44, height: 44, bgcolor: 'var(--accent-color)', color: '#fff', fontWeight: 600 }}
      >
        {initials}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {user?.name || 'Your name'}
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }} noWrap>
          {user?.email || 'Add your email'}
        </Typography>
      </Box>
    </Stack>
  );
};
