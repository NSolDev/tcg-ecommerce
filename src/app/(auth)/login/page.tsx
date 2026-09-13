// src/app/(auth)/login/page.tsx
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { isRateLimited, rateLimit, getClientIp } from '@/lib/rate-limit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { getSafeRedirectUrl } from '@/lib/utils/url';
import '../auth.css';
import './login.css';

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  // ✅ Validar callbackUrl de forma segura
  const callbackUrl = getSafeRedirectUrl(searchParams?.callbackUrl, '/');
  const error = searchParams?.error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-card-title">Iniciar Sesión</h1>
          <p className="auth-card-description">Ingresa tus credenciales para acceder</p>
        </div>

        {/* ✅ Mostrar errores de rate limiting */}
        {error === 'rate_limit' && (
          <div className="auth-error">Demasiados intentos. Por favor, espera 15 minutos.</div>
        )}
        {error === 'credentials' && (
          <div className="auth-error">Email o contraseña incorrectos.</div>
        )}

        <form
          action={async (formData) => {
            'use server';
            const email = (formData.get('email')?.toString() ?? '').toLowerCase();
            // Throttle brute force: only FAILED attempts count, so a legitimate
            // successful login never trips the limit. Keyed by IP + email.
            const LIMIT = 8;
            const WINDOW = 15 * 60 * 1000;
            const key = `login:${getClientIp()}:${email}`;
            if (isRateLimited(key, LIMIT)) {
              redirect('/login?error=rate_limit');
            }
            // ✅ Asegurar que redirectTo es seguro
            const safeRedirect = getSafeRedirectUrl(formData.get('redirectTo')?.toString(), '/');
            try {
              await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirectTo: safeRedirect,
              });
            } catch (err) {
              // Invalid credentials → count the failure and show a message. A successful
              // sign-in throws NEXT_REDIRECT (not an AuthError), which we rethrow so it runs.
              if (err instanceof AuthError) {
                rateLimit(key, LIMIT, WINDOW);
                redirect('/login?error=credentials');
              }
              throw err;
            }
          }}
          className="auth-form"
        >
          <div className="auth-form-group">
            <Label htmlFor="email" className="auth-form-label">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="auth-form-input"
            />
          </div>
          <div className="auth-form-group">
            <Label htmlFor="password" className="auth-form-label">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="auth-form-input"
            />
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <button type="submit" className="auth-form-submit">
            Iniciar Sesión
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-text">O continuar con</span>
        </div>

        <div className="auth-social">
          <form
            action={async () => {
              'use server';
              const safeRedirect = getSafeRedirectUrl(callbackUrl, '/');
              await signIn('google', { redirectTo: safeRedirect });
            }}
          >
            <button type="submit" className="auth-social-btn">
              <svg className="login-social-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </form>

          <form
            action={async () => {
              'use server';
              const safeRedirect = getSafeRedirectUrl(callbackUrl, '/');
              await signIn('github', { redirectTo: safeRedirect });
            }}
          >
            <button type="submit" className="auth-social-btn">
              <svg className="login-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </form>
        </div>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="auth-footer-link">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
