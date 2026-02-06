/**
 * Authentication form component for login and signup.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { apiClient } from '@/lib/api-client';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Submitting form with email:', email, 'password length:', password.length);

    try {
      if (mode === 'signup') {
        console.log('Calling apiClient.signup');
        await apiClient.signup({ email, password });
        console.log('Signup successful, redirecting to /tasks');
      } else {
        console.log('Calling apiClient.login');
        await apiClient.login({ email, password });
        console.log('Login successful, redirecting to /tasks');
      }
      router.push('/tasks');
    } catch (err: any) {
      console.log(`${mode} error:`, err);
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.detail ||
        'An error occurred. Please try again.';
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
          required
          minLength={8}
          disabled={isLoading}
          helperText={mode === 'signup' ? 'Password must be at least 8 characters' : undefined}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        {mode === 'signup' ? 'Sign Up' : 'Log In'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        {mode === 'signup' ? (
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </a>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
