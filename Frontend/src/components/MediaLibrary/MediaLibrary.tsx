import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CircularProgress from "@mui/material/CircularProgress";

// Example data (replace with API data)
const videos = [
  {
    id: 1,
    title: "NeoSynth launch trailer",
    status: "finished",
    thumbnail: "https://via.placeholder.com/600x350?text=Video+Preview",
  },
  {
    id: 2,
    title: "Aurora festival recap",
    status: "processing",
    progress: 68,
  },
  {
    id: 3,
    title: "Product walkthrough v2",
    status: "processing",
    progress: 32,
  },
  {
    id: 4,
    title: "Neon city flythrough",
    status: "finished",
    thumbnail: "https://via.placeholder.com/600x350?text=Video+Preview",
  },
  {
    id: 5,
    title: "Failed render example",
    status: "failed",
  },
];

export default function MediaLibrary() {
  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <MovieCreationOutlinedIcon color="primary" />
        <Typography variant="h4" fontWeight={700}>
          Media Library
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ opacity: 0.75, maxWidth: 560 }}>
        Browse, organize, and tag every asset from raw footage to finished renders.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {videos.map((video) => (
          <Card
            key={video.id}
            sx={{
              position: "relative",
              borderRadius: 4,
              background: "var(--card-bg)",
              border: `1px solid var(--muted-color)`,
              boxShadow: `0 18px 40px -32px var(--shadow-color)`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 260,
            }}
          >
            {/* Media / placeholder */}
            {video.status === "finished" ? (
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ objectFit: "cover" }}
                />
                {/* Play overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.25) 60%)",
                  }}
                >
                  <IconButton
                    size="large"
                    aria-label="play"
                    sx={{
                      background: "rgba(0,0,0,0.55)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.65)" },
                      borderRadius: 3,
                    }}
                    onClick={() => {
                      /* replace with your preview logic */
                      console.log("Play", video.id);
                    }}
                  >
                    <PlayArrowOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <BoltOutlinedIcon color="primary" sx={{ fontSize: 48, opacity: 0.6 }} />
              </Box>
            )}

            {/* Content */}
            <CardContent sx={{ pt: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                {video.title}
              </Typography>

              {/* Footer row: left = pill, right = icon */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                {/* Left status pill */}
                {video.status === "processing" && (
                  <Chip
                    label={`Generating • ${video.progress ?? 0}%`}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      fontWeight: 600,
                      px: 1.2,
                    }}
                  />
                )}

                {video.status === "finished" && (
                  <Chip
                    label="Finished"
                    size="small"
                    color="primary"
                    sx={{ borderRadius: 999, fontWeight: 600 }}
                  />
                )}

                {video.status === "failed" && (
                  <Chip
                    label="Failed"
                    size="small"
                    sx={{
                      borderRadius: 999,
                      backgroundColor: "rgba(255,80,80,0.12)",
                      color: "rgb(255,80,80)",
                      fontWeight: 600,
                    }}
                  />
                )}

                {/* Right icon */}
                <Box>
                  {video.status === "processing" && (
                    <CircularProgress size={20} thickness={5} />
                  )}
                  {video.status === "finished" && (
                    <CheckCircleOutlineOutlinedIcon color="success" />
                  )}
                  {video.status === "failed" && (
                    <ErrorOutlineOutlinedIcon color="error" />
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
