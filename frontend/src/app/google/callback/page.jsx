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
      // Prikazati grešku
      router.push('/login');
    }
  }, []);

  return <div>Prijava u toku...</div>;
};

export default GoogleCallback;
