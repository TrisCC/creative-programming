// Tweakpane variables
let pane;
let params = {
  x: 0,
};

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Setup Tweakpane
  const PaneCtor = globalThis?.Tweakpane?.Pane ?? globalThis?.Pane ?? null;
  if (PaneCtor) {
    // Initialize pane
    pane = new PaneCtor();

    // Fix top-left placement
    const el = pane.element ?? pane.view?.element ?? null;
    if (el) {
      el.style.position = "fixed";
      el.style.left = "8px";
      el.style.top = "8px";
    }
  } else {
    console.warn("Tweakpane is not available.");
    return;
  }
}

function draw() {}
