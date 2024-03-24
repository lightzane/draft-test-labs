export const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  // Recommended
  e.preventDefault();

  // Included for legacy support, e.g. Chrome/Edge < 119
  e.returnValue = true;
};
