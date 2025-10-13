/// <reference path="../libraries/p5.global-mode.d.ts" />

// Drawing variables
let canvas;
let drawings = [];
let currentPath = [];
let isDrawing = false;
let px = 0;
let py = 0;

// Tweakpane variables
let pane;
let params = {
  strokeColor: '#C8C8C8',
  bgColor: '#000000',
  strokeWidth: 4,
  mode: 'gradient',
  startH: 0,
  startS: 100,
  startL: 50,
  endH: 240,
  endS: 100,
  endL: 50,
  clear: () => {
    drawings = [];
    background(params.bgColor);
  },
  savePNG: () => {
    try {
      saveCanvas('drawing', 'png');
    } catch (e) {
      console.warn('saveCanvas failed:', e);
    }
  }
};

// Keyboard-held color adjust flags
let adjustingStart = false;
let adjustingEnd = false;
let adjustingBoth = false;

// Hue change speed
const HUE_SPEED = 2;

// Key handlers
function keyPressed() {
  if (key === '1') adjustingStart = true;
  if (key === '2') adjustingEnd = true;
  if (key === '3') adjustingBoth = true;
}
function keyReleased() {
  if (key === '1') adjustingStart = false;
  if (key === '2') adjustingEnd = false;
  if (key === '3') adjustingBoth = false;
}

function setup() {
  // Setup canvas
  canvas = createCanvas(windowWidth, windowHeight);
  background(params.bgColor);

  // Setup mouse events
  canvas.mousePressed(startPath);
  canvas.mouseReleased(function () {
    endPath();
  });

  // Setup Tweakpane
  const PaneCtor = globalThis?.Tweakpane?.Pane ?? globalThis?.Pane ?? null;

  if (PaneCtor) {
    try {
      pane = new PaneCtor();

      // Fix top-left placement
      const el = pane.element ?? pane.view?.element ?? null;
      if (el) {
        el.style.position = 'fixed';
        el.style.left = '8px';
        el.style.top = '8px';
      }

      const drawingOptions = pane.addFolder({ title: 'Drawing' });
      // Create controllers and keep references so we can show/hide them depending on mode

      const widthCtrl = drawingOptions.addInput(params, 'strokeWidth', { min: 1, max: 40, step: 1, label: 'Width' });
      const modeCtrl = drawingOptions.addInput(params, 'mode', { options: { Solid: 'solid', Gradient: 'gradient' } });
      const strokeCtrl = drawingOptions.addInput(params, 'strokeColor', { view: 'color', label: 'Color' });
      const startHCtrl = drawingOptions.addInput(params, 'startH', { min: 0, max: 360, step: 1, label: 'Start H' });
      const startSCtrl = drawingOptions.addInput(params, 'startS', { min: 0, max: 100, step: 1, label: 'Start S' });
      const startLCtrl = drawingOptions.addInput(params, 'startL', { min: 0, max: 100, step: 1, label: 'Start L' });
      const endHCtrl = drawingOptions.addInput(params, 'endH', { min: 0, max: 360, step: 1, label: 'End H' });
      const endSCtrl = drawingOptions.addInput(params, 'endS', { min: 0, max: 100, step: 1, label: 'End S' });
      const endLCtrl = drawingOptions.addInput(params, 'endL', { min: 0, max: 100, step: 1, label: 'End L' });

      // Toggle visibility of color controls
      const updateVisibility = (mode) => {
        const isGradient = mode === 'gradient';
        // Some Pane versions expose `hidden` as a property on the controller
        if ('hidden' in strokeCtrl) strokeCtrl.hidden = isGradient;
        if ('hidden' in startHCtrl) startHCtrl.hidden = !isGradient;
        if ('hidden' in startSCtrl) startSCtrl.hidden = !isGradient;
        if ('hidden' in startLCtrl) startLCtrl.hidden = !isGradient;
        if ('hidden' in endHCtrl) endHCtrl.hidden = !isGradient;
        if ('hidden' in endSCtrl) endSCtrl.hidden = !isGradient;
        if ('hidden' in endLCtrl) endLCtrl.hidden = !isGradient;
        // width always visible
      };

      // Initial visibility
      updateVisibility(params.mode);

      // React to mode changes
      if (modeCtrl && typeof modeCtrl.on === 'function') {
        modeCtrl.on('change', (ev) => updateVisibility(ev.value));
      }

      const canvasOptions = pane.addFolder({ title: 'Canvas' });
      canvasOptions.addInput(params, 'bgColor', { view: 'color', label: 'Background' })
        .on('change', () => {
          redrawCanvas();
        });
      canvasOptions.addButton({ title: 'Clear' }).on('click', params.clear);
      canvasOptions.addButton({ title: 'Save PNG' }).on('click', params.savePNG);

      // Informational field: keyboard shortcuts
      try {
        const infoHtml = `
          <div style="font-size:12px;line-height:1.3;margin-top:8px;padding:6px;color:#999;">
            <strong style="color:#bbb;">Keyboard shortcuts</strong><br>
            Hold <kbd>1</kbd> — rotate gradient start hue<br>
            Hold <kbd>2</kbd> — rotate gradient end hue<br>
            Hold <kbd>3</kbd> — rotate both hues<br>
          </div>`;
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = infoHtml;
        const paneEl = pane.element ?? pane.view?.element ?? null;
        if (paneEl) paneEl.appendChild(infoDiv);
      } catch (e) {
        // ignore if DOM insertion fails
      }
    } catch (e) {
      console.warn('Error creating Tweakpane UI:', e);
    }
  } else {
    console.warn('Tweakpane not found. Include Tweakpane to use the GUI.');
  }
}

