export function createPresenceService() {
  return {
    getInitialCount() {
      return 1842;
    },
    getNextCount(currentCount) {
      const delta = Math.floor(Math.random() * 9) - 4;
      return Math.max(1200, currentCount + delta);
    },
  };
}
