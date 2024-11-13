import { useState, useEffect } from 'react';

const PersonalizedSupport = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch personalized user data (e.g., from API or localStorage)
    const fetchUserData = async () => {
      const data = await fetch('/api/user');
      const user = await data.json();
      setUserData(user);
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {userData ? (
        <div>
          <h2>Welcome, {userData.name}</h2>
          <p>Your personalized support: {userData.support}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PersonalizedSupport;
