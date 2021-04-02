import BackendInterface from "./BackendInterface";

function nullError<T>(...args: any[]): T {
  throw new Error("Attempted to use NullBackend");
}

export default class NullBackend implements BackendInterface {
  addListener = nullError;
  on = nullError;
  once = nullError;
  removeListener = nullError;
  off = nullError;
  removeAllListeners = nullError;
  setMaxListeners = nullError;
  getMaxListeners = nullError;
  listeners = nullError;
  rawListeners = nullError;
  emit = nullError;
  listenerCount = nullError;
  prependListener = nullError;
  prependOnceListener = nullError;
  eventNames = nullError;
  currentState = nullError;
  attemptPlayerAction = nullError;
  isReady = () => false;
  onReady = () => {};
}
