document.querySelectorAll("a[class^='card-']").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const newColor = getComputedStyle(card)
      .getPropertyValue(`--${card.classList[0].replace("card-", "")}`)
      .trim();
    animateCSSVariable("--activehovercolor", newColor, 350);
  });

  card.addEventListener("mouseleave", () => {
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--mediahuis").trim();
    animateCSSVariable("--activehovercolor", defaultColor, 350);
  });
});

function animateCSSVariable(variable, endColor, duration) {
  let startColor = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  if (!startColor || startColor === "none") {
    document.documentElement.style.setProperty(variable, endColor);
    return;
  }

  const startRGB = convertColorToRGB(startColor);
  const endRGB = convertColorToRGB(endColor);
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentRGB = startRGB.map((start, i) => Math.round(start + (endRGB[i] - start) * progress));

    document.documentElement.style.setProperty(variable, `rgb(${currentRGB.join(", ")})`);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function convertColorToRGB(color) {
  if (color.startsWith("rgb")) {
    return color.match(/\d+/g).map(Number);
  }

  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  return computedColor.match(/\d+/g).map(Number);
}

import paper from "paper";

// ✅ Paper.js Setup
paper.setup(document.getElementById("waveCanvas"));

// ✅ Define variables
let width, height, center;
const points = 10;
let smooth = true;
let path = new paper.Path();
let mousePos = paper.view.center.divide(2);
let pathHeight = mousePos.y;

// ✅ Set fill color for the wave
path.fillColor = "black";

function initializePath() {
  center = paper.view.center;
  width = paper.view.size.width;
  height = paper.view.size.height / 2;
  path.segments = [];

  path.add(paper.view.bounds.bottomLeft);
  for (let i = 1; i < points; i++) {
    let point = new paper.Point((width / points) * i, center.y);
    path.add(point);
  }
  path.add(paper.view.bounds.bottomRight);
}

initializePath();

// ✅ Animation loop
paper.view.onFrame = (event) => {
  pathHeight += (center.y - mousePos.y - pathHeight) / 10;
  for (let i = 1; i < points; i++) {
    let sinSeed = event.count + (i + (i % 10)) * 100;
    let sinHeight = Math.sin(sinSeed / 200) * pathHeight;
    let yPos = Math.sin(sinSeed / 100) * sinHeight + height;
    path.segments[i].point.y = yPos;
  }
  if (smooth) path.smooth({ type: "continuous" });
};

paper.view.onMouseMove = (event) => {
  mousePos = event.point;
};

paper.view.onMouseDown = () => {
  smooth = !smooth;
  if (!smooth) {
    for (let i = 0; i < path.segments.length; i++) {
      let segment = path.segments[i];
      segment.handleIn = segment.handleOut = null;
    }
  }
};

paper.view.onResize = () => {
  initializePath();
};

paper.view.play();
