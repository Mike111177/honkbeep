import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

const listeners: ((sd: boolean) => void)[] = [];

function updateSpacebarListeners(down: boolean) {
  unstable_batchedUpdates(() => {
    for (const listener of listeners) listener(down);
  });
}

function subscribeToSpacebar(setSpacebar: Dispatch<SetStateAction<boolean>>) {
  listeners.push(setSpacebar);
  return () => {
    listeners.splice(
      listeners.findIndex((i) => i === setSpacebar),
      1
    );
  };
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    updateSpacebarListeners(true);
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    updateSpacebarListeners(false);
  }
});

export default function useSpacebar() {
  const [spacebar, setSpacebar] = useState(false);
  useEffect(() => subscribeToSpacebar(setSpacebar), []);
  return spacebar;
}
