const checkRawPointerEventsSupported = () =>
  new Promise((resolve, reject) => {
    let hasSetRawListener = false;
    let eventCount = 0;

    document.addEventListener("pointermove", () => {
      if (!hasSetRawListener)
        document.addEventListener("pointerrawupdate", () => eventCount++);

      setTimeout(() => {
        if (eventCount === 0) return resolve(false);
        resolve(true);
      }, 1000);
    });
  });
