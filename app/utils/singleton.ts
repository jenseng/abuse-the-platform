// since the dev server re-requires the bundle, do some shenanigans to make certain things persist across
// that 😆

export function singleton<T>(name: string, value: T) {
  const yolo = global as any;
  yolo.__singletons ??= {};
  yolo.__singletons[name] ??= value;
  return yolo.__singletons[name];
}
