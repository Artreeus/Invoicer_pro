import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Gate protected routes: send unauthenticated visitors to the login page,
// remembering where they were headed so we can return them after sign-in.
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAuthStore(s => s.status);
  const location = useLocation();

  if (status === 'authenticated') return <>{children}</>;
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
