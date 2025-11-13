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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

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
          maxWidth: 480,
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
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--secondary-text-color)' }}>
              Sign in to continue crafting stunning AI-generated videos.
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
            Continue with Google
          </Button>

          <Divider sx={{ opacity: 0.6 }}>or</Divider>

          <Stack component="form" spacing={2.5}>
            <TextField
              label="Email address"
              type="email"
              placeholder="you@company.com"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
              <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
              <Link component={RouterLink} to="/forgot-password" underline="hover" fontWeight={600}>
                Forgot password?
              </Link>
            </Stack>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.3, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
            >
              Sign in
            </Button>
          </Stack>

          <Typography variant="body2" textAlign="center">
            New to Visura?{' '}
            <Link component={RouterLink} to="/signup" underline="hover" fontWeight={600}>
              Create an account
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default LoginPage;

