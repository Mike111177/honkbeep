import BackendInterface from "./BackendInterface";
import { GameState, GameEvent } from "./GameTypes";

export default class NullBackend implements BackendInterface{
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  off(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  removeAllListeners(event?: string | symbol): this {
    throw new Error("Attempted to use NullBackend");
  }
  setMaxListeners(n: number): this {
    throw new Error("Attempted to use NullBackend");
  }
  getMaxListeners(): number {
    throw new Error("Attempted to use NullBackend");
  }
  listeners(event: string | symbol): Function[] {
    throw new Error("Attempted to use NullBackend");
  }
  rawListeners(event: string | symbol): Function[] {
    throw new Error("Attempted to use NullBackend");
  }
  emit(event: string | symbol, ...args: any[]): boolean {
    throw new Error("Attempted to use NullBackend");
  }
  listenerCount(type: string | symbol): number {
    throw new Error("Attempted to use NullBackend");
  }
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error("Attempted to use NullBackend");
  }
  eventNames(): (string | symbol)[] {
    throw new Error("Attempted to use NullBackend");
  }
  currentState(): GameState {
    throw new Error("Attempted to use NullBackend");
  }
  attemptPlayerAction(action: GameEvent): Promise<boolean> {
    throw new Error("Attempted to use NullBackend");
  }
  isReady(): boolean {
    return false;
  }
  
}
