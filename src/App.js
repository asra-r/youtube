import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const API_KEY = 'AIzaSyCAMJyjoWbAR0UPJcJDp_FIRvI-1l5_QJ0';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([^\s&]+)/);
    return match ? match[1] : null;
  };

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    const videoId = getVideoId(videoUrl);

    if (!videoId) {
      setError('Invalid YouTube link');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/commentThreads`, {
          params: {
            part: 'snippet',
            videoId,
            maxResults: 30,
            order: 'time',
            key: API_KEY,
          },
        }
      );

      const items = response.data.items.map(item => ({
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
      }));

      setComments(items);
    } catch (err) {
      setError('Failed to fetch comments. Check API quota or video settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>YouTube Comments Viewer</h2>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube video link"
        style={{ width: '100%', padding: 10 }}
      />
      <button onClick={fetchComments} style={{ marginTop: 10 }}>
        Fetch Comments
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {comments.map((c, index) => (
          <li key={index} style={{ margin: '10px 0' }}>
            <strong>{c.author}:</strong> {c.text}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
