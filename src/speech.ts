interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true; // 실시간으로 텍스트가 적히도록
    recognition.maxAlternatives = 1;
  
    // 요소 선택
    const micBtn = document.querySelector('.voice button') as HTMLButtonElement;
    const input = document.getElementById('txtSource') as HTMLTextAreaElement;
    const overlay = document.getElementById('overlay') as HTMLDivElement;
  
    // 음성 인식 API가 지원되는지 확인
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식 API를 지원하지 않습니다.');
    } else {
      console.log('음성 인식 API를 사용할 수 있습니다.');
  
      // 마이크 권한 요청
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ko-KR';
          recognition.interimResults = true; 
          recognition.maxAlternatives = 1;
  
          if (micBtn && input) {
            micBtn.addEventListener('click', () => {
              recognition.start();
              overlay.style.display = 'flex';
              overlay.innerHTML = '<p>저에게 말씀해주세요!</p>';  // 안내 메시지 추가
            });
  
            recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
              let interimTranscript = '';
              let finalTranscript = '';
  
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                if (result.isFinal) {
                  finalTranscript += result[0].transcript;
                } else {
                  interimTranscript += result[0].transcript;
                }
              }
  
              input.value = finalTranscript + interimTranscript;
              console.log('현재 텍스트:', input.value);
  
              // 최종 결과가 나오면 등록 버튼 클릭 (선택사항)
              if (finalTranscript) {
                setTimeout(() => {
                  const regBtn = document.querySelector('.regist-btn') as HTMLButtonElement;
                  regBtn?.click();
                }, 2200);
              }
            });
  
            recognition.addEventListener('end', () => {
              overlay.style.display = 'none';  // 음성 인식이 끝나면 overlay 숨김
            });
          }
        })
        .catch((error) => {
          console.error('마이크 권한을 승인하지 않았습니다.', error);
          alert('마이크 권한을 승인해주세요.');
        });
    }
  });
  