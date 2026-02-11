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
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-lg">Please wait for sometime</p>
      </div>
    );
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
