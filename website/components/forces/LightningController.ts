interface LightningParams {
  medianInterval: number;  // Median time between lightnings in seconds
  burstModeProb: number;  // Probability of entering burst mode
  burstDuration: number;  // Duration of burst mode in seconds
  quietDuration: number;  // Duration of quiet mode in seconds
  forkingProb: number;  // Probability to fork at each node (0-1)
  maxForks: number;  // Maximum number of forks per lightning
  decayFactor: number;  // Decay factor for path selection (0-1)
  propagationDuration: number;  // Duration of initial lightning propagation
  fadeDuration: number;  // Duration of fade to orange
  colorVariations: Array<{
    start: string;  // Initial color (purple variations)
    peak: string;   // Peak color (white-ish variations)
    end: string;    // Final color (orange)
  }>;
}

export class LightningController {
  private lastLightningTime: number = 0;
  private inBurstMode: boolean = false;
  private burstStartTime: number = 0;
  private quietStartTime: number = 0;
  private activeLightnings: Array<{
    paths: Array<{
      nodes: number[];
      depth: number;
      energy: number;
    }>;
    startTime: number;
    colorVariation: number;
  }> = [];

  constructor(private params: LightningParams) {}

  // Calculate probability of lightning based on current mode and time
  private getLightningProbability(currentTime: number, deltaTime: number): number {
    // Base probability from median interval
    const baseProb = deltaTime / this.params.medianInterval;

    if (this.inBurstMode) {
      // Check if burst mode should end
      if (currentTime - this.burstStartTime > this.params.burstDuration) {
        this.inBurstMode = false;
        this.quietStartTime = currentTime;
        return 0;
      }
      // Higher probability during burst mode
      return baseProb * 5;
    } else {
      // Check if quiet period should end
      if (currentTime - this.quietStartTime > this.params.quietDuration) {
        // Maybe enter burst mode
        if (Math.random() < this.params.burstModeProb) {
          this.inBurstMode = true;
          this.burstStartTime = currentTime;
          return baseProb * 5;
        }
      }
      return baseProb;
    }
  }

  // Find forking paths through the graph
  private findPaths(
    sourceIndex: number,
    adjacencyList: number[][],
    vertexCount: number
  ): Array<{
    nodes: number[];
    depth: number;  // Distance from source
    energy: number; // Remaining energy (for decay)
  }> {
    const paths: Array<{nodes: number[]; depth: number; energy: number}> = [];
    const visited = new Set<number>();
    let forkCount = 0;
    
    // Queue of paths to explore: [lastNode, pathSoFar, depth, energy]
    const queue: Array<[number, number[], number, number]> = [[sourceIndex, [sourceIndex], 0, 1.0]];
    
    while (queue.length > 0 && forkCount < this.params.maxForks) {
      const [current, path, depth, energy] = queue.shift()!;
      
      // Add current path segment
      paths.push({
        nodes: path,
        depth,
        energy
      });
      
      // Stop this path if energy is too low
      if (energy < 0.2) continue;
      
      // Get unvisited neighbors
      const neighbors = adjacencyList[current].filter(n => !visited.has(n));
      if (neighbors.length === 0) continue;
      
      // Calculate number of forks based on remaining energy and neighbors
      const maxNewForks = Math.min(
        Math.floor(neighbors.length * this.params.forkingProb),
        Math.floor((this.params.maxForks - forkCount) * energy)
      );
      
      // Shuffle neighbors for random selection
      const shuffled = [...neighbors].sort(() => Math.random() - 0.5);
      const selectedNeighbors = shuffled.slice(0, maxNewForks + 1);
      
      // Create new paths
      selectedNeighbors.forEach((next, i) => {
        visited.add(next);
        const newEnergy = energy * Math.pow(this.params.decayFactor, 1 + i * 0.5);
        queue.push([next, [...path, next], depth + 1, newEnergy]);
      });
      
      forkCount += maxNewForks;
    }
    
    return paths;
  }

