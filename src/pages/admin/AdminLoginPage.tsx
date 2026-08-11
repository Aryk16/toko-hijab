import { useState } from 'react';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => onNavigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft size={16} /> Kembali ke toko
        </button>

        <div className="card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-primary-50">
              <Lock size={26} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary-900">Admin Login</h1>
            <p className="mt-1 text-sm text-primary-600">Masuk untuk mengelola toko Xavier Fashion Boutique&apos;s</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@xavierfashionboutiques"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary-800">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
