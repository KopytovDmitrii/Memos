class VoiceService {
  constructor() {
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.isListening = false;
    this.onTranscriptCallback = null;
    this.onVoiceNoteCallback = null;
    this.onErrorCallback = null;
    this.onStatusChangeCallback = null;
    
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    // Проверяем поддержку SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('SpeechRecognition не поддерживается в этом браузере');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ru-RU';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyStatusChange();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && this.onTranscriptCallback) {
        this.onTranscriptCallback(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
      this.isListening = false;
      this.notifyStatusChange();
      
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notifyStatusChange();
    };
  }

  // Начать распознавание речи для преобразования в текст
  startListening(onTranscript, onError) {
    if (!this.recognition) {
      onError?.('SpeechRecognition не поддерживается');
      return;
    }

    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Ошибка запуска распознавания:', error);
      onError?.(error.message);
    }
  }

  // Остановить распознавание речи
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Начать запись голосовой заметки
  async startVoiceRecording(onVoiceNote, onError) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.('Запись аудио не поддерживается');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;
      this.onVoiceNoteCallback = onVoiceNote;
      this.onErrorCallback = onError;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceNote = {
          id: this.generateId(),
          audioUrl,
          audioBlob,
          duration: this.calculateDuration(),
          addedTime: new Date().toISOString(),
          title: `Voice Note ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          progress: 0
        };

        this.onVoiceNoteCallback?.(voiceNote);
        this.isRecording = false;
        this.notifyStatusChange();
      };

      this.mediaRecorder.start();
      this.notifyStatusChange();
    } catch (error) {
      console.error('Ошибка записи аудио:', error);
      this.isRecording = false;
      this.notifyStatusChange();
      onError?.(error.message);
    }
  }

  // Остановить запись голосовой заметки
  stopVoiceRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  // Воспроизвести голосовую заметку
  playVoiceNote(audioUrl, onProgress, onEnd) {
    const audio = new Audio(audioUrl);
    
    audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      onProgress?.(progress);
    });

    audio.addEventListener('ended', () => {
      onEnd?.();
    });

    audio.play().catch(error => {
      console.error('Ошибка воспроизведения:', error);
    });

    return audio;
  }

  // Остановить воспроизведение
  stopPlayback(audio) {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }



  // Установить обработчик изменения статуса
  onStatusChange(callback) {
    this.onStatusChangeCallback = callback;
  }

  // Уведомить об изменении статуса
  notifyStatusChange() {
    this.onStatusChangeCallback?.({
      isRecording: this.isRecording,
      isListening: this.isListening
    });
  }

  // Получить текущий статус
  getStatus() {
    return {
      isRecording: this.isRecording,
      isListening: this.isListening
    };
  }

  // Генерация ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Расчет длительности записи
  calculateDuration() {
    // Упрощенный расчет - в реальном приложении нужно отслеживать время начала
    const seconds = Math.floor(Math.random() * 60) + 10; // 10-70 секунд для демо
    return seconds;
  }

  // Очистка ресурсов
  cleanup() {
    this.stopListening();
    this.stopVoiceRecording();
    this.isListening = false;
    this.isRecording = false;
    this.onTranscriptCallback = null;
    this.onVoiceNoteCallback = null;
    this.onErrorCallback = null;
    this.onStatusChangeCallback = null;
  }
}

// Создаем единственный экземпляр сервиса
const voiceService = new VoiceService();

export default voiceService; 