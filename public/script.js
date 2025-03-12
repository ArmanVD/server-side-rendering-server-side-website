document.querySelectorAll("a[class^='card-']").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const newColor = getComputedStyle(card)
      .getPropertyValue(`--${card.classList[0].replace("card-", "")}`)
      .trim();
    animateCSSVariable("--activehovercolor", newColor, 350); // Smooth 1s transition
  });

  card.addEventListener("mouseleave", () => {
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--mediahuis").trim();
    animateCSSVariable("--activehovercolor", defaultColor, 350);
  });
});

// Function to animate CSS variables smoothly
function animateCSSVariable(variable, endColor, duration) {
  let startColor = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  if (!startColor || startColor === "none") {
    document.documentElement.style.setProperty(variable, endColor);
    return;
  }

  // Convert colors to RGB format
  const startRGB = convertColorToRGB(startColor);
  const endRGB = convertColorToRGB(endColor);

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1); // Normalize progress (0-1)

    // Interpolate each color channel (R, G, B)
    const currentRGB = startRGB.map((start, i) => Math.round(start + (endRGB[i] - start) * progress));

    // Apply the interpolated color to the CSS variable
    document.documentElement.style.setProperty(variable, `rgb(${currentRGB.join(", ")})`);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Function to convert color to RGB format
function convertColorToRGB(color) {
  if (color.startsWith("rgb")) {
    return color.match(/\d+/g).map(Number); // Extract RGB values
  }

  // Create a temporary element to convert the color
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  return computedColor.match(/\d+/g).map(Number);
}
