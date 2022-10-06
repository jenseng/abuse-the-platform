export class Emitter<T> {
  constructor(public listeners = new Set<(data: T) => void>()) {}
  emit(data: T) {
    for (const listener of this.listeners) {
      listener(data);
    }
  }
  addListener(listener: (data: T) => void) {
    this.listeners.add(listener);
  }
  removeListener(listener: (data: T) => void) {
    this.listeners.delete(listener);
  }
}
