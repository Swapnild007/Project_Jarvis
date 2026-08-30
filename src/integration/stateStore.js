const STATE_KEY = 'jarvis-state';
export const STATE_SCHEMA_VERSION = 3;

export function createBackup(state) {
  return {
    format: 'jarvis-career-state',
    schemaVersion: STATE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
}

export function validateBackup(payload) {
  return Boolean(
    payload &&
      payload.format === 'jarvis-career-state' &&
      payload.state &&
      typeof payload.state === 'object' &&
      payload.state.skills &&
      payload.state.currentMission,
  );
}

export function downloadBackup(state) {
  const payload = createBackup(state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jarvis-career-state-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  return payload;
}

export function restoreBackup(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!validateBackup(payload)) throw new Error('Invalid JARVIS Career State backup.');
      localStorage.setItem(STATE_KEY, JSON.stringify(payload.state));
      onSuccess(payload.state);
    } catch (error) {
      onError(error);
    }
  };
  reader.onerror = () => onError(new Error('Could not read the selected backup file.'));
  reader.readAsText(file);
}

export function clearCareerState() {
  localStorage.removeItem(STATE_KEY);
}
