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

gsap.to("#wave", {
  duration: 4,
  attr: {
    d: "M0 120L41 150C82 180 165 260 247 280C329 300 411 270 494 200C576 130 658 40 741 40C823 40 905 130 987 130C1070 130 1152 40 1234 30C1317 20 1399 100 1481 120C1563 140 1646 110 1687 90L1728 70V372H1687C1646 372 1563 372 1481 372C1399 372 1317 372 1234 372C1152 372 1070 372 987 372C905 372 823 372 741 372C658 372 576 372 494 372C411 372 329 372 247 372C165 372 82 372 41 372H0V120Z",
  },
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});
