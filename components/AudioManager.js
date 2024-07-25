export class AudioManager {
    constructor(sfxEnabled = true, musicEnabled = false) {
        this.sfxEnabled = sfxEnabled;
        this.musicEnabled = musicEnabled;
        this.fireSound = new Audio('https://cdn.freesound.org/previews/427/427396_9497060-lq.mp3');
        this.destroySound = new Audio('https://cdn.freesound.org/previews/403/403297_6142149-lq.mp3');
        this.backgroundMusic = new Audio('https://cdn.freesound.org/previews/697/697844_10643461-lq.mp3');
        this.hurtSound = new Audio('https://cdn.freesound.org/previews/261/261855_4157918-lq.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.06;
        this.destroySound.volume = 0.04;
        this.hurtSound.volume = 0.05;
        this.fireSound.volume = 0.05;
    }

    playSound(sound) {
        if (this.sfxEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.backgroundMusic.play();
        } else {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
    }
}
