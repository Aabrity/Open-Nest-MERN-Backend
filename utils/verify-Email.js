import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email/${token}`, {
          method: 'GET',
        });
        const data = await res.json();
        setStatus(data.message);
        if (data.message === 'Email successfully verified!') {
          setTimeout(() => navigate('/sign-in'), 2000); // Redirect to Sign In page after verification
        }
      } catch (error) {
        setStatus('Verification failed. Please try again.');
      }
    };
    
    verifyUserEmail();
  }, [token, navigate]);

  return (
    <div className="text-center">
      <h1>{status}</h1>
    </div>
  );
};

export default VerifyEmail;
