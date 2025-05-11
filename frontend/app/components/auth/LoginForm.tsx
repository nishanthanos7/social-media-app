'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.username, data.password);
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
      {/* Left side - Welcome text */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-fb-blue mb-4">facebook</h1>
        <p className="text-xl mb-6">Facebook helps you connect and share with the people in your life.</p>
        <img
          src="https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/OBaVg52wtTZ.png"
          alt="Facebook connection"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1">
        <div className="fb-content p-4">
          <div className="fb-section-header text-sm mb-3">Login</div>

          {error && (
            <div className="p-2 mb-3 text-xs text-red-800 bg-red-50" role="alert">
              {error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-xs mb-1">
                Email or Username:
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="fb-input w-full"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs mb-1">
                Password:
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="fb-input w-full"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="fb-button"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="text-center mt-3">
              <Link href="/auth/register" className="fb-link text-xs">
                Sign up for Facebook
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
