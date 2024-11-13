import { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [mood, setMood] = useState<string>(''); // Store mood input here
  const [showMeditationPlayer, setShowMeditationPlayer] = useState<boolean>(false); // Manage meditation player visibility

  // A basic function to simulate the chatbot response
  const handleSendMessage = async () => {
    if (userInput.trim()) {
      // Add user message to chat
      const userMessage = `User: ${userInput}`;
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Include the user's mood in the prompt for personalized response
      const moodMessage = mood ? `Mood: ${mood}` : 'Mood not provided';

      // Call API to get chatbot response (send mood along with user query)
      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userInput, mood: moodMessage }),
        });

        const data = await response.json();

        // Add bot's response to chat
        setMessages((prevMessages) => [...prevMessages, `Bot: ${data.advice}`]);

        // Trigger meditation if the mood suggests it
        if (data.advice.toLowerCase().includes('relax') || data.advice.toLowerCase().includes('stress')) {
          setShowMeditationPlayer(true);
        }
      } catch (error) {
        console.error('Error fetching chatbot response:', error);
        setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, there was an error.']);
      }

      // Clear input field
      setUserInput('');
    }
  };

  // Function to handle closing the meditation player
  const closeMeditationPlayer = () => {
    setShowMeditationPlayer(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      {/* Input field for user */}
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          className="input-field"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>

      {/* Mood tracker */}
      <div className="mood-tracker">
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling?"
        />
      </div>

      {/* Meditation Player */}
      {showMeditationPlayer && (
        <div className="meditation-player">
          <h3>Guided Meditation</h3>
          <p>Take a deep breath and relax with this meditation session.</p>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/YourMeditationVideoID" // Replace with your meditation video ID
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button onClick={closeMeditationPlayer} className="close-button">
            Close Meditation
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
