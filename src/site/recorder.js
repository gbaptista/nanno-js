class Recorder {
  setup(canvasElement, videoElement) {
    const videoStream = canvasElement.captureStream();

    const self = this;

    self.mediaRecorder = new MediaRecorder(videoStream);

    self.chunks = [];
    self.mediaRecorder.ondataavailable = (event) => {
      self.chunks.push(event.data);
    };

    videoElement.setAttribute('controls', 'controls');

    self.mediaRecorder.onstop = () => {
      const blob = new Blob(self.chunks, { type: 'video/webm' });
      self.chunks = [];
      const videoURL = URL.createObjectURL(blob);
      videoElement.setAttribute('src', videoURL);
    };
  }

  start() {
    this.mediaRecorder.start();
  }

  finish() {
    this.mediaRecorder.stop();
  }
}

export default Recorder;
