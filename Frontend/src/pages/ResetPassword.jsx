import { useForm } from 'react-hook-form';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (data) => {
    const result = await resetPassword(token, data.password, data.confirmPassword);
    if (result.success) {
      // Redirect to login will be handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              name="password"
              control={control}
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
                }
              }}
            />

            <Input
              name="confirmPassword"
              control={control}
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              rules={{
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              }}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;