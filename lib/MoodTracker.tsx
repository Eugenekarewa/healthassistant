import { useState } from 'react';

const MoodTracker = () => {
  const [mood, setMood] = useState<string>('neutral');
  const [moodHistory, setMoodHistory] = useState<string[]>([]);

  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
    setMoodHistory([...moodHistory, `Mood: ${newMood}`]);
  };

  return (
    <div>
      <h2>Track Your Mood</h2>
      <div>
        <button onClick={() => handleMoodChange('happy')}>Happy</button>
        <button onClick={() => handleMoodChange('neutral')}>Neutral</button>
        <button onClick={() => handleMoodChange('sad')}>Sad</button>
      </div>
      <div>
        <h3>Mood History</h3>
        {moodHistory.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
