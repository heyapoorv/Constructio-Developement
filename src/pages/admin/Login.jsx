import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loginAdmin } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error } = await loginAdmin(email, password);
    
    if (error) {
      setError('Authentication failed. Verify your credentials.');
      setIsSubmitting(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container-low p-8 border border-outline-variant/30 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img alt="Monolith Logo" className="h-10 w-auto object-contain mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5AYFHbM5gZlQiaXjNgyQrugej9B6JVkQfej4yD54U4Cvd_bFRhnSUcI_YcWS_31Pa6J2UjsAgTInY0LxrZsp3GMDOj7NX1OFjd7kktmwltExp7NKlSNPOtOcVj9V7eI3mJgVzYmhyl8yxZrx2_idbJhL-JY4FKHtCd1uTUcW3oya-qzALgtoHLoCjETu1nR9hTwdp5WemgoXaqkZqDMeop-DEml-BovxK0EH7kvvAw4U71YnD1Wj" />
          <h1 className="font-headline-md text-headline-md uppercase text-primary tracking-widest text-center">Monolith CMS</h1>
          <p className="font-label-caps text-label-caps uppercase tracking-widest text-outline mt-2">Restricted Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#b3261e]/10 border border-[#b3261e] text-[#b3261e] font-body-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" 
              placeholder="Email" 
            />
            <label htmlFor="email" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Admin Email</label>
          </div>
          
          <div className="relative border-b border-outline-variant focus-within:border-primary transition-colors">
            <input 
              required 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent pt-4 pb-2 text-primary font-body-md focus:outline-none peer placeholder-transparent" 
              placeholder="Password" 
            />
            <label htmlFor="password" className="absolute left-0 top-0 text-outline font-label-caps text-label-caps uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-md peer-focus:top-0 peer-focus:text-label-caps peer-focus:text-primary">Password</label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 py-4 bg-primary text-surface hover:bg-secondary hover:text-primary font-label-caps text-label-caps uppercase tracking-[0.18em] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <a href="/" className="font-label-caps text-label-caps uppercase tracking-widest text-outline hover:text-primary transition-colors">
            &larr; Return to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
