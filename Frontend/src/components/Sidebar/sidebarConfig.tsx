import type { ComponentType, ElementType } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  AnalyticsView,
  CreateVideoView,
  HelpSupportView,
  MediaLibraryView,
  OverviewView,
  SettingsView,
  StoryBuilderView,
} from '../../views/sidebarViews';

export type SidebarItemConfig = {
  id: string;
  label: string;
  icon: ElementType;
  component: ComponentType;
  path:string;
};

export type SidebarSectionConfig = {
  title: string;
  items: SidebarItemConfig[];
};
export const sidebarSections: SidebarSectionConfig[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: DashboardOutlinedIcon, component: OverviewView, path: '/' },
      { id: 'create-video', label: 'Create Video', icon: PlayCircleOutlineOutlinedIcon, component: CreateVideoView, path: '/create-video' },
      // { id: 'story-builder', label: 'Story Builder', icon: AutoStoriesOutlinedIcon, component: StoryBuilderView, path: '/story-builder' },
      { id: 'media-library', label: 'Media Library', icon: StorageOutlinedIcon, component: MediaLibraryView, path: '/media-library' },
      // { id: 'analytics', label: 'Analytics', icon: InsightsOutlinedIcon, component: AnalyticsView, path: '/analytics' },
    ],
  },
  {
    title: 'Utilities',
    items: [
      { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon, component: SettingsView, path: '/settings' },
      { id: 'help-support', label: 'Help & Support', icon: HelpOutlineOutlinedIcon, component: HelpSupportView, path: '/help-support' },
    ],
  },
];


