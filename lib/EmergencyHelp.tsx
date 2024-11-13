import { useRouter } from 'next/router';

const EmergencyHelp = () => {
  const router = useRouter();

  const handleEmergencyContact = () => {
    // Redirect to emergency help page or contact services
    router.push('/emergency');
  };

  return (
    <div>
      <h2>Need Emergency Help?</h2>
      <button onClick={handleEmergencyContact}>Contact Emergency Services</button>
    </div>
  );
};

export default EmergencyHelp;
