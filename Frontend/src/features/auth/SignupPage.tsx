import { useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { Link as RouterLink } from 'react-router-dom';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-color)',
        color: 'var(--primary-text-color)',
        px: 2.5,
        py: { xs: 8, sm: 12 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 540,
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          border: `1px solid var(--muted-color)`,
          background: 'var(--card-bg)',
          boxShadow: `0 24px 60px -32px var(--shadow-color)`,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Create your account
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--secondary-text-color)' }}>
              Join Visura to produce cinematic AI videos with collaborative workflows.
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              borderColor: 'var(--muted-color)',
              color: 'var(--primary-text-color)',
            }}
          >
            Sign up with Google
          </Button>

          <Divider sx={{ opacity: 0.6 }}>or</Divider>

          <Stack component="form" spacing={2.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="First name" fullWidth placeholder="Ayan" variant="outlined" />
              <TextField label="Last name" fullWidth placeholder="Sharma" variant="outlined" />
            </Stack>
            <TextField
              label="Work email"
              type="email"
              placeholder="you@studio.com"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                      {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  I agree to the
                  <Link component={RouterLink} to="/terms" underline="hover" fontWeight={600} sx={{ ml: 0.5 }}>
                    Terms of Service
                  </Link>
                  {' '}and
                  <Link component={RouterLink} to="/privacy" underline="hover" fontWeight={600} sx={{ ml: 0.5 }}>
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              }
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.3, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
            >
              Create account
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
              Sign in instead
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default SignupPage;

