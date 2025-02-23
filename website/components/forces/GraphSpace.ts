// Graph space coordinate system and transformations
export interface GraphPoint {
  x: number;  // x in graph space [-1, 1]
  y: number;  // y in graph space [-1, 1]
}

export interface PixelPoint {
  x: number;  // x in pixel space
  y: number;  // y in pixel space
}

export interface Viewport {
  width: number;   // Canvas width in pixels
  height: number;  // Canvas height in pixels
  scale: number;   // Scale factor for graph space to pixel space
  offsetX: number; // X offset in pixels
  offsetY: number; // Y offset in pixels
}

// Convert graph space coordinates to pixel space
export function graphToPixel(point: GraphPoint, viewport: Viewport): PixelPoint {
  return {
    x: point.x * viewport.scale + viewport.offsetX,
    y: point.y * viewport.scale + viewport.offsetY
  };
}

// Convert pixel space coordinates to graph space
export function pixelToGraph(point: PixelPoint, viewport: Viewport): GraphPoint {
  return {
    x: (point.x - viewport.offsetX) / viewport.scale,
    y: (point.y - viewport.offsetY) / viewport.scale
  };
}

// Calculate viewport parameters to maintain square aspect ratio
export function calculateViewport(width: number, height: number): Viewport {
  const scale = Math.min(width, height) / 2;  // Scale to fit [-1,1] in smallest dimension
  return {
    width,
    height,
    scale,
    offsetX: width / 2,   // Center horizontally
    offsetY: height / 2   // Center vertically
  };
}

// Calculate distance between two points in graph space
export function graphDistance(a: GraphPoint, b: GraphPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}