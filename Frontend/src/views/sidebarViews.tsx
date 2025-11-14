import DashboardContent from '../components/Dashboard/DashboardContent';
import SectionPlaceholder from './SectionPlaceholder';

export const OverviewView = () => (
  <DashboardContent

  />
);

export const CreateVideoView = () => (
  <SectionPlaceholder
    title="Create Video"
    description="Start a fresh video project, assemble story beats, and orchestrate your production workflow."
  />
);

export const StoryBuilderView = () => (
  <SectionPlaceholder
    title="Story Builder"
    description="Outline narratives, iterate on scripts, and align collaborators on the creative vision."
  />
);

export const MediaLibraryView = () => (
  <SectionPlaceholder
    title="Media Library"
    description="Browse, organize, and tag every asset from raw footage to finished renders."
  />
);

export const AnalyticsView = () => (
  <SectionPlaceholder
    title="Analytics"
    description="Track performance metrics, viewer engagement, and campaign impact in real time."
  />
);

export const UploadAssetsView = () => (
  <SectionPlaceholder
    title="Upload Assets"
    description="Bring new footage, audio, and design files into Visura with intelligent metadata extraction."
  />
);

export const SettingsView = () => (
  <SectionPlaceholder
    title="Settings"
    description="Configure workspace preferences, billing, permissions, and integrations."
  />
);

export const HelpSupportView = () => (
  <SectionPlaceholder
    title="Help & Support"
    description="Find documentation, contact support, or join the community for inspiration."
  />
);

