import { Box, Card, CardContent, Chip, Divider, LinearProgress, Stack, Typography, alpha, useTheme } from '@mui/material';

import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';

const workflowCards = [
  {
    title: 'Script to Video',
    description: 'Transform ideas into scenes with AI-generated storyboards, visuals, and pacing.',
    icon: <VideoLibraryOutlinedIcon fontSize="large" />,
    accent: '#6750A4',
  },
  {
    title: 'Voice Over Studio',
    description: 'Personalize voiceovers with multilingual, emotionally aware AI narration.',
    icon: <RecordVoiceOverOutlinedIcon fontSize="large" />,
    accent: '#4dd0e1',
  },
  {
    title: 'Asset Remix',
    description: 'Blend uploaded media with generated assets for quick iteration and remixing.',
    icon: <ImageOutlinedIcon fontSize="large" />,
    accent: '#ffb74d',
  },
];

const DashboardContent = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: { xs: 'flex-start', lg: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={1}>
          <Chip
            label="Welcome back, Ayan 👋"
            sx={{
              width: 'fit-content',
              fontWeight: 600,
              letterSpacing: 0.4,
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="h3" fontWeight={700} sx={{ maxWidth: 520 }}>
            Build cinematic AI videos in minutes
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.75, maxWidth: 560 }}>
            Visura orchestrates scripting, narration, visuals, and delivery. Start with a prompt,
            import your assets, and guide the creative direction with our live AI copilots.
          </Typography>
        </Stack>

        <Card
          sx={{
            minWidth: { xs: '100%', lg: 320 },
            background: 'var(--card-bg)',
            borderRadius: 4,
            paddingX: 3,
            paddingY: 2.5,
            border: `1px solid var(--muted-color)`,
            boxShadow: `0 25px 60px -40px var(--shadow-color)`,
          }}
        >
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BoltOutlinedIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={700}>
                Generation credits
              </Typography>
            </Stack>
            <Typography variant="h2" fontWeight={700} sx={{ mt: 1 }}>
              74
              <Typography component="span" variant="subtitle2" sx={{ ml: 1, opacity: 0.6 }}>
                remaining
              </Typography>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={74}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 999,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                },
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 2 }}>
              Your plan renews in 12 days. Need more? Upgrade to Pro for unlimited render tiers.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {workflowCards.map((card) => (
          <Card
            key={card.title}
            sx={{
              height: '100%',
              background: 'var(--card-bg)',
              borderRadius: 4,
              border: `1px solid var(--muted-color)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 3,
              boxShadow: `0 18px 40px -32px ${alpha(card.accent, isDark ? 0.7 : 0.25)}`,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                backgroundColor: alpha(card.accent, isDark ? 0.22 : 0.14),
                color: card.accent,
              }}
            >
              {card.icon}
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {card.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, flexGrow: 1 }}>
              {card.description}
            </Typography>
            <Chip
              label="Launch workflow"
              sx={{
                alignSelf: 'flex-start',
                borderRadius: 999,
                fontWeight: 600,
                backgroundColor: alpha(card.accent, isDark ? 0.32 : 0.18),
                color: card.accent,
              }}
              clickable
            />
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          background: 'var(--card-bg)',
          borderRadius: 4,
          border: `1px solid var(--muted-color)`,
          p: 3,
          boxShadow: `0 18px 40px -32px var(--shadow-color)`,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700}>
                Recent projects
              </Typography>
              <Chip label="View all" variant="outlined" sx={{ borderRadius: 999, fontWeight: 600 }} clickable />
            </Stack>

            <Stack spacing={2.5} sx={{ mt: 3 }}>
              {[
                { title: 'NeoSynth launch trailer', status: 'Rendering', progress: 68 },
                { title: 'Aurora festival recap', status: 'In review', progress: 100 },
                { title: 'Product walkthrough v2', status: 'Draft', progress: 32 },
              ].map((project) => (
                <Box key={project.title}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography fontWeight={600}>{project.title}</Typography>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, isDark ? 0.26 : 0.14),
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider
            flexItem
            orientation="vertical"
            sx={{ display: { xs: 'none', md: 'inline-flex' }, borderColor: alpha('#94a3b8', 0.2) }}
          />

          <Card
            sx={{
              flexBasis: { xs: '100%', md: 320 },
              background: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CloudSyncOutlinedIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Sync with pipelines
                </Typography>
              </Stack>
              <Typography variant="body2">
                Bring in scripts from Notion, capture footage from cloud drives, and export to your
                editor of choice with smart render presets.
              </Typography>
              <Chip
                label="Connect integrations"
                color="primary"
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 999,
                  fontWeight: 600,
                  px: 1,
                }}
                clickable
              />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
};

export default DashboardContent;


