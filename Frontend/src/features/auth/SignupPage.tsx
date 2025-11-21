import { useState} from 'react';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { useSignupMutation } from './api/authApi';
import { useSnackbar } from 'notistack';

const SignupPage = () => {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agree: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      await signup(payload).unwrap();

      enqueueSnackbar("Account created successfully!", {
        variant: "success",
      });
      navigate("/login");

    } catch (err: any) {
      enqueueSnackbar(err?.data?.message || "Signup failed", {
        variant: "error",
      });
      console.error("Signup error:", err);
    }
  };

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

          <Stack component="form" spacing={2.5} onSubmit={handleSubmit(onSubmit)}>

            {/* NAME ROW */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First name"
                fullWidth
                {...register("firstName", { required: "First name is required" })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                label="Last name"
                fullWidth
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Stack>

            {/* EMAIL */}
            <TextField
              label="Work email"
              type="email"
              placeholder="you@studio.com"
              fullWidth
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* PASSWORD */}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              fullWidth
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* TERMS CHECKBOX */}
            <FormControlLabel
              control={<Checkbox size="small" {...register("agree", { required: true })} />}
              label={
                <Typography variant="body2">
                  I agree to the
                  <Link component={RouterLink} to="/terms" underline="hover" fontWeight={600} sx={{ ml: 0.5 }}>
                    Terms of Service
                  </Link>{' '}
                  and
                  <Link component={RouterLink} to="/privacy" underline="hover" fontWeight={600} sx={{ ml: 0.5 }}>
                    Privacy Policy
                  </Link>.
                </Typography>
              }
            />
            {errors.agree && (
              <Typography variant="caption" color="error">
                You must accept the agreement
              </Typography>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.3, borderRadius: 999, textTransform: 'none', fontWeight: 700 }}
            >
              {isLoading ? "Creating..." : "Create account"}
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
