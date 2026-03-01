import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorisedError() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">401</h1>
        <span className="font-medium">
          Oops! You don't have permission to access this page.
        </span>
        <p className="text-center text-muted-foreground">
          It looks like you tried to access a resource that requires proper
          authentication. <br />
          Please log in with the appropriate credentials.
        </p>
        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Go Back
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