function startPath() {
  px = mouseX;
  py = mouseY;

  isDrawing = true;
  currentPath = [];
  drawings.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(params.bgColor);

  // If user is holding keys to adjust colors, update the gradient colors
  if (adjustingStart || adjustingEnd || adjustingBoth) {
    const delta = HUE_SPEED;
    if (adjustingStart || adjustingBoth) {
      params.startH = (params.startH + delta) % 360;
      if (params.startH < 0) params.startH += 360;
    }
    if (adjustingEnd || adjustingBoth) {
      params.endH = (params.endH + delta) % 360;
      if (params.endH < 0) params.endH += 360;
    }
  }

  // Draw current path
  if (isDrawing) {
    let point = {
      x1: px,
      y1: py,
      x2: mouseX,
      y2: mouseY
    };
    currentPath.push(point);
    px = mouseX;
    py = mouseY;
  }

  // Draw all stored paths
  for (let i = 0; i < drawings.length; i++) {
    let path = drawings[i];
    if (!path || path.length === 0) continue;
    drawPath(path);
  }
}

// Draw a stored path
function drawPath(path) {
  if (!path || path.length === 0) return;

  // Solid mode
  if (params.mode === 'solid') {
    strokeWeight(params.strokeWidth);
    stroke(params.strokeColor);
    for (let j = 0; j < path.length; j++) {
      line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
    }
    return;
  }

  // Gradient mode
  const c1 = color(`hsl(${params.startH}, ${params.startS}%, ${params.startL}%)`);
  const c2 = color(`hsl(${params.endH}, ${params.endS}%, ${params.endL}%)`);
  const n = path.length;
  for (let j = 0; j < n; j++) {
    let t = (n <= 1) ? 0 : j / (n - 1);
    const col = lerpColor(c1, c2, t);
    strokeWeight(params.strokeWidth);
    stroke(col);
    line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
  }
}

// Redraw all stored paths (used when bgColor changes / clear)
function redrawCanvas() {
  background(params.bgColor);
  for (let i = 0; i < drawings.length; i++) {
    let path = drawings[i];
    if (!path || path.length === 0) continue;
    for (let j = 0; j < path.length; j++) {
      strokeWeight(params.strokeWidth);
      stroke(params.strokeColor);
      line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
    }
  }
}

