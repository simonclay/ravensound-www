// Audio players: each plays its own list of tracks. Clicking a track plays
// it, and the next one starts when it finishes. Starting one player pauses
// any other. Without this script each track links to its MP3.
export function initPlayers() {
  const players = [...document.querySelectorAll('[data-player]')];

  players.forEach((player) => {
    const audio = player.querySelector('[data-player-audio]');
    const now = player.querySelector('[data-player-now]');
    const tracks = [...player.querySelectorAll('[data-player-track]')];
    if (!audio || !tracks.length) return;

    let current = 0;

    const load = (i, play) => {
      current = i;
      tracks.forEach((track, n) => {
        if (n === i) track.setAttribute('aria-current', 'true');
        else track.removeAttribute('aria-current');
      });
      if (now) now.textContent = tracks[i].textContent.trim();
      audio.src = tracks[i].href;
      if (play) audio.play().catch(() => {});
    };

    tracks.forEach((track, i) => {
      track.addEventListener('click', (event) => {
        event.preventDefault();
        if (i === current && !audio.paused) audio.pause();
        else if (i === current && audio.currentSrc) audio.play().catch(() => {});
        else load(i, true);
      });
    });

    audio.addEventListener('play', () => {
      player.setAttribute('data-playing', '');
      players.forEach((other) => {
        const otherAudio = other.querySelector('[data-player-audio]');
        if (other !== player && otherAudio && !otherAudio.paused) otherAudio.pause();
      });
    });
    audio.addEventListener('pause', () => player.removeAttribute('data-playing'));
    audio.addEventListener('ended', () => {
      if (current < tracks.length - 1) load(current + 1, true);
    });
  });
}
