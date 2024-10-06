import React, {useState, useEffect} from 'react'
import axios from 'axios';
import videojs from 'video.js'
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';
import './App.css';

function App() {
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({text: '', position: 'top-left', size: 'small'});

  const loadOverlays = async () =>{
    const response = await axios.get('http://localhost:5000/overlays');
    setOverlays(response.data);
  }

  const handleCreateOverlay = async ()=>{
    await axios.post('http://localhost:5000/overlays', newOverlay);
    loadOverlays();
  }

  const handleDeleteOverlay = async(id) => {
    await axios.delete(`http://localhost:5000/overlays/${id}`);
    loadOverlays();
  }

  useEffect(() => {
    loadOverlays();
    const video = document.getElementById('livestream-video');
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('https://rtsp.me/embed/faN3T75N/');  // Load HLS stream from VLC or FFmpeg
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://rtsp.me/embed/faN3T75N/';  // Directly set the video source if the browser supports HLS
    }
  }, []);

  return (
    <div className="App">
      <h1>RTSP Livestream with Overlays</h1>
      <div className='video-container'>
      <iframe className='video-js'
        src='https://rtsp.me/embed/faN3T75N/'
        width='600'
        height='300'
        allowFullScreen
      ></iframe>
      </div>

      <div className='overlay-controls'>
        <h2>Create Overlay</h2>
        <input type='text' value={newOverlay.text} onChange={(e) => setNewOverlay({...newOverlay, text: e.target.value})} placeholder='Overlay Text'></input>
        <button onClick={handleCreateOverlay}>Add Overlay</button>
      </div>

      <div className='overlay-list'>
        <h2>Existing Overlays</h2>
        {overlays.map((overlay)=>(
          <div key={overlay._id} className='overlay-item'>
            <span>{overlay.text}</span>
            <button onClick={()=> handleDeleteOverlay(overlay._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
