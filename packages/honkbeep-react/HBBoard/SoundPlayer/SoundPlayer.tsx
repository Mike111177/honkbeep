import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { useBoard } from "../../BoardContext/hooks/useBoard";
import { useBoardStateUpdates } from "../../BoardContext";
import { GameEventType, GamePlayResultType } from "honkbeep-game";

export function SoundPlayer() {
  const board = useBoard();
  const [sampler] = useState(() =>
    new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination()
  );
  const lastEvent = useRef(0);

  useEffect(() => {
    Tone.loaded().then(() => {
      const now = Tone.now();
      sampler.triggerAttackRelease("A3", "8n", now);
      sampler.triggerAttackRelease("B3", "8n", now + 0.25);
      sampler.triggerAttackRelease("C4", "8n", now + 0.5);
    });

    return () => {
      sampler.dispose();
    };
  }, []);

  useBoardStateUpdates((state) => {
    const newLastEvent = state.events.length - 1;
    if (lastEvent.current !== newLastEvent) {
      lastEvent.current = newLastEvent;
      const now = Tone.now();
      const event = state.events[lastEvent.current];
      switch (event.type) {
        case GameEventType.Discard:
          sampler.triggerAttackRelease("C4", "8n", now);
          break;
        case GameEventType.Play:
          if (event.result === GamePlayResultType.Success) {
            sampler.triggerAttackRelease("C4", "8n", now);
            sampler.triggerAttackRelease("E4", "8n", now + 0.25);
          } else {
            sampler.triggerAttackRelease("C4", "8n", now);
            sampler.triggerAttackRelease("B3", "8n", now + 0.2);
            sampler.triggerAttackRelease("A3", "8n", now + 0.4);
          }
          break;
        case GameEventType.Clue:
          sampler.triggerAttackRelease("C4", "8n", now);
          sampler.triggerAttackRelease("D4", "8n", now + 0.25);
          break;
      }
    }
  });

  return null;
}
