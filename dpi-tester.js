const RADIUS = 20;

const input = document.getElementById("distanceInput");
const statistics = document.getElementById("statistics");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let isPointerLocked = false;
let animation = null;

let started = false;

let distanceToTravel = "1";
let x = 50;
let y = 50;
let pixelsTraveled = 0;
let dpi = 0;

// util
function degToRad(degrees) {
  const result = (Math.PI / 180) * degrees;
  return result;
}

const updateStatistics = () => {
  statistics.innerHTML = `
    Distance to Travel: ${
      distanceToTravel.length > 0 ? distanceToTravel : "0"
    } ${
    parseInt(distanceToTravel) > 1 || distanceToTravel === "0"
      ? "inches"
      : "inch"
  } <br/>
    Pixels Traveled: ${pixelsTraveled} <br/>
    Approximate DPI: ${dpi} <br/>
  `;
};

const onDistanceChange = (e) => {
  distanceToTravel = e.target.value;
  updateStatistics();
};

const onPointerMove = (e) => {
  const events = "getCoalescedEvents" in e ? e.getCoalescedEvents() : [e];

  events.forEach((e) => (pixelsTraveled += e.movementX));
  dpi = (pixelsTraveled * 2.54) / (distanceToTravel * 2.54);

  updateStatistics();

  // update mouse positioning state
  x += e.movementX;
  y += e.movementY;

  if (!animation) {
    animation = requestAnimationFrame(() => {
      animation = null;
      canvasDraw();
    });
  }
};

const startRecording = () => {
  if (isRawSupported)
    document.addEventListener("pointerrawupdate", onPointerMove);
  else document.addEventListener("pointermove", onPointerMove);

  console.log("Started recording...");
};

const stopRecording = () => {
  if (isRawSupported)
    document.removeEventListener("pointerrawupdate", onPointerMove);
  else document.removeEventListener("pointermove", onPointerMove);
  console.log("Stopped recording...");
};

// pointer lock stuff
const lockChangeAlert = () => {
  if (document.pointerLockElement === canvas) {
    console.log("The pointer lock status is now locked");
  } else {
    console.log("The pointer lock status is now unlocked");
    started = false;
    stopRecording();
  }
};

document.addEventListener("pointerlockchange", lockChangeAlert, false);

canvas.addEventListener("click", async () => {
  if (!document.pointerLockElement) {
    return await canvas.requestPointerLock({
      unadjustedMovement: true,
    });
  }

  started = !started;

  if (started) startRecording();
  if (!started) stopRecording();
});

// canvas stuff
const canvasDraw = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
  ctx.fill();
};

canvasDraw();

input.addEventListener("input", onDistanceChange);
