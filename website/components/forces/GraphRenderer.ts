import { GraphNode } from './GraphForces';
import { Viewport, graphToPixel } from './GraphSpace';

// Visual parameters
const VISUAL = {
  NODE_SIZE: 3,           // Base node size in pixels
  NODE_GLOW: 15,         // Maximum node glow radius
  EDGE_WIDTH: 1,         // Base edge width in pixels
  EDGE_MAX_LENGTH: 0.44,  // Maximum edge length in graph space
  BASE_ALPHA: 0.4,       // Base opacity for edges
  GLOW_ALPHA: 0.2,       // Glow opacity
  COLOR: {
    r: 217,             // Orange-amber color
    g: 119,
    b: 6
  }
};

// Helper to create color string with alpha
function rgba(alpha: number): string {
  const { r, g, b } = VISUAL.COLOR;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Draw edges between nodes
function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  viewport: Viewport,
  time: number
): void {
  nodes.forEach((from, i) => {
    nodes.slice(i + 1).forEach(to => {
      // Check if nodes are close enough in graph space
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > VISUAL.EDGE_MAX_LENGTH) return;

      // Convert to pixel space
      const fromPixel = graphToPixel(from, viewport);
      const toPixel = graphToPixel(to, viewport);

      // Calculate edge properties
      const activity = Math.max(from.activity, to.activity);
      const alpha = VISUAL.BASE_ALPHA + activity * 0.6;
      const width = VISUAL.EDGE_WIDTH * (1 + activity);

      // Draw edge with gradient
      const gradient = ctx.createLinearGradient(
        fromPixel.x, fromPixel.y,
        toPixel.x, toPixel.y
      );

      // Animate gradient
      const phase = (time * 0.5 + dist) % 1;
      gradient.addColorStop(0, rgba(alpha * 0.5));
      gradient.addColorStop(phase, rgba(alpha));
      gradient.addColorStop(1, rgba(alpha * 0.5));

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = width;
      ctx.moveTo(fromPixel.x, fromPixel.y);
      ctx.lineTo(toPixel.x, toPixel.y);
      ctx.stroke();

      // Draw glow for active edges
      if (activity > 0.1) {
        ctx.strokeStyle = rgba(VISUAL.GLOW_ALPHA * activity);
        ctx.lineWidth = width * 3;
        ctx.stroke();
      }
    });
  });
}

// Draw nodes with glow effects
function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  viewport: Viewport
): void {
  nodes.forEach(node => {
    const pixel = graphToPixel(node, viewport);
    const activity = node.activity;

    // Draw glow
    if (activity > 0) {
      const gradient = ctx.createRadialGradient(
        pixel.x, pixel.y, 0,
        pixel.x, pixel.y, VISUAL.NODE_GLOW
      );
      gradient.addColorStop(0, rgba(VISUAL.GLOW_ALPHA * activity));
      gradient.addColorStop(1, rgba(0));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pixel.x, pixel.y, VISUAL.NODE_GLOW, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw node
    const size = VISUAL.NODE_SIZE * (1 + activity * 0.5);
    const alpha = 0.6 + activity * 0.4;

    ctx.fillStyle = rgba(alpha);
    ctx.beginPath();
    ctx.arc(pixel.x, pixel.y, size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Main render function
export function renderGraph(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  viewport: Viewport,
  time: number
): void {
  // Clear canvas with fade effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, viewport.width, viewport.height);

  // Draw graph elements
  drawEdges(ctx, nodes, viewport, time);
  drawNodes(ctx, nodes, viewport);
}
