const checkRawPointerEventsSupported = () =>
  new Promise((resolve, reject) => {
    let hasSetRawListener = false;
    let timeout = null;
    let eventCount = 0;

    document.addEventListener("pointermove", function handler() {
      function onRawUpdate() {
        eventCount++;
      }

      if (!hasSetRawListener) {
        document.addEventListener("pointerrawupdate", onRawUpdate);
        hasSetRawListener = true;
      }

      if (!timeout) {
        timeout = setTimeout(() => {
          document.removeEventListener("pointermove", handler);
          if (hasSetRawListener)
            document.removeEventListener("pointerrawupdate", onRawUpdate);

          if (hasSetRawListener && eventCount === 0) return resolve(false);
          resolve(true);
        }, 1000);
      }
    });
  });
