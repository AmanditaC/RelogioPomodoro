import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [workTime, setWorkTime] = useState(1 * 60); // 25 minutos em segundos
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutos em segundos
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  // Referência para o elemento de áudio
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      // Reproduz o som quando o tempo acaba
      if (audioRef.current) {
        audioRef.current.play();
      }
      // Alterna entre tempo de trabalho e descanso
      if (isWorkTime) {
        setTimeLeft(breakTime);
        setIsWorkTime(false);
      } else {
        setTimeLeft(workTime);
        setIsWorkTime(true);
      }
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, workTime, breakTime, isWorkTime]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setTimeLeft(workTime);
    // Para o som ao reiniciar
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="app">
      <h1>Relógio Pomodoro</h1>
      <div className="timer">
        <h2>{isWorkTime ? 'Tempo de Trabalho' : 'Tempo de Descanso'}</h2>
        <h3>{formatTime(timeLeft)}</h3>
      </div>
      <div className="controls">
        <button onClick={startTimer} disabled={isActive}>
          Iniciar
        </button>
        <button onClick={pauseTimer} disabled={!isActive}>
          Pausar
        </button>
        <button onClick={resetTimer}>Reiniciar</button>
      </div>
      {/* Elemento de áudio */}
      <audio ref={audioRef} src="/SOMDODESPERTADOR.mp3" />
    </div>
  );
}

export default App;