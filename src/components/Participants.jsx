import { useState, useEffect } from 'react';
import styles from './Participants.module.css';


const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/chat')
    .then(response => response.json())
    .then(data => {
      setParticipants(data.users);
      setError(null);
    })
    .catch(() => {
      setError('Error occured');
      setParticipants([]);
    });
  }, []);

  return (
    <div className={styles.participantsContainer}>
      <div className={styles.participantsList}>
        {
        error ? (<div>{error}</div>) :
        participants.map(participant => (
          <div 
            key={participant.id}
            className={styles.participant}
          >
            {participant.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;