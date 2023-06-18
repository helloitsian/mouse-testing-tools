const instruction = document.getElementById("instruction");
const statistics = document.getElementById("statistics");

let started = false;
let oneSecondHasPassed = false;

let fps = 0;
let count = 0;
let frames = 0;
let tick = 0;
let totalMoves = 0;
let maxPollingRate = 0;

const onPointerMove = (e) => {
  var events = "getCoalescedEvents" in e ? e.getCoalescedEvents() : [e];

  count += events.length;
};

const updateStatistics = ({ fps, averagePollingRate, maxPollingRate }) => {
  statistics.innerHTML = `
    FPS: ${fps} <br/>
    Polling Rate: ${averagePollingRate}hz <br/>
    Max Polling Rate: ${maxPollingRate}hz
  `;
};

const updateInstruction = (message) => {
  instruction.innerText = message;
};

const startRecording = () => {
  updateInstruction("Click Anywhere To Stop");

  if (isRawSupported)
    document.addEventListener("pointerrawupdate", onPointerMove);
  else document.addEventListener("pointermove", onPointerMove);

  let prevTime = performance.now();

  const loop = () => {
    const time = performance.now();
    const dt = time - prevTime;

    if (dt > 1000) {
      fps = frames;
      prevTime = time;
      frames = 0;
    }

    frames++;
    tick++;
    totalMoves += count;

    const averagePollingRate = Math.ceil((fps * totalMoves) / tick);

    maxPollingRate =
      averagePollingRate > maxPollingRate ? averagePollingRate : maxPollingRate;

    count = 0;

    if (started) {
      updateStatistics({ fps, averagePollingRate, maxPollingRate });
      requestAnimationFrame(loop);
    }
  };

  requestAnimationFrame(loop);
};

const stopRecording = () => {
  updateInstruction("Click Anywhere To Begin");

  if (isRawSupported)
    document.removeEventListener("pointerrawupdate", onPointerMove);
  else document.removeEventListener("pointermove", onPointerMove);

  fps = 0;
  count = 0;
  frames = 0;
  tick = 0;
  totalMoves = 0;
  maxPollingRate = 0;
};

document.addEventListener("click", () => {
  started = !started;

  if (started) startRecording();
  if (!started) stopRecording();
});
