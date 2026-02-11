import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Welcome from './Welcome';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [guestUser, setGuestUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitialized(true);
    });

    const savedGuestName = localStorage.getItem('guestUserName');
    if (savedGuestName) {
      setGuestUser({ displayName: savedGuestName, isGuest: true });
    }
    setIsInitialized(true);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleGuestStart = (name) => {
    const guest = { displayName: name, isGuest: true };
    setGuestUser(guest);
    localStorage.setItem('guestUserName', name);
  };

  const handleGoogleSignIn = (firebaseUser) => {
    setUser(firebaseUser);
    setGuestUser(null);
    localStorage.removeItem('guestUserName');
  };

  const handleLogout = () => {
    setUser(null);
    setGuestUser(null);
    localStorage.removeItem('guestUserName');
  };

  if (!isInitialized) {
    return null;
  }

  const currentUser = user || guestUser;

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <Welcome
      onGuestStart={handleGuestStart}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}

export default App;
