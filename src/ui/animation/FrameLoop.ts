import ArrayUtil from "../../util/ArrayUtil";

let loopActive = false;
const frameListeners: FrameRequestCallback[] = [];

const frameLoop: FrameRequestCallback = function frameLoop(frame) {
  frameListeners.forEach((f) => f(frame));
  if (loopActive) {
    window.requestAnimationFrame(frameLoop);
  }
};

export function onFrame(cb: FrameRequestCallback) {
  frameListeners.push(cb);
  if (!loopActive) {
    loopActive = true;
    window.requestAnimationFrame(frameLoop);
  }
  return () => {
    ArrayUtil.remove(frameListeners, cb);
    if (frameListeners.length === 0) {
      loopActive = false;
    }
  };
}
