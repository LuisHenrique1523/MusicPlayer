export class Player extends EventTarget {
  constructor(audioEl, tracks) {
    super();
    this.audio = audioEl;
    this.tracks = tracks;
    this.index = 0;
    this.playing = false;
    this.shuffle = false;
    this.repeat = "off";
    this.current = 0;
    this.duration = 0;
    this.volume = 0.8;
    this.muted = false;

    this.audio.volume = this.volume;
    this.audio.preload = "metadata";

    this.audio.addEventListener("loadedmetadata", () => {
      this.duration = this.audio.duration;
      this._emit("durationchange");
    });
    this.audio.addEventListener("timeupdate", () => {
      this.current = this.audio.currentTime;
      this._emit("timeupdate");
    });
    this.audio.addEventListener("play", () => {
      this.playing = true;
      this._emit("playstate");
    });
    this.audio.addEventListener("pause", () => {
      this.playing = false;
      this._emit("playstate");
    });
    this.audio.addEventListener("ended", () => this.next(true));

    this._loadTrack(false);
  }

  get track() {
    return this.tracks[this.index];
  }

  _emit(type) {
    this.dispatchEvent(new CustomEvent(type));
  }

  _loadTrack(autoplay) {
    this.current = 0;
    this.duration = 0;
    this.audio.src = this.track.src;
    this.audio.load();
    this._emit("trackchange");
    if (autoplay) void this.audio.play().catch(() => {});
  }

  go(i, autoplay = true) {
    this.index = (i + this.tracks.length) % this.tracks.length;
    this._loadTrack(autoplay);
  }

  toggle() {
    if (this.audio.paused) void this.audio.play().catch(() => {});
    else this.audio.pause();
  }

  next(auto = false) {
    if (auto && this.repeat === "one") {
      this.audio.currentTime = 0;
      void this.audio.play().catch(() => {});
      return;
    }
    if (this.shuffle) {
      let r = this.index;
      while (this.tracks.length > 1 && r === this.index) r = Math.floor(Math.random() * this.tracks.length);
      this.go(r, true);
      return;
    }
    if (auto && this.repeat === "off" && this.index === this.tracks.length - 1) {
      this.go(0, false);
      return;
    }
    this.go(this.index + 1, true);
  }

  prev() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    this.go(this.index - 1, true);
  }

  playIndex(i) {
    if (i === this.index) {
      this.toggle();
      return;
    }
    this.go(i, true);
  }

  playTrack(id) {
    const i = this.tracks.findIndex((t) => t.id === id);
    if (i < 0) return;
    if (i === this.index) {
      void this.audio.play().catch(() => {});
      return;
    }
    this.go(i, true);
  }

  toggleTrack(id) {
    const i = this.tracks.findIndex((t) => t.id === id);
    if (i >= 0) this.playIndex(i);
  }

  setShuffle(v) {
    this.shuffle = v;
    this._emit("togglechange");
  }

  cycleRepeat() {
    this.repeat = this.repeat === "off" ? "all" : this.repeat === "all" ? "one" : "off";
    this._emit("togglechange");
  }

  setVolume(v) {
    this.volume = v;
    this.audio.volume = v;
    this._emit("volumechange");
  }

  setMuted(v) {
    this.muted = v;
    this.audio.muted = v;
    this._emit("volumechange");
  }

  seekPercent(pct) {
    if (this.duration) this.audio.currentTime = (pct / 100) * this.duration;
  }
}
