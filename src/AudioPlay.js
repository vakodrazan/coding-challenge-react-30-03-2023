import React, { useState, useEffect } from 'react';

var audioFile;
const AudioPlay = () => {
  const [buttonName, setButtonName] = useState('Play');

  const [audio, setAudio] = useState();
  const [audioInfo, setAudioInfo] = useState();

  console.log('audio::::::', audio);
  console.log('audioInfo::::::', audioInfo);

  useEffect(() => {
    if (audioFile) {
      audioFile.pause();
      audioFile = null;
      setButtonName('Play');
    }
    if (audio) {
      audioFile = new Audio(audio);
      audioFile.onended = () => {
        setButtonName('Play');
      };
    }
  }, [audio]);

  const handleClick = () => {
    if (buttonName === 'Play') {
      audioFile.play();
      setButtonName('Pause');
    } else {
      audioFile.pause();
      setButtonName('Play');
    }
  };

  const addFile = (e) => {
    console.log('e.target.files[0]::::::', e.target.files[0]);
    if (e.target.files[0]) {
      setAudio(URL.createObjectURL(e.target.files[0]));

      setAudioInfo({
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{buttonName}</button>
      <input type='file' onChange={addFile} />

      <div>
        <span>{audioInfo?.name}</span>
        <audio controls src={audioInfo?.url} />
      </div>
    </div>
  );
};

export default AudioPlay;
