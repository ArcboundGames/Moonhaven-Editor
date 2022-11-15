export function log(...data: unknown[]) {
  try {
    unityLog(dataToString(...data));
  } catch {
    console.log(...data);
  }
}

export function info(...data: unknown[]) {
  try {
    unityLog(dataToString(...data));
  } catch {
    console.info(...data);
  }
}

export function warn(...data: unknown[]) {
  try {
    unityLogWarning(dataToString(...data));
  } catch {
    console.warn(...data);
  }
}

export function error(...data: unknown[]) {
  try {
    unityLogError(dataToString(...data));
  } catch {
    console.error(...data);
  }
}

export function dataToString(...data: unknown[]) {
  return data.reduce<string>((previous, current) => `${previous} ${current}`, '');
}