  // Get color for current animation progress and variation
  private getColor(
    progress: number,
    variation: number,  // 0-1, selects color variation
    energy: number     // 0-1, affects intensity
  ): string {
    // Get color set for this lightning
    const colorSet = this.params.colorVariations[
      Math.floor(variation * this.params.colorVariations.length)
    ];
    
    // Parse all colors into RGB components
    const start = colorSet.start.match(/\d+/g)!.map(Number);
    const peak = colorSet.peak.match(/\d+/g)!.map(Number);
    const end = colorSet.end.match(/\d+/g)!.map(Number);
    
    let r, g, b;
    
    // First phase: propagation (0 to propagationDuration)
    const totalDuration = this.params.propagationDuration + this.params.fadeDuration;
    const normalizedProgress = progress * totalDuration;
    
    if (normalizedProgress < this.params.propagationDuration) {
      // During propagation: interpolate from start to peak
      const p = normalizedProgress / this.params.propagationDuration;
      r = Math.round(start[0] + (peak[0] - start[0]) * p);
      g = Math.round(start[1] + (peak[1] - start[1]) * p);
      b = Math.round(start[2] + (peak[2] - start[2]) * p);
    } else {
      // During fade: interpolate from peak to end
      const p = (normalizedProgress - this.params.propagationDuration) / this.params.fadeDuration;
      r = Math.round(peak[0] + (end[0] - peak[0]) * p);
      g = Math.round(peak[1] + (end[1] - peak[1]) * p);
      b = Math.round(peak[2] + (end[2] - peak[2]) * p);
    }
    
    // Apply energy factor to brightness
    const energyFactor = 0.3 + energy * 0.7;
    r = Math.round(r * energyFactor);
    g = Math.round(g * energyFactor);
    b = Math.round(b * energyFactor);
    
    return `rgb(${r},${g},${b})`;
  }

  // Update lightning state and get active paths
  update(
    currentTime: number,
    deltaTime: number,
    adjacencyList: number[][],
    vertexCount: number
  ): Array<{
    nodes: number[];
    color: string;
    alpha: number;
    energy: number;
  }> {
    // Update existing lightnings
    this.activeLightnings = this.activeLightnings.filter(lightning => {
      const age = currentTime - lightning.startTime;
      const totalDuration = this.params.propagationDuration + this.params.fadeDuration;
      return age < totalDuration;
    });

    // Maybe create new lightning
    if (currentTime - this.lastLightningTime > 0.1) { // Minimum 0.1s between strikes
      const prob = this.getLightningProbability(currentTime, deltaTime);
      if (Math.random() < prob) {
        // Select random source node (prefer upper third of graph)
        const sourceIndex = Math.floor(Math.random() * (vertexCount / 3));
        
        // Create new lightning with random color variation
        this.activeLightnings.push({
          paths: this.findPaths(sourceIndex, adjacencyList, vertexCount),
          startTime: currentTime,
          colorVariation: Math.random()
        });
        
        this.lastLightningTime = currentTime;
      }
    }

    // Return all active path segments with their visual properties
    return this.activeLightnings.flatMap(lightning => {
      const age = currentTime - lightning.startTime;
      const totalDuration = this.params.propagationDuration + this.params.fadeDuration;
      const progress = age / totalDuration;

      return lightning.paths.map(path => {
        // Calculate segment visibility based on propagation
        const pathStartTime = lightning.startTime + (path.depth * this.params.propagationDuration / 8);
        const pathAge = currentTime - pathStartTime;
        const pathProgress = Math.max(0, Math.min(1, pathAge / totalDuration));
        
        // Only show segments that have started propagating
        if (pathAge < 0) return null;
        
        return {
          nodes: path.nodes,
          color: this.getColor(pathProgress, lightning.colorVariation, path.energy),
          alpha: Math.min(1, 2 - pathProgress * 2), // Quick fade in, slow fade out
          energy: path.energy
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null);
    });
  }
}
