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
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import { useLoginMutation } from './api/authApi';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
   const { enqueueSnackbar } = useSnackbar();
      const [login, { isLoading }] = useLoginMutation();
      const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm({
        defaultValues: {
          email: "",
          password: "",
          rememberMe: false
        }
      });
       const onSubmit = async (data : any ) => {
         try {
    const res = await login(data).unwrap(); 
    navigate('/');
    // console.log("Logged in:", res);
     enqueueSnackbar("Logged in successfully!", {
      variant: "success",
    });
  } catch (err: any) {
    console.log("Login failed:", err);
       enqueueSnackbar(err?.data?.error || "Login failed", {
      variant: "error",
    });

  }
      }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
       background: `
  radial-gradient(600px at 20% 20%, var(--purple-blob), transparent 70%),
  radial-gradient(800px at 80% 70%, var(--purple-blob-strong), transparent 75%),
  linear-gradient(135deg, var(--hero-bg-start), var(--hero-bg-end))
`,
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
              {...register("email", { required: "Email is required" })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              fullWidth
              variant="outlined"
              {...register("password", { required: "password is required" })}
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
              <FormControlLabel control={<Checkbox size="small" />} label="Remember me"  />
              <Link component={RouterLink} to="/forgot-password" underline="hover" fontWeight={600}>
                Forgot password?
              </Link>
            </Stack>
            <Button
              variant="contained"
              size="large"
              type='submit'
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              sx={{ py: 1.3, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
              onClick={handleSubmit(onSubmit)}
             
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

