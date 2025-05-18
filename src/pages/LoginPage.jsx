
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useToast } from '../hooks/use-toast.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect based on user role happens in AuthContext
        navigate('/');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login buttons
  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    let demoEmail;
    
    switch (role) {
      case 'admin':
        demoEmail = 'admin@example.com';
        break;
      case 'resident':
        demoEmail = 'resident@example.com';
        break;
      case 'watchman':
        demoEmail = 'watchman@example.com';
        break;
      default:
        demoEmail = 'admin@example.com';
    }
    
    try {
      const success = await login(demoEmail, 'password');
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        variant: 'destructive',
        title: 'Demo Login Failed',
        description: 'Failed to login with demo account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Login to Royal Park Estate</h1>
            <p className="text-slate-600 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with demo accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <Button variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isLoading}>
                Admin
              </Button>
              <Button variant="outline" onClick={() => handleDemoLogin('resident')} disabled={isLoading}>
                Resident
              </Button>
              <Button variant="outline" onClick={() => handleDemoLogin('watchman')} disabled={isLoading}>
                Watchman
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;
