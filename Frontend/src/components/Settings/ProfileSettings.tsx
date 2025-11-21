import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../features/auth/selectors';
import {
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../../features/auth/api/authApi';
import { useSnackbar } from 'notistack';

const ProfileSettings = () => {
  const user = useAppSelector(selectCurrentUser);
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
  });
  const [resetForm, setResetForm] = useState({
    email: user?.email ?? '',
    token: '',
    newPassword: '',
  });

  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [forgotPassword, { isLoading: sendingForgot }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setProfileForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
    });
    setResetForm((p) => ({ ...p, email: user?.email ?? '' }));
  }, [user?.name, user?.email]);

  const handleProfileSubmit = async () => {
    try {
      await updateProfile(profileForm).unwrap();
      enqueueSnackbar('Profile updated', { variant: 'success' });
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: string } })?.data?.error;
      enqueueSnackbar(msg || 'Failed to update profile', { variant: 'error' });
    }
  };

  const handleForgot = async () => {
    try {
      await forgotPassword({ email: resetForm.email }).unwrap();
      enqueueSnackbar('Reset link sent', { variant: 'info' });
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: string } })?.data?.error;
      enqueueSnackbar(msg || 'Failed to send reset email', { variant: 'error' });
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword({
        email: resetForm.email,
        token: resetForm.token,
        newPassword: resetForm.newPassword,
      }).unwrap();
      enqueueSnackbar('Password updated', { variant: 'success' });
    } catch (err: unknown) {
      const msg = (err as { data?: { error?: string } })?.data?.error;
      enqueueSnackbar(msg || 'Failed to reset password', { variant: 'error' });
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700}>
        Account Settings
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          background: 'var(--card-bg)',
          border: `1px solid var(--muted-color)`,
          boxShadow: `0 18px 40px -32px var(--shadow-color)`,
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Profile
          </Typography>
          <TextField
            label="Full name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
          />
          <TextField
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Button
            variant="contained"
            onClick={handleProfileSubmit}
            disabled={savingProfile}
            sx={{ alignSelf: 'flex-start', borderRadius: 3, px: 3 }}
          >
            {savingProfile ? 'Saving…' : 'Save changes'}
          </Button>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 4,
          background: 'var(--card-bg)',
          border: `1px solid var(--muted-color)`,
          boxShadow: `0 18px 40px -32px var(--shadow-color)`,
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Password
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            Send yourself a reset link or update directly if you already have a token.
          </Typography>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            <TextField
              label="Email"
              type="email"
              value={resetForm.email}
              onChange={(e) => setResetForm((p) => ({ ...p, email: e.target.value }))}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={handleForgot}
              disabled={sendingForgot}
              sx={{ minWidth: 180, borderRadius: 3 }}
            >
              {sendingForgot ? 'Sending…' : 'Send reset link'}
            </Button>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <TextField
              label="Reset token"
              value={resetForm.token}
              onChange={(e) => setResetForm((p) => ({ ...p, token: e.target.value }))}
            />
            <TextField
              label="New password"
              type="password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <Button
              variant="contained"
              onClick={handleReset}
              disabled={resetting}
              sx={{ alignSelf: 'flex-start', borderRadius: 3, px: 3 }}
            >
              {resetting ? 'Updating…' : 'Reset password'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ProfileSettings;
