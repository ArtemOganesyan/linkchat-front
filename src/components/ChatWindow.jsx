import React, { useState, useEffect } from 'react';

const Layout = ({ leftContent, topRightContent, bottomRightContent }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minWidth: '600px',
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid black',
      boxSizing: 'border-box'
    }}>
      <div style={{
        height: '60px',
        borderBottom: '1px solid black',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <h2 style={{ margin: 0 }}>Page Header</h2>
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: '24px', padding: '4px 12px' }}>
            ☰
          </button>
        )}
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: isMobile ? '100%' : '30%',
          borderRight: !isMobile ? '1px solid black' : 'none',
          borderTop: '1px solid black',
          borderBottom: '1px solid black',
          padding: '10px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {leftContent}
        </div>

        {(menuOpen || !isMobile) && (
          <div style={{
            width: isMobile ? '100%' : '70%',
            position: isMobile ? 'absolute' : 'relative',
            top: isMobile ? '60px' : 'unset',
            height: isMobile ? 'calc(100vh - 60px)' : '100%',
            background: 'white',
            borderTop: '1px solid black',
            borderLeft: isMobile ? '1px solid black' : 'none',
            borderBottom: '1px solid black',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              flex: 8,
              overflowY: 'auto',
              borderBottom: '1px solid black',
              padding: '10px',
              boxSizing: 'border-box'
            }}>
              {topRightContent}
            </div>

            <div style={{
              flex: 2,
              padding: '10px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              {bottomRightContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
