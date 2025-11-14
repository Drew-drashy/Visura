import type { ComponentType, ElementType } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
  UploadAssetsView,
} from '../../views/sidebarViews';

export type SidebarItemConfig = {
  id: string;
  label: string;
  icon: ElementType;
  component: ComponentType;
};

export type SidebarSectionConfig = {
  title: string;
  items: SidebarItemConfig[];
};

export const sidebarSections: SidebarSectionConfig[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: DashboardOutlinedIcon, component: OverviewView },
      { id: 'create-video', label: 'Create Video', icon: PlayCircleOutlineOutlinedIcon, component: CreateVideoView },
      { id: 'story-builder', label: 'Story Builder', icon: AutoStoriesOutlinedIcon, component: StoryBuilderView },
      { id: 'media-library', label: 'Media Library', icon: StorageOutlinedIcon, component: MediaLibraryView },
      { id: 'analytics', label: 'Analytics', icon: InsightsOutlinedIcon, component: AnalyticsView },
    ],
  },
  {
    title: 'Utilities',
    items: [
      { id: 'upload-assets', label: 'Upload Assets', icon: CloudUploadOutlinedIcon, component: UploadAssetsView },
      { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon, component: SettingsView },
      { id: 'help-support', label: 'Help & Support', icon: HelpOutlineOutlinedIcon, component: HelpSupportView },
    ],
  },
];

