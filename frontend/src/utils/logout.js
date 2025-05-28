'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Obriši token iz localStorage
    localStorage.removeItem('auth_token');

    // Možeš obrisati i druge stvari ako koristiš
    // localStorage.clear(); // ako želiš sve obrisati

    // Redirekcija na login
    router.replace('/login');
  }, []);

  return <p>Odjavljujem vas...</p>;
}
