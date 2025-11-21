import CreateVideo from '../components/CreateVideo/CreateVideo';
import DashboardContent from '../components/Dashboard/DashboardContent';
import MediaLibrary from '../components/MediaLibrary/MediaLibrary';
import SectionPlaceholder from './SectionPlaceholder';
import ProfileSettings from '../components/Settings/ProfileSettings';

export const OverviewView = () => (
  <DashboardContent

  />
);

export const CreateVideoView = () => (
  <CreateVideo/>
 );

export const StoryBuilderView = () => (
  <SectionPlaceholder
    title="Story Builder"
    description="Outline narratives, iterate on scripts, and align collaborators on the creative vision."
  />
);

export const MediaLibraryView = () => (
   <MediaLibrary/>
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
  <ProfileSettings />
);

export const HelpSupportView = () => (
  <SectionPlaceholder
    title="Help & Support"
    description="Find documentation, contact support, or join the community for inspiration."
  />
);
