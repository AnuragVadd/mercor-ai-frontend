import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Context from '../../context';
import axios from 'axios'
function MeetingHeader() {
  const { meeting } = useContext(Context);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [mute, setMute] = useState(false);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // recognition.interimResults = true;

    recognition.addEventListener('start', () => {
      setRecording(true);
    });

    recognition.addEventListener('result', event => {
      const { transcript } = event.results[event.results.length - 1][0];

      setTranscript(transcript);
      console.log(transcript)
      // speakTranscript(transcript)
      // setMute(false)
    });

    recognitionRef.current = recognition;
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      
      setRecording(false);
      // sendTranscript()
    }
  };

  const speakTranscript = text => {
    if(transcript.toLocaleLowerCase().includes('sam')){
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      
      speechSynthesisRef.current.speak(utterance);
    }else {
      console.log("oops")
    }

  };

  const sendTranscript = async () => {
      await axios
      .post('http://localhost:3000/stop-recognition', { "data" : transcript })
      .then(response => {
        // console.log(response);
        speakTranscript(response.data)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const stopGptResponse = () => {
    speechSynthesis.cancel()
  }

  const muteUnmute = () => {
    if(mute){
      stopRecording()
      setMute(false)
    }else{
      startRecording()
      setMute(true)
    }
    // Implement the mute/unmute functionality
  };
  const history = useHistory();

  const stopMeeting = () => {
    history.push('/');
  };

  return (
    <div className="header">
      <div className="header__left">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={stopMeeting}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="header__app-name">{meeting?.meeting_title}</span>
        <button onClick={muteUnmute}> {mute ? "Recording" : "Record ChatGPT Transcript"}</button> 

        <button onClick={sendTranscript}>play gpt response</button> 
        <button onClick={stopGptResponse}>stop chat gpt response</button> 
      </div>
    </div>
  );
}

export default MeetingHeader;