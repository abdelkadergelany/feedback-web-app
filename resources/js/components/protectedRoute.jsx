// resources/js/Components/ProtectedRoute.jsx
import React from 'react';
import { usePage, router } from '@inertiajs/react';
import { useAuth } from '../pages/context/auth'

const ProtectedRoute = ({ children }) => {
  //const { auth } = usePage().props;
   const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      router.visit('/login');
    }
  }, [user]);

  return user ? children : null;
};

export default ProtectedRoute;