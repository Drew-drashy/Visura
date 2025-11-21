import { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authApiUtils } from "../../features/auth/api/authApi";
import { selectAuthState } from "../../features/auth/selectors";
import { VIDEO_GENERATE_URL } from "../../constants/url";
import { useSnackbar } from "notistack";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

const SpeechRecognition =
  typeof window !== "undefined"
    ? ((window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition)
    : null;

export default function CreateVideo() {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { tokens } = useAppSelector(selectAuthState);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState<SpeechRecognition | null>(null);
  const lastTranscriptRef = useRef<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!tokens?.accessToken) {
      enqueueSnackbar("Please sign in to generate a video.", { variant: "warning" });
      return;
    }

    setIsGenerating(true);
    setProgress(25);

    try {
      const response = await fetch(VIDEO_GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to start video generation");
      }

      // Kick off profile refresh (credits) and finish progress
      setProgress(100);
      enqueueSnackbar("Video generation started. We’ll notify you when it’s ready.", { variant: "success" });
      dispatch(authApiUtils.invalidateTags(["Auth", "Videos"]));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to start video generation";
      enqueueSnackbar(message, { variant: "error" });
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const startDictation = () => {
    if (!SpeechRecognition) {
      enqueueSnackbar("Speech recognition is not supported in this browser.", { variant: "warning" });
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        enqueueSnackbar("Could not capture audio. Please try again.", { variant: "error" });
      };
      recognition.onresult = (event) => {
        const result = event.results[event.resultIndex];
        const transcript = result?.[0]?.transcript?.trim?.();
        if (!transcript) return;
        if (transcript === lastTranscriptRef.current) return;
        lastTranscriptRef.current = transcript;
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        recognition.stop(); // stop after a final result to avoid duplicate firing
      };

      recognition.start();
      setRecognizer(recognition);
    } catch (error) {
      setIsListening(false);
      enqueueSnackbar("Mic access failed. Check permissions and try again.", { variant: "error" });
    }
  };

  const stopDictation = () => {
    if (recognizer) {
      recognizer.stop();
    }
  };

  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700}>
        Create a New AI Video
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          background: "var(--card-bg)",
          border: `1px solid var(--muted-color)`,
          boxShadow: `0 25px 60px -40px var(--shadow-color)`,
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MovieCreationOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Video Prompt
            </Typography>
            <Chip
              label={isListening ? "Listening..." : "Use mic"}
              size="small"
              color={isListening ? "secondary" : "default"}
              sx={{ ml: 1, fontWeight: 600 }}
              icon={isListening ? <StopCircleOutlinedIcon fontSize="small" /> : <MicNoneOutlinedIcon fontSize="small" />}
            />
          </Stack>

          <TextField
            label="Describe the video you want to generate"
            placeholder="e.g. Futuristic city skyline with neon lights and floating drones"
            multiline
            minRows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={isListening ? stopDictation : startDictation} aria-label="dictate prompt">
                    {isListening ? <StopCircleOutlinedIcon color="secondary" /> : <MicNoneOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGenerate}
            disabled={isGenerating}
            sx={{ alignSelf: "flex-start", px: 4, py: 1.2, borderRadius: 3 }}
          >
            Generate Video
          </Button>

          {isGenerating && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <BoltOutlinedIcon color="primary" />
                <Typography fontWeight={600}>Generating your video...</Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": { borderRadius: 999 },
                }}
              />

              <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                This may take a few seconds. Sit tight.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          background: "var(--card-bg)",
          border: `1px solid var(--muted-color)`,
          boxShadow: `0 18px 40px -32px var(--shadow-color)`,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Tips for Better Results
        </Typography>

        <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }} flexWrap="wrap" useFlexGap>
          <Chip label="Include emotion or tone (e.g. dramatic, cinematic)" />
          <Chip label="Specify environment (e.g. forest, space station)" />
          <Chip label="Mention camera style (e.g. drone shot, slow pan)" />
          <Chip label="Add art style (e.g. anime, photorealistic)" />
        </Stack>
      </Card>
    </Stack>
  );
}
