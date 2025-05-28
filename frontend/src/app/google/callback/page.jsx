'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("➡️ Pozvana je ruta /google/callback");
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('userRole', role);
      router.push('/user/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.text}>Prijava u toku...</p>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#fff',
    color: '#6a0dad', // ljubičasta boja
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '8px solid #eee',
    borderTop: '8px solid #6a0dad',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    fontSize: '1.2rem',
    fontWeight: '600',
  },
};

// CSS keyframes za spinner animaciju (ubaci u global CSS ili style jsx)
const styleSheet = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Ubaci keyframes u <style> element u <head>
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styleSheet;
  document.head.appendChild(style);
}

export default GoogleCallback;
