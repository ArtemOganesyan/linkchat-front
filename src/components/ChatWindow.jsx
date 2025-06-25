import React, { useState, useEffect } from 'react';
import styles from './ChatWindow.module.css';

const Loader = () => (
  <div className={styles.loader} style={{ margin: '0 auto', width: 32, height: 32 }} />
);

const ChatWindow = ({
  leftContent,
  topRightContent,
  bottomRightContent,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true); 
    fetch('http://localhost:8080/api/chat')
      .then(response => response.json())
      .then(data => {
        setChatTitle(data.title);
        setError(null);
        setLoading(false); 
      })
      .catch(() => {
        setError('Error loading chat title');
        setChatTitle('Chat');
        setLoading(false); 
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          {loading ? <Loader /> :error ? 'Chat' : chatTitle}
        </h2>
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.menuButton}
          >
            ☰
          </button>
        )}
      </div>
      <div className={styles.body}>
        {!isMobile && (
          <div className={styles.leftContent}>{leftContent}</div>
        )}

        <div
          className={
            isMobile
              ? `${styles.rightContent} ${styles.rightContentMobile}`
              : styles.rightContent
          }
        >
          <div className={styles.topRightContent}>
            {topRightContent}
          </div>

          <div className={styles.bottomRightContent}>
            {bottomRightContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
