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

      // Force top-left positioning (use fixed + !important to resist page CSS)
      const el = pane.element ?? pane.view?.element ?? null;
      if (el) {
        const applyPos = () => {
          try {
            el.style.setProperty('position', 'fixed', 'important');
            el.style.setProperty('left', '8px', 'important');
            el.style.setProperty('top', '8px', 'important');
            el.style.setProperty('right', 'auto', 'important');
            el.style.setProperty('transform', 'none', 'important');
            el.style.setProperty('margin', '0', 'important');
            el.style.setProperty('z-index', '10000', 'important');
            // Move to document.body so parent layout (flex/justify) can't push it
            if (el.parentElement && el.parentElement !== document.body) {
              document.body.appendChild(el);
            }
          } catch (e) {
            // ignore
          }
        };

        applyPos();

        // Reapply if something modifies the DOM or styles (very small overhead)
        try {
          const observer = new MutationObserver(() => applyPos());
          observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
          // Also reapply shortly after creation in case the pane is updated asynchronously
          setTimeout(applyPos, 150);
        } catch (e) {
          // ignore if MutationObserver isn't available
          setTimeout(applyPos, 150);
        }
      }

      const folder = pane.addFolder({ title: 'Drawing' });
      folder.addInput(params, 'strokeColor', { view: 'color', label: 'Stroke' });
      folder.addInput(params, 'strokeWidth', { min: 1, max: 40, step: 1, label: 'Width' });

      const ops = pane.addFolder({ title: 'Canvas' });
      ops.addInput(params, 'bgColor', { view: 'color', label: 'Background' })
        .on('change', () => {
          redrawCanvas();
        });
      ops.addButton({ title: 'Clear' }).on('click', params.clear);
      ops.addButton({ title: 'Save PNG' }).on('click', params.savePNG);
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
  // Clear and redraw from stored paths so GUI changes take effect immediately
  background(params.bgColor);

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
    for (let j = 0; j < path.length; j++) {
      strokeWeight(params.strokeWidth);
      stroke(params.strokeColor);
      line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
    }
  }
}

// Helper to clear background and redraw all stored paths (used when bgColor changes / clear)
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

