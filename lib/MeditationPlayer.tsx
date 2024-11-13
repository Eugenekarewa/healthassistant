const MeditationPlayer = () => {
    return (
      <div>
        <h2>Guided Meditation</h2>
        <audio controls>
          <source src="/path-to-your-meditation-audio.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };
  
  export default MeditationPlayer;
  