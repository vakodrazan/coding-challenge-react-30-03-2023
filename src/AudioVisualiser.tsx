import React from 'react';
import { useRef, useState } from 'react';

export default function AudioVisualiser() {
  const [file, setFile] = useState<File>();
  const canvasRef = useRef<HTMLCanvasElement | any>();
  const audioRef = useRef<HTMLAudioElement | any>();
  const source = useRef<HTMLElement | any>();
  const analyzer = useRef<HTMLElement | any>();

  console.log('canvasRef::::::', canvasRef);

  const visualizeData = () => {
    const animationController = window.requestAnimationFrame(visualizeData);
    if (audioRef.current.paused) {
      return cancelAnimationFrame(animationController);
    }

    const audioData = new Uint8Array(140);
    analyzer.current.getByteFrequencyData(audioData);
    const bar_width = 3;
    let start = 0;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < audioData.length; i++) {
      start = i * 4;
      let gradient = ctx.createLinearGradient(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      gradient.addColorStop(0.2, '#2392f5');
      gradient.addColorStop(0.5, '#fe0095');
      gradient.addColorStop(1.0, 'purple');
      ctx.fillStyle = gradient;
      ctx.fillRect(start, canvasRef.current.height, bar_width, -audioData[i]);
    }
  };

  const handleAudioPlay = () => {
    let audioContext = new AudioContext();
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audioRef.current);
      analyzer.current = audioContext.createAnalyser();
      source.current.connect(analyzer.current);
      analyzer.current.connect(audioContext.destination);
    }
    visualizeData();
  };

  return (
    <div className='audio-visualiser'>
      <div className='upload-container'>
        <label htmlFor='audioUploader' className='file-upload'>
          Upload audio
        </label>
        <span className='file-title'>{file?.name || 'No file chosen'}</span>
        <input
          type='file'
          name='audioUploader'
          id='audioUploader'
          accept='audio/*'
          className='upload'
          onChange={({ target: { files } }) =>
            files?.length && setFile(files[0])
          }
        />
      </div>
      {/* 
        Adding this condition so that it won't show the audio preview and canvas while there is nothing to play 
        It will return true if the file variable is not empty but false when it is empty 
      */}
      {file && (
        <div className='audio-container'>
          <canvas className='canvas' ref={canvasRef} width={500} height={300} />
          <audio
            ref={audioRef}
            onPlay={handleAudioPlay}
            src={window.URL.createObjectURL(file)}
            controls
            className='audio-controller'
          />
        </div>
      )}
    </div>
  );
}
