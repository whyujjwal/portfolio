import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faArrowRight, faRotate, faHome, 
  faSearch, faTimes, faStar, faList 
} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import './BrowserApp.css';

const BrowserApp = () => {
  const [url, setUrl] = useState('https://github.com/whyujjwal');
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bookmarks, setBookmarks] = useState([
    { title: 'GitHub', url: 'https://github.com/whyujjwal' },
    { title: 'LinkedIn', url: 'https://linkedin.com' },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com' }
  ]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  const iframeRef = React.useRef(null);
  
  useEffect(() => {
    if (url && historyIndex === -1) {
      setHistory(prev => [...prev, url]);
      setHistoryIndex(history.length);
    }
  }, [url]);
  
  const navigate = (newUrl) => {
    setIsLoading(true);
    setUrl(newUrl);
    // Remove future history entries if navigating from a previous point
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    setHistory(prev => [...prev, newUrl]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setUrl(history[historyIndex - 1]);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setUrl(history[historyIndex + 1]);
    }
  };
  
  const refresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };
  
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url;
    }
    
    navigate(processedUrl);
  };
  
  const addBookmark = () => {
    const title = prompt('Enter a title for this bookmark:', new URL(url).hostname);
    if (title) {
      setBookmarks(prev => [...prev, { title, url }]);
    }
  };
  
  const removeBookmark = (index) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  // Some websites don't allow iframe embedding due to X-Frame-Options header
  // In a real app, you'd need a proxy server or alternative solution
  return (
    <div className="app browser-app">
      <div className="browser-toolbar">
        <div className="browser-nav-buttons">
          <button 
            onClick={goBack} 
            disabled={historyIndex <= 0}
            className="browser-button"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex >= history.length - 1}
            className="browser-button"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button onClick={refresh} className="browser-button">
            <FontAwesomeIcon icon={faRotate} />
          </button>
          <button 
            onClick={() => navigate('https://github.com/whyujjwal')} 
            className="browser-button"
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
        </div>
        
        <form onSubmit={handleUrlSubmit} className="browser-url-form">
          <div className="browser-url-bar">
            <FontAwesomeIcon icon={faSearch} className="browser-url-icon" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or search"
              className="browser-url-input"
            />
            {url && (
              <button 
                type="button" 
                onClick={() => setUrl('')}
                className="browser-clear-button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </form>
        
        <div className="browser-actions">
          <button 
            onClick={addBookmark} 
            title="Add bookmark"
            className="browser-button"
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
          <button 
            onClick={() => setShowBookmarks(!showBookmarks)} 
            title="Show bookmarks"
            className={`browser-button ${showBookmarks ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>
      
      {showBookmarks && (
        <div className="browser-bookmarks">
          {bookmarks.map((bookmark, index) => (
            <div key={index} className="bookmark-item">
              <span 
                className="bookmark-title"
                onClick={() => navigate(bookmark.url)}
              >
                {bookmark.title}
              </span>
              <button 
                onClick={() => removeBookmark(index)}
                className="bookmark-remove"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="browser-content">
        {isLoading && (
          <div className="browser-loading">
            <div className="browser-loading-spinner"></div>
            <span>Loading...</span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          title="Browser"
          width="100%"
          height="100%"
          onLoad={handleIframeLoad}
          className={isLoading ? 'loading' : ''}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

export default BrowserApp;
