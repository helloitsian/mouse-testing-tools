const checkRawPointerEventsSupported = () =>
  new Promise((resolve, reject) => {
    let eventCount = 0;

    document.addEventListener("pointerrawupdate", () => eventCount++);

    setTimeout(() => {
      if (eventCount === 0) return resolve(false);
      resolve(true);
    }, 500);
  });
