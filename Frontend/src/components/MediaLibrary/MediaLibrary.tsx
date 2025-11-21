import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  LinearProgress,
  Skeleton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton as MuiIconButton,
} from "@mui/material";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
// FIX 1: Consolidated imports from react to one line
import { useState, useEffect } from "react"; 
import { formatDistanceToNow } from "date-fns";
import { useGetVideosQuery } from "../../features/auth/api/authApi";
import { useAppSelector } from "../../store/hooks";
import { selectAuthState } from "../../features/auth/selectors";
import { VIDEO_STREAM_URL } from "../../constants/url";
import type { VideoItem } from "../../features/auth/types";

const statusChip = (status: string, progress?: number) => {
  const lower = status.toLowerCase();
  if (lower === "finished" || lower === "success") {
    return <Chip label="Finished" size="small" color="primary" sx={{ borderRadius: 999, fontWeight: 600 }} />;
  }
  if (lower === "processing" || lower === "pending" || lower === "queued") {
    return (
      <Chip
        label={`Processing${progress ? ` • ${progress}%` : ""}`}
        size="small"
        sx={{ borderRadius: 999, fontWeight: 600, backgroundColor: "rgba(255,255,255,0.08)" }}
      />
    );
  }
  if (lower === "failed" || lower === "error") {
    return (
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
    );
  }
  return <Chip label={status} size="small" sx={{ borderRadius: 999, fontWeight: 600 }} />;
};

const statusIcon = (status: string) => {
  const lower = status.toLowerCase();
  if (lower === "processing" || lower === "pending" || lower === "queued") return <HourglassBottomIcon color="warning" />;
  if (lower === "finished" || lower === "success") return <CheckCircleOutlineOutlinedIcon color="success" />;
  if (lower === "failed" || lower === "error") return <ErrorOutlineOutlinedIcon color="error" />;
  return <HourglassBottomIcon color="info" />;
};

export default function MediaLibrary() {
  const { tokens } = useAppSelector(selectAuthState);
  const { data, isLoading, isFetching, error } = useGetVideosQuery(undefined, {
    skip: !tokens?.accessToken,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const [liveVideos, setLiveVideos] = useState<VideoItem[] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) return;
    const es = new EventSource(`${VIDEO_STREAM_URL}?token=${tokens.accessToken}`);

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.videos) {
          setLiveVideos(payload.videos as VideoItem[]);
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [tokens?.accessToken]);

  const videos = liveVideos ?? data?.videos ?? [];
  const loading = isLoading || isFetching || (!liveVideos && !data);

  const canPlay = (video: VideoItem) => Boolean(video?.videoUrl);
  const handleOpen = (video: VideoItem) => {
    if (!canPlay(video)) return;
    setSelectedVideo(video);
  };
  const handleClose = () => setSelectedVideo(null);

  return (
    // FIX 2: Wrap all returned JSX in a React Fragment (<>...</>)
    <>
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

        {error && (
          <Typography color="error" variant="body2">
            Failed to load videos. Please try again.
          </Typography>
        )}

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
          {(loading ? Array.from({ length: 6 }) : videos).map((video, idx) => (
            <Card
              key={loading ? idx : video._id}
              sx={{
                position: "relative",
                borderRadius: 4,
                background: "var(--card-bg)",
                border: `1px solid var(--muted-color)`,
                boxShadow: `0 24px 60px -36px var(--shadow-color)`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 260,
                transition: "transform 200ms ease, box-shadow 200ms ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 30px 70px -40px var(--shadow-color)`,
                },
              }}
            >
              {/* Media / placeholder */}
              <Box
                sx={{
                  height: 170,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: video?.videoUrl
                    ? "linear-gradient(135deg, rgba(103,80,164,0.08), rgba(77,208,225,0.12))"
                    : "rgba(255,255,255,0.04)",
                  position: "relative",
                }}
              >
                {loading ? (
                  <Skeleton variant="rounded" width="92%" height={130} />
                ) : video?.videoUrl ? (
                  <>
                    <Box
                      component="img"
                      src={video?.thumbnailUrl || video?.videoUrl}
                      alt={video?.prompt}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="large"
                      aria-label="play"
                      onClick={() => handleOpen(video)}
                      sx={{
                        position: "absolute",
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        "&:hover": { background: "rgba(0,0,0,0.65)" },
                        borderRadius: 3,
                      }}
                    >
                      <PlayArrowOutlinedIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    size="large"
                    aria-label="play"
                    sx={{
                      background: "rgba(0,0,0,0.55)",
                      color: "white",
                      "&:hover": { background: "rgba(0,0,0,0.65)" },
                      borderRadius: 3,
                    }}
                    disabled
                  >
                    <PlayArrowOutlinedIcon />
                  </IconButton>
                )}
              </Box>

              <CardContent sx={{ pt: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography fontWeight={700} sx={{ mb: 0.5 }}>
                  {loading ? <Skeleton width="80%" /> : video.prompt}
                </Typography>

                {!loading && (
                  <Typography variant="body2" sx={{ opacity: 0.65 }}>
                    {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                  </Typography>
                )}

                {/* Footer row: left = pill, right = icon */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                  {loading ? <Skeleton width={140} height={28} /> : statusChip(video.status, video.progress)}

                  <Box>{loading ? <Skeleton width={24} height={24} /> : statusIcon(video.status)}</Box>
                </Stack>

                {!loading && video.status.toLowerCase() === "processing" && (
                  <LinearProgress
                    variant={typeof video.progress === "number" ? "determinate" : "indeterminate"}
                    value={video.progress}
                    sx={{ mt: 1, borderRadius: 999 }}
                  />
                )}

                {!loading && video.status.toLowerCase() === "failed" && video.error && (
                  <Tooltip title={video.error}>
                    <Typography variant="caption" color="error" sx={{ opacity: 0.85 }}>
                      Tap for error details
                    </Typography>
                  </Tooltip>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {!loading && videos.length === 0 && (
          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              background: "var(--card-bg)",
              border: `1px solid var(--muted-color)`,
              boxShadow: `0 18px 40px -32px var(--shadow-color)`,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No videos yet
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Start by generating a video. Your renders will show up here with their current status.
            </Typography>
          </Card>
        )}
      </Stack>

      <Dialog
        open={Boolean(selectedVideo)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "var(--card-bg)",
            color: "var(--primary-text-color)",
          },
        }}
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={700}>{selectedVideo.prompt}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {formatDistanceToNow(new Date(selectedVideo.createdAt), { addSuffix: true })}
                </Typography>
              </Stack>
              <MuiIconButton onClick={handleClose} aria-label="close">
                ✕
              </MuiIconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
              <Box
                component="video"
                src={selectedVideo?.videoUrl}
                controls
                autoPlay
                style={{ width: "100%", borderRadius: 16, backgroundColor: "#000" }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}