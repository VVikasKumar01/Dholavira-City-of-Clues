/**
 * Realistic Procedural PBR Texture Generator for Dholavira Archaeological 3D Reconstruction
 * Dark Cinematic Archaeological Mystery Visual Style
 * Generates photorealistic weathered dark sandstone ashlar masonry, stratified ironstone bedrock,
 * aged antiqued limestone, dark arid desert terrain, terracotta pottery, weathered timber,
 * and high-frequency wave normal maps.
 */

import * as THREE from 'three';

// 1. Weathered Dark Sandstone Ashlar Masonry (Albedo & Normal)
export function createSandstoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark cinematic sandstone base tone: deep weathered umber & charcoal
  ctx.fillStyle = '#4c3726';
  ctx.fillRect(0, 0, 1024, 1024);

  // Geological sedimentary bedding layers in dark bronze and charcoal
  for (let y = 0; y < 1024; y += 3) {
    const layerTone = Math.sin(y * 0.035) * 12 + Math.cos(y * 0.01) * 6;
    ctx.fillStyle = `rgba(${86 + layerTone}, ${62 + layerTone * 0.7}, ${42 + layerTone * 0.5}, 0.28)`;
    ctx.fillRect(0, y, 1024, 3);
  }

  // Individual Dressed Ashlar Stone Blocks with realistic dark weathering
  const rows = 16;
  const rowHeight = 1024 / rows;
  const rnd = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    const offset = (r % 2 === 0 ? 0 : 54) + (r % 3 === 0 ? 28 : 0);
    const blockWidth = 110;

    for (let x = -blockWidth + (offset % blockWidth); x < 1024 + blockWidth; x += blockWidth) {
      const blockSeed = r * 37 + x * 13;
      const toneShift = (rnd(blockSeed) - 0.5) * 22;
      const redShift = (rnd(blockSeed + 1) - 0.5) * 12;

      // Fill individual stone block face with unique dark weathered tone
      ctx.fillStyle = `rgba(${82 + toneShift + redShift}, ${60 + toneShift * 0.75}, ${42 + toneShift * 0.55}, 0.42)`;
      ctx.fillRect(x + 2, y + 2, blockWidth - 4, rowHeight - 4);

      // Micro chisel marks on stone face
      ctx.strokeStyle = `rgba(${48 + toneShift * 0.4}, ${32 + toneShift * 0.3}, ${20 + toneShift * 0.2}, 0.45)`;
      ctx.lineWidth = 1;
      for (let ch = 0; ch < 6; ch++) {
        const cy = y + 4 + rnd(blockSeed + ch) * (rowHeight - 8);
        ctx.beginPath();
        ctx.moveTo(x + 4, cy);
        ctx.lineTo(x + blockWidth - 4, cy + (rnd(blockSeed + ch * 2) - 0.5) * 3);
        ctx.stroke();
      }

      // Deep dark mortar joints with soot/dust accumulation
      ctx.strokeStyle = '#1a1008';
      ctx.lineWidth = 3.2;
      ctx.strokeRect(x, y, blockWidth, rowHeight);

      // Subtle muted bronze highlight along upper stone edge
      ctx.strokeStyle = 'rgba(180, 130, 80, 0.18)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 2);
      ctx.lineTo(x + blockWidth - 2, y + 2);
      ctx.stroke();
    }
  }

  // Micro grain, mineral flecks & dark quartz inclusions
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 28;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.8));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.6));
  }
  ctx.putImageData(imgData, 0, 0);

  // Natural weathering fissures & ancient cracks with deep dark shadows
  ctx.strokeStyle = 'rgba(18, 10, 6, 0.85)';
  ctx.lineWidth = 1.4;
  for (let c = 0; c < 28; c++) {
    let cx = Math.random() * 1024;
    let cy = Math.random() * 1024;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 7; s++) {
      cx += (Math.random() - 0.5) * 36;
      cy += (Math.random() - 0.5) * 36;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Dark soot/smoke and water seepage staining streaks
  for (let st = 0; st < 12; st++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 500;
    const sLen = Math.random() * 250 + 100;
    const stainGrad = ctx.createLinearGradient(sx, sy, sx, sy + sLen);
    stainGrad.addColorStop(0, 'rgba(15, 10, 8, 0.45)');
    stainGrad.addColorStop(1, 'rgba(15, 10, 8, 0)');
    ctx.fillStyle = stainGrad;
    ctx.fillRect(sx - 15, sy, 30, sLen);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Normal Map for Sandstone Ashlar Masonry
export function createSandstoneNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Neutral normal map base: RGB (128, 128, 255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  // Block grid parameters
  const rows = 16;
  const rowHeight = 512 / rows;
  const blockWidth = 55;

  for (let y = 0; y < 512; y++) {
    const r = Math.floor(y / rowHeight);
    const inRowY = y % rowHeight;
    const offset = (r % 2 === 0 ? 0 : 27);

    for (let x = 0; x < 512; x++) {
      const inBlockX = (x + offset) % blockWidth;
      const idx = (y * 512 + x) * 4;

      // Surface noise
      let nx = 128 + (Math.random() - 0.5) * 16;
      let ny = 128 + (Math.random() - 0.5) * 16;
      let nz = 255;

      // Bevelled block joints
      const distFromEdgeX = Math.min(inBlockX, blockWidth - inBlockX);
      const distFromEdgeY = Math.min(inRowY, rowHeight - inRowY);

      if (distFromEdgeX < 4) {
        const factor = (4 - distFromEdgeX) * 20;
        if (inBlockX < 4) nx -= factor;
        else nx += factor;
      }
      if (distFromEdgeY < 4) {
        const factor = (4 - distFromEdgeY) * 20;
        if (inRowY < 4) ny += factor;
        else ny -= factor;
      }

      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = nz;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 2. Cut Bedrock with Geological Strata & Chisel Excavation Marks (Dark Geological Basin)
export function createBedrockTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark mineral bedrock base
  ctx.fillStyle = '#2f2117';
  ctx.fillRect(0, 0, 1024, 1024);

  // Distinct geological strata banding (dark slate, iron shale, muted charcoal)
  for (let y = 0; y < 1024; y += 6) {
    const bandType = (y / 18) % 4;
    let r = 58, g = 42, b = 30, alpha = 0.45;
    if (bandType < 1) {
      r = 38; g = 28; b = 20; // Deep charcoal iron shale
    } else if (bandType < 2) {
      r = 75; g = 52; b = 35; // Weathered dark ochre
    } else if (bandType < 3) {
      r = 85; g = 68; b = 50; // Caliche streak
      alpha = 0.28;
    }
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillRect(0, y, 1024, 6);
  }

  // Ancient Harappan stone chisel / quarry pick marks
  ctx.strokeStyle = 'rgba(18, 12, 8, 0.7)';
  ctx.lineWidth = 1.6;
  for (let y = 0; y < 1024; y += 32) {
    for (let x = 0; x < 1024; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 12 + Math.random() * 6, y + 20 + Math.random() * 8);
      ctx.stroke();
    }
  }

  // Deep damp water seepage marks along the bottom half
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.55, 'rgba(12, 18, 20, 0.35)');
  grad.addColorStop(1, 'rgba(6, 12, 15, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 3. Aged Antiqued Limestone for Pillars, Gateways & Coping
export function createLimestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Aged, weathered dark bone/limestone
  ctx.fillStyle = '#8f806d';
  ctx.fillRect(0, 0, 512, 512);

  // Soft calcite clouding & mottling in charcoal/bronze
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const cr = Math.random() * 80 + 20;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grad.addColorStop(0, 'rgba(180, 165, 145, 0.2)');
    grad.addColorStop(0.6, 'rgba(110, 95, 80, 0.25)');
    grad.addColorStop(1, 'rgba(60, 48, 38, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Weathering edge fissures and mineral patina
  ctx.strokeStyle = 'rgba(25, 18, 12, 0.55)';
  ctx.lineWidth = 1.1;
  for (let f = 0; f < 10; f++) {
    let fx = Math.random() * 512;
    let fy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    for (let s = 0; s < 5; s++) {
      fx += (Math.random() - 0.5) * 40;
      fy += (Math.random() - 0.5) * 40;
      ctx.lineTo(fx, fy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Dark Arid Desert Ground & Compacted Ancient Soil
export function createDesertGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark arid sun-baked soil base: deep charcoal-umber
  ctx.fillStyle = '#3a2719';
  ctx.fillRect(0, 0, 1024, 1024);

  // Wind-blown sand ripple ridges in dark bronze
  for (let y = 0; y < 1024; y += 4) {
    const ripple = Math.sin(y * 0.045 + Math.sin(y * 0.01) * 3) * 15;
    ctx.fillStyle = `rgba(${75 + ripple}, ${52 + ripple * 0.75}, ${34 + ripple * 0.5}, 0.32)`;
    ctx.fillRect(0, y, 1024, 4);
  }

  // Surface texture noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 30;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.8));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.6));
  }
  ctx.putImageData(imgData, 0, 0);

  // Deep arid clay desiccation fissures (mud cracks) with dark shadows
  ctx.strokeStyle = 'rgba(20, 12, 6, 0.8)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 50; i++) {
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let step = 0; step < 6; step++) {
      x += (Math.random() - 0.5) * 45;
      y += (Math.random() - 0.5) * 45;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Scattered dark gravel, pebbles, and fractured stone fragments
  for (let i = 0; i < 450; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const gr = Math.random() * 2.8 + 0.8;
    const isPale = Math.random() > 0.75;

    ctx.fillStyle = isPale ? 'rgba(145, 125, 105, 0.55)' : 'rgba(22, 14, 8, 0.85)';
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle mineral crust / salt pan residue
  ctx.fillStyle = 'rgba(180, 170, 160, 0.08)';
  for (let s = 0; s < 25; s++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1024;
    ctx.beginPath();
    ctx.ellipse(sx, sy, Math.random() * 35 + 15, Math.random() * 20 + 8, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// Normal Map for Arid Desert Ground (calculates true terrain micro-relief)
export function createDesertGroundNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      // Eolian sand ripple wave slope
      const rippleSlope = Math.cos(y * 0.09) * 24;
      const grainX = (Math.random() - 0.5) * 18;
      const grainY = (Math.random() - 0.5) * 18;

      data[idx] = Math.min(255, Math.max(0, 128 + grainX));
      data[idx + 1] = Math.min(255, Math.max(0, 128 + rippleSlope + grainY));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// 5. Physically Realistic Water Ripple Normal Map (Multi-frequency wave harmonics)
export function createWaterRippleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;

      // Multi-scale wave harmonics
      const wave1 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
      const wave2 = Math.sin((x + y) * 0.06) * 0.8;
      const wave3 = Math.cos(x * 0.18 + y * 0.12) * 0.45;
      const wave4 = Math.sin(x * 0.32 - y * 0.28) * 0.25;

      const combined = (wave1 + wave2 + wave3 + wave4) / 2.5;

      const nx = 128 + combined * 75;
      const ny = 128 + combined * 75;
      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// 6. Wet Stone Waterline Texture (Darkened saturated stone with glistening specular sheen & salt efflorescence)
export function createWetStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep obsidian-dark saturated sandstone & rock tone
  ctx.fillStyle = '#140d08';
  ctx.fillRect(0, 0, 512, 512);

  // Submerged-to-dry moisture gradient: drenched lower zone to drying upper rim
  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0.0, '#090e12'); // Submerged dark aquatic tone
  grad.addColorStop(0.35, '#12181b'); // Drenched water line
  grad.addColorStop(0.5, '#1d150e'); // Wet splash zone
  grad.addColorStop(0.75, '#281c13'); // Damp sandstone
  grad.addColorStop(1.0, '#36271c'); // Dry upper stone
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal water-level tide rings and mineral efflorescence line
  for (let ring = 0; ring < 6; ring++) {
    const ry = 180 + ring * 28 + (Math.sin(ring * 2) * 10);
    ctx.strokeStyle = ring % 2 === 0 ? 'rgba(180, 205, 215, 0.18)' : 'rgba(80, 110, 115, 0.22)';
    ctx.lineWidth = 2 + (ring % 3);
    ctx.beginPath();
    ctx.moveTo(0, ry);
    for (let x = 0; x <= 512; x += 16) {
      const ny = ry + Math.sin(x * 0.05 + ring) * 3 + Math.cos(x * 0.02) * 2;
      ctx.lineTo(x, ny);
    }
    ctx.stroke();
  }

  // Dark wet seepage streaks dripping downwards
  ctx.fillStyle = 'rgba(6, 12, 16, 0.45)';
  for (let s = 0; s < 36; s++) {
    const sx = (s * 15) % 512;
    const sy = 120 + (s * 7) % 100;
    const sh = 120 + (s * 19) % 220;
    const sw = 3 + (s % 5);
    ctx.fillRect(sx, sy, sw, sh);
  }

  // Glistening specular droplets and glossy micro-facets
  ctx.fillStyle = 'rgba(235, 245, 255, 0.28)';
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 512;
    const y = 140 + Math.random() * 360; // concentrated in lower wet half
    const size = Math.random() < 0.2 ? 3 : 1.5;
    ctx.fillRect(x, y, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 6B. Wet Stone Normal Map (Glistening glossy surface micro-facets)
export function createWetStoneNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const smoothFactor = y / 256; // Smoother towards bottom where drenched with water film
      const noise = (Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.6 + Math.sin(x * 0.3) * 0.4) * (1 - smoothFactor * 0.7);

      data[idx] = Math.min(255, Math.max(0, 128 + noise * 40));
      data[idx + 1] = Math.min(255, Math.max(0, 128 + noise * 40));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 7. Authentic Mature Harappan Terracotta Pottery Texture (Deep Red Slipped Ware with Black Painted Motifs)
export function createTerracottaPotteryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep burnt sienna terracotta slip
  ctx.fillStyle = '#7a3319';
  ctx.fillRect(0, 0, 512, 512);

  // Wheel striations
  for (let y = 0; y < 512; y += 2) {
    const tone = Math.sin(y * 0.1) * 10;
    ctx.fillStyle = `rgba(${135 + tone}, ${55 + tone * 0.5}, ${30 + tone * 0.3}, 0.25)`;
    ctx.fillRect(0, y, 512, 2);
  }

  // Black slip painted bands & Harappan geometric motifs
  ctx.fillStyle = '#100c0a';
  ctx.fillRect(0, 60, 512, 18);
  ctx.fillRect(0, 110, 512, 26);
  ctx.fillRect(0, 160, 512, 12);
  ctx.fillRect(0, 360, 512, 18);

  // Intersecting circles and pipal leaf motifs in central register
  ctx.strokeStyle = '#100c0a';
  ctx.lineWidth = 5;
  for (let x = 0; x < 512; x += 64) {
    ctx.beginPath();
    ctx.arc(x, 240, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 18, 230);
    ctx.lineTo(x + 18, 250);
    ctx.moveTo(x - 18, 250);
    ctx.lineTo(x + 18, 230);
    ctx.stroke();
    ctx.lineWidth = 5;
  }

  // Fine clay porosity grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 20;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.6));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

// 8. Weathered Desert Timber / Acacia Wood Texture for Scaffolding & Sluice Gates
export function createWeatheredWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark weathered acacia timber
  ctx.fillStyle = '#3a2b1f';
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal wood grain
  for (let x = 0; x < 512; x += 2) {
    const grain = Math.sin(x * 0.2 + Math.sin(x * 0.02) * 5) * 20;
    ctx.fillStyle = `rgba(${75 + grain}, ${52 + grain * 0.75}, ${35 + grain * 0.5}, 0.35)`;
    ctx.fillRect(x, 0, 2, 512);
  }

  // Wood knots and age fissures
  ctx.strokeStyle = 'rgba(20, 14, 8, 0.75)';
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 6; k++) {
    const kx = Math.random() * 512;
    const ky = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(kx, ky, 8, 22, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(kx, ky + 22);
    ctx.lineTo(kx + (Math.random() - 0.5) * 6, ky + 70);
    ctx.stroke();
  }

  // Muted bronze/iron nail studs
  ctx.fillStyle = '#654a22';
  for (let y = 60; y < 512; y += 120) {
    for (let x = 60; x < 512; x += 120) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 9. Archaeological Stratigraphy Profile Texture for Excavation Trenches
export function createStratigraphyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Layer I: Topsoil & Windblown Sand (0 - 100px)
  ctx.fillStyle = '#5c4530';
  ctx.fillRect(0, 0, 512, 100);

  // Layer II: Mature Harappan Urban Stratum IV (100 - 280px) with pottery shards and charcoal
  ctx.fillStyle = '#422f20';
  ctx.fillRect(0, 100, 512, 180);

  // Charcoal lenses
  ctx.fillStyle = 'rgba(12, 8, 6, 0.85)';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(Math.random() * 512, 140 + Math.random() * 100, Math.random() * 25 + 5, 3);
  }

  // Terracotta pottery shards embedded
  ctx.fillStyle = '#8b381b';
  for (let i = 0; i < 15; i++) {
    ctx.fillRect(Math.random() * 512, 130 + Math.random() * 110, Math.random() * 10 + 4, Math.random() * 6 + 2);
  }

  // Layer III: Early Harappan Cultural Layer (280 - 410px)
  ctx.fillStyle = '#543d2b';
  ctx.fillRect(0, 280, 512, 130);

  // Layer IV: Basal Natural Rock / Caliche (410 - 512px)
  ctx.fillStyle = '#2c1e14';
  ctx.fillRect(0, 410, 512, 102);

  // Stratum boundary wavy lines
  ctx.strokeStyle = 'rgba(20, 12, 6, 0.65)';
  ctx.lineWidth = 2;
  [100, 280, 410].forEach(boundaryY => {
    ctx.beginPath();
    ctx.moveTo(0, boundaryY);
    for (let x = 0; x < 512; x += 32) {
      ctx.lineTo(x, boundaryY + (Math.sin(x * 0.05) * 4));
    }
    ctx.stroke();
  });

  return new THREE.CanvasTexture(canvas);
}

// 10. Canvas Duck Cloth Texture for Explorer Outfit & Gear
export function createExplorerFabricTexture(baseHex = '#483c2e'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  // Cross-hatch fabric weave
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let x = 0; x < 256; x += 4) {
    ctx.fillRect(x, 0, 2, 256);
  }

  return new THREE.CanvasTexture(canvas);
}

// 11. Volumetric Ground Haze & Mist Gradient Texture
export function createHazeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(195, 140, 95, 0.45)');
  grad.addColorStop(0.35, 'rgba(130, 95, 70, 0.22)');
  grad.addColorStop(0.7, 'rgba(50, 40, 35, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      const noise = (Math.random() - 0.5) * 18;
      data[i + 3] = Math.min(255, Math.max(0, data[i + 3] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

// 12. Ancient Stone Brazier Flame & Ember Sprite Texture
export function createBrazierFlameTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(64, 185, 0, 64, 185, 120);
  grad.addColorStop(0, 'rgba(255, 245, 195, 1)');
  grad.addColorStop(0.25, 'rgba(255, 155, 35, 0.92)');
  grad.addColorStop(0.55, 'rgba(215, 75, 15, 0.55)');
  grad.addColorStop(0.8, 'rgba(110, 28, 5, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  return new THREE.CanvasTexture(canvas);
}

// 13. Procedural Dark Cinematic Sky Textures
export function createTwilightSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical sky gradient for mysterious twilight over ancient ruins
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0.0, '#020408'); // Zenith: Deep midnight black
  grad.addColorStop(0.22, '#070b15'); // Upper sky: Deep indigo obsidian
  grad.addColorStop(0.48, '#101726'); // Mid sky: Twilight slate navy
  grad.addColorStop(0.66, '#231d2b'); // Low sky: Dusky violet
  grad.addColorStop(0.76, '#4d2212'); // Horizon glow: Burnt copper-amber
  grad.addColorStop(0.84, '#6b3217'); // Sunset remnant rim
  grad.addColorStop(0.92, '#28150c'); // Low desert dust haze
  grad.addColorStop(1.0, '#060a12'); // Nadir ground silhouette

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Ancient desert constellations and stars in upper dome
  const rnd = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (let s = 0; s < 360; s++) {
    const sx = rnd(s * 17.1) * 2048;
    const sy = rnd(s * 31.4) * 620; // In upper 60% of sky
    const radius = rnd(s * 7.3) * 1.5 + 0.35;
    const opacity = (1.0 - sy / 620) * (rnd(s * 13.9) * 0.75 + 0.25);

    ctx.fillStyle = `rgba(255, 238, 215, ${opacity})`;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();

    if (radius > 1.1) {
      const starGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 3.5);
      starGlow.addColorStop(0, `rgba(255, 215, 150, ${opacity * 0.55})`);
      starGlow.addColorStop(1, 'rgba(255, 215, 150, 0)');
      ctx.fillStyle = starGlow;
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Faint celestial Milky Way dust haze band
  ctx.save();
  ctx.rotate(-0.15);
  const mwGrad = ctx.createRadialGradient(900, 300, 50, 900, 300, 600);
  mwGrad.addColorStop(0, 'rgba(120, 140, 190, 0.08)');
  mwGrad.addColorStop(0.5, 'rgba(90, 105, 150, 0.04)');
  mwGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = mwGrad;
  ctx.fillRect(0, 0, 2400, 800);
  ctx.restore();

  // Distant warm desert horizon dust layer
  const dustGrad = ctx.createLinearGradient(0, 720, 0, 880);
  dustGrad.addColorStop(0, 'rgba(120, 55, 25, 0)');
  dustGrad.addColorStop(0.5, 'rgba(160, 75, 30, 0.18)');
  dustGrad.addColorStop(1, 'rgba(80, 40, 20, 0)');
  ctx.fillStyle = dustGrad;
  ctx.fillRect(0, 720, 2048, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createGoldenSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0.0, '#060e1d');
  grad.addColorStop(0.35, '#122036');
  grad.addColorStop(0.60, '#352e35');
  grad.addColorStop(0.72, '#6f3918');
  grad.addColorStop(0.82, '#9c5422');
  grad.addColorStop(0.90, '#422414');
  grad.addColorStop(1.0, '#101520');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createNoonSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cinematic Late-Afternoon Golden-Hour Sky Gradient
  // Smooth atmospheric Rayleigh scattering transition from cobalt blue zenith to luminous golden horizon
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0.0, '#1c4d7b');   // Deep cobalt/cerulean sky at zenith
  grad.addColorStop(0.28, '#2a659c');  // Rich late-afternoon azure
  grad.addColorStop(0.52, '#6495be');  // Soft atmospheric transition
  grad.addColorStop(0.70, '#c48948');  // Warm amber golden-hour glow
  grad.addColorStop(0.82, '#de9c5c');  // Luminous terracotta peach
  grad.addColorStop(0.92, '#f6c67a');  // Radiant golden horizon band
  grad.addColorStop(0.98, '#e4b679');  // Desert dust horizon scattering
  grad.addColorStop(1.0, '#bca280');   // Arid desert terrain horizon boundary

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Golden Sun Disc & Volumetric Atmospheric Corona in the Western Sky
  const sunX = 1450;
  const sunY = 560;

  // Broad soft radial ambient atmospheric scattering
  const broadScatter = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 780);
  broadScatter.addColorStop(0, 'rgba(255, 235, 185, 0.42)');
  broadScatter.addColorStop(0.25, 'rgba(245, 185, 100, 0.24)');
  broadScatter.addColorStop(0.55, 'rgba(220, 140, 60, 0.10)');
  broadScatter.addColorStop(1, 'rgba(180, 100, 40, 0)');
  ctx.fillStyle = broadScatter;
  ctx.fillRect(0, 0, 2048, 1024);

  // Intense golden sun corona
  const corona = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 190);
  corona.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
  corona.addColorStop(0.18, 'rgba(255, 225, 150, 0.70)');
  corona.addColorStop(0.45, 'rgba(245, 175, 80, 0.35)');
  corona.addColorStop(1, 'rgba(235, 150, 60, 0)');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 190, 0, Math.PI * 2);
  ctx.fill();

  // Brilliant white-hot sun core
  const sunCore = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 32);
  sunCore.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  sunCore.addColorStop(0.65, 'rgba(255, 250, 220, 0.90)');
  sunCore.addColorStop(1, 'rgba(255, 220, 140, 0)');
  ctx.fillStyle = sunCore;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
  ctx.fill();

  // Natural wisps of golden-illuminated cirrus & altocumulus clouds
  for (let c = 0; c < 18; c++) {
    const cy = 200 + (c % 6) * 75 + Math.sin(c * 2.3) * 35;
    const cx = ((c * 155) % 1900) + 70;
    const cw = 220 + (c % 5) * 60;
    const ch = 14 + (c % 3) * 6;
    
    // Cloud illuminated with warm amber from sun direction
    const cloudGrad = ctx.createLinearGradient(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2);
    cloudGrad.addColorStop(0, 'rgba(255, 235, 200, 0.16)');
    cloudGrad.addColorStop(0.5, 'rgba(250, 210, 160, 0.22)');
    cloudGrad.addColorStop(1, 'rgba(220, 160, 110, 0.12)');
    ctx.fillStyle = cloudGrad;

    ctx.beginPath();
    ctx.ellipse(cx, cy, cw / 2, ch / 2, (c % 2 === 0 ? 0.03 : -0.02), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 14. Sandstone Roughness Texture (varying porosity and crystalline facets)
export function createSandstoneRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base roughness: medium-high matte
  ctx.fillStyle = '#c0c0c0'; // ~0.75 roughness
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Micro-quartz crystalline flecks are smoother (darker on roughness map)
    const isCrystal = Math.random() > 0.94;
    const val = isCrystal ? 80 + Math.random() * 40 : 180 + (Math.random() - 0.5) * 50;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  // Mortar lines are rougher (higher white)
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 3;
  const rows = 16;
  const rowHeight = 512 / rows;
  const blockWidth = 55;
  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    const offset = (r % 2 === 0 ? 0 : 27);
    for (let x = -blockWidth + offset; x < 512 + blockWidth; x += blockWidth) {
      ctx.strokeRect(x, y, blockWidth, rowHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 15. Bedrock Normal Map (quarried chisel gouges, fracture planes)
export function createBedrockNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      // Sedimentary horizontal bedding shear
      const strataSlope = Math.sin(y * 0.12) * 22;
      // Chisel strike angles
      const chisel = Math.sin((x * 0.4 + y * 0.7) * 0.8) * 16;
      const noise = (Math.random() - 0.5) * 14;

      data[idx] = Math.min(255, Math.max(0, 128 + chisel + noise));
      data[idx + 1] = Math.min(255, Math.max(0, 128 + strataSlope + noise));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 16. Desert Ground Roughness Texture (dry powdery sand vs hard polished stones)
export function createDesertGroundRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#e8e8e8'; // very high roughness base for sand
  ctx.fillRect(0, 0, 512, 512);

  // Polished gravel and pebbles have lower roughness (glossier)
  for (let i = 0; i < 350; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    const gr = Math.random() * 3 + 1;
    ctx.fillStyle = 'rgba(70, 70, 70, 0.75)';
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// 17. Ancient Harappan Paved Street (Flagstones with eroded joints & sand infill)
export function createAncientStreetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Sand infill base
  ctx.fillStyle = '#3a2719';
  ctx.fillRect(0, 0, 1024, 1024);

  // Dressed irregular flagstone slabs
  const cols = 8;
  const rows = 16;
  const slabW = 1024 / cols;
  const slabH = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * slabH;
    const offset = (r % 2 === 0 ? 0 : slabW * 0.45);
    for (let c = -1; c <= cols + 1; c++) {
      const x = c * slabW + offset;
      const seed = r * 41 + c * 17;
      const rnd = Math.abs(Math.sin(seed));
      const tone = 70 + rnd * 30;

      // Stone slab face
      ctx.fillStyle = `rgb(${tone + 15}, ${tone * 0.8 + 8}, ${tone * 0.58 + 5})`;
      ctx.fillRect(x + 4, y + 4, slabW - 8, slabH - 8);

      // Micro chisel grooves & cart-wheel wear ruts
      ctx.strokeStyle = 'rgba(30, 20, 12, 0.4)';
      ctx.lineWidth = 1.2;
      for (let g = 0; g < 4; g++) {
        ctx.beginPath();
        const gy = y + 10 + g * 12;
        ctx.moveTo(x + 6, gy);
        ctx.lineTo(x + slabW - 6, gy + (Math.sin(seed + g) - 0.5) * 4);
        ctx.stroke();
      }

      // Deep dark sand-filled joints
      ctx.strokeStyle = '#1e130a';
      ctx.lineWidth = 6;
      ctx.strokeRect(x + 1, y + 1, slabW - 2, slabH - 2);

      // Chipped stone corners
      ctx.fillStyle = '#1e130a';
      ctx.beginPath();
      ctx.arc(x + 4, y + 4, 3 + rnd * 3, 0, Math.PI * 2);
      ctx.arc(x + slabW - 4, y + 4, 3 + rnd * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Surface dust and sand accumulation
  ctx.fillStyle = 'rgba(75, 52, 34, 0.35)';
  for (let d = 0; d < 30; d++) {
    const dx = Math.random() * 1024;
    const dy = Math.random() * 1024;
    ctx.beginPath();
    ctx.ellipse(dx, dy, Math.random() * 50 + 20, Math.random() * 25 + 10, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  return texture;
}

// 18. Normal Map for Ancient Paved Street
export function createAncientStreetNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  const cols = 8;
  const rows = 16;
  const slabW = 512 / cols;
  const slabH = 512 / rows;

  for (let y = 0; y < 512; y++) {
    const r = Math.floor(y / slabH);
    const inSlabY = y % slabH;
    const offset = (r % 2 === 0 ? 0 : slabW * 0.45);

    for (let x = 0; x < 512; x++) {
      const inSlabX = (x + offset) % slabW;
      const idx = (y * 512 + x) * 4;

      let nx = 128 + (Math.random() - 0.5) * 12;
      let ny = 128 + (Math.random() - 0.5) * 12;

      // Slab bevels
      if (inSlabX < 3) nx -= 30;
      else if (inSlabX > slabW - 3) nx += 30;

      if (inSlabY < 3) ny -= 30;
      else if (inSlabY > slabH - 3) ny += 30;

      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  return texture;
}

// 19. Detailed Harappan Black-on-Red Painted Slip Pottery Texture
export function createPotteryDetailedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep micaceous terracotta red-brown slip base
  ctx.fillStyle = '#6e301d';
  ctx.fillRect(0, 0, 512, 512);

  // Potter's wheel horizontal turning ridges
  for (let y = 0; y < 512; y += 4) {
    const ridge = Math.sin(y * 0.15) * 10;
    ctx.fillStyle = `rgba(${120 + ridge}, ${55 + ridge * 0.6}, ${35 + ridge * 0.4}, 0.22)`;
    ctx.fillRect(0, y, 512, 2);
  }

  // Authentic Harappan painted iron-black motifs
  ctx.strokeStyle = '#150a06';
  ctx.fillStyle = '#150a06';

  // Upper rim thick and thin bands
  ctx.lineWidth = 12;
  ctx.strokeRect(0, 40, 512, 1);
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 60, 512, 1);
  ctx.strokeRect(0, 70, 512, 1);

  // Intersecting circles pattern (Harappan hallmark)
  const radius = 32;
  for (let x = 0; x < 512; x += 48) {
    ctx.beginPath();
    ctx.arc(x, 150, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 24, 150, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Peepal leaf and fish-scale motifs
  for (let x = 20; x < 512; x += 64) {
    // Hatched leaf motif
    ctx.beginPath();
    ctx.moveTo(x, 260);
    ctx.quadraticCurveTo(x + 20, 230, x + 40, 260);
    ctx.quadraticCurveTo(x + 20, 290, x, 260);
    ctx.stroke();
    // Inner veins
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 260);
    ctx.lineTo(x + 40, 260);
    ctx.stroke();
  }

  // Lower decorative border bands
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 360, 512, 1);
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 375, 512, 1);

  // Micro-spall chips and ancient abrasions
  ctx.fillStyle = 'rgba(215, 175, 140, 0.45)';
  for (let sp = 0; sp < 40; sp++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 20. Volumetric Sunbeam / God Ray Texture
export function createVolumetricBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical beam fade with soft radial edges
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, 'rgba(255, 200, 130, 0)');
  grad.addColorStop(0.2, 'rgba(255, 185, 100, 0.45)');
  grad.addColorStop(0.6, 'rgba(230, 150, 70, 0.35)');
  grad.addColorStop(0.9, 'rgba(180, 100, 40, 0.12)');
  grad.addColorStop(1.0, 'rgba(120, 60, 20, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Soft lateral falloff so beam doesn't have hard edges
  const hGrad = ctx.createLinearGradient(0, 0, 256, 0);
  hGrad.addColorStop(0.0, 'rgba(0, 0, 0, 1)');
  hGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
  hGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  hGrad.addColorStop(1.0, 'rgba(0, 0, 0, 1)');

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, 256, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 21. Dark Reflective Water Albedo Texture (Deep midnight obsidian aquatic base with subtle sediment nuances)
export function createDarkWaterAlbedoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark aquatic base
  ctx.fillStyle = '#020b11';
  ctx.fillRect(0, 0, 512, 512);

  // Deep subsurface aquatic currents and mineral swirl gradients
  for (let c = 0; c < 5; c++) {
    const grad = ctx.createRadialGradient(
      120 + (c * 95) % 400,
      140 + (c * 80) % 360,
      30,
      160 + (c * 90) % 400,
      180 + (c * 70) % 360,
      220
    );
    grad.addColorStop(0.0, 'rgba(8, 42, 58, 0.45)');
    grad.addColorStop(0.5, 'rgba(3, 24, 34, 0.25)');
    grad.addColorStop(1.0, 'rgba(1, 10, 16, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }

  // Faint subterranean caustic refraction web (simulating sunlight bouncing through clear deep water)
  ctx.strokeStyle = 'rgba(40, 140, 160, 0.08)';
  ctx.lineWidth = 1.5;
  for (let cell = 0; cell < 32; cell++) {
    const cx = (cell * 43) % 512;
    const cy = (cell * 71) % 512;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 32 + (cell % 24), 22 + (cell % 18), (cell * 0.4), 0, Math.PI * 2);
    ctx.stroke();
  }

  // Suspended ancient alluvial silt micro-specks (Dholavira river sediment)
  ctx.fillStyle = 'rgba(180, 160, 120, 0.09)';
  for (let s = 0; s < 180; s++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 22. Secondary Cross-Current Ripple Normal Map (Interference wave harmonics)
export function createWaterSecondaryRippleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;

      // Diagonal cross-frequency ripples and capillary waves
      const diagonalWave = Math.sin((x * 0.09 - y * 0.09) + 1.2) * 0.7;
      const capillary = Math.sin(x * 0.28 + y * 0.14) * Math.cos(x * 0.15 - y * 0.25) * 0.5;
      const fineLapping = Math.cos((x + y) * 0.35) * 0.25;

      const combined = (diagonalWave + capillary + fineLapping) / 1.45;

      const nx = 128 + combined * 60;
      const ny = 128 + combined * 60;

      data[idx] = Math.min(255, Math.max(0, nx));
      data[idx + 1] = Math.min(255, Math.max(0, ny));
      data[idx + 2] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 23. Dark Reservoir Interior Cut-Rock Texture (Deep damp rock-cut ashlar with silt settling)
export function createDarkReservoirInteriorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark damp bedrock base
  ctx.fillStyle = '#110b07';
  ctx.fillRect(0, 0, 512, 512);

  // Saturated horizontal bedrock strata lines
  for (let s = 0; s < 18; s++) {
    const sy = s * 28 + (s % 3) * 3;
    ctx.fillStyle = s % 2 === 0 ? '#18100a' : '#0d0704';
    ctx.fillRect(0, sy, 512, 14);

    // Ancient chisel score marks
    ctx.strokeStyle = '#070402';
    ctx.lineWidth = 1.2;
    for (let c = 0; c < 512; c += 18) {
      ctx.beginPath();
      ctx.moveTo(c, sy);
      ctx.lineTo(c + 4, sy + 14);
      ctx.stroke();
    }
  }

  // Dark wet silt accumulation along ledges and crevices
  ctx.fillStyle = 'rgba(5, 10, 14, 0.65)';
  for (let l = 0; l < 8; l++) {
    const ly = 60 + l * 56;
    ctx.fillRect(0, ly, 512, 8);
  }

  // Mineral salt and calcium carbonate seepage bands (historical Harappan waterproof hydraulic plaster patina)
  ctx.strokeStyle = 'rgba(140, 165, 175, 0.15)';
  ctx.lineWidth = 2.5;
  for (let b = 0; b < 4; b++) {
    const by = 110 + b * 110;
    ctx.beginPath();
    ctx.moveTo(0, by);
    for (let x = 0; x <= 512; x += 16) {
      ctx.lineTo(x, by + Math.sin(x * 0.04 + b) * 4);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 24. Atmospheric Reservoir Mist Texture (Volumetric vapor clouds hovering above water)
export function createReservoirMistTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);

  // Multiple soft radial vapor blooms
  for (let i = 0; i < 28; i++) {
    const cx = 80 + (i * 73) % 360;
    const cy = 80 + (i * 91) % 360;
    const r = 60 + (i % 6) * 22;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0.0, 'rgba(175, 215, 235, 0.42)');
    grad.addColorStop(0.4, 'rgba(130, 180, 210, 0.22)');
    grad.addColorStop(0.8, 'rgba(80, 130, 165, 0.08)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft horizontal wisps
  ctx.fillStyle = 'rgba(160, 205, 225, 0.12)';
  for (let w = 0; w < 12; w++) {
    const wy = 40 + w * 40;
    ctx.beginPath();
    ctx.ellipse(256, wy, 240, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 25. Ancient Archaeological Inscription & Mason Marks Texture
// Chiseled Harappan script symbols, mason cut-lines and deep weathering with golden specular accent
export function createArchaeologicalInscriptionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark weathered stone slab
  ctx.fillStyle = '#1c150e';
  ctx.fillRect(0, 0, 512, 512);

  // Weathering noise & mineral deposits
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(235, 175, 110, ${alpha})` : `rgba(0, 0, 0, ${alpha * 2})`;
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  // Chiseled Harappan Glyph Shapes with warm golden inner illumination
  ctx.strokeStyle = '#e69d45';
  ctx.shadowColor = '#ffd082';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Glyph 1: The Iconic Harappan "Jar / Spindle" sign (U-shape with crossbar)
  ctx.beginPath();
  ctx.moveTo(90, 160);
  ctx.lineTo(90, 290);
  ctx.arc(140, 290, 50, Math.PI, 0, true);
  ctx.lineTo(190, 160);
  ctx.moveTo(70, 160);
  ctx.lineTo(210, 160);
  ctx.moveTo(75, 230);
  ctx.lineTo(205, 230);
  ctx.stroke();

  // Glyph 2: The Harappan "Fish" sign (oval with dorsal fin & tail)
  ctx.beginPath();
  ctx.ellipse(330, 220, 65, 38, -0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(390, 220);
  ctx.lineTo(435, 190);
  ctx.lineTo(435, 250);
  ctx.closePath();
  ctx.stroke();
  // Dorsal fin & eye
  ctx.beginPath();
  ctx.moveTo(330, 182);
  ctx.lineTo(345, 155);
  ctx.lineTo(365, 185);
  ctx.stroke();
  ctx.fillStyle = '#ffc371';
  ctx.beginPath();
  ctx.arc(295, 215, 5, 0, Math.PI * 2);
  ctx.fill();

  // Mason's Metric Measurement Ticks & Excavation Datum Grid (along top and bottom)
  ctx.strokeStyle = '#c97a3e';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 4;
  for (let x = 40; x <= 472; x += 24) {
    const isMajor = (x - 40) % 72 === 0;
    const tickLen = isMajor ? 18 : 9;
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, 40 + tickLen);
    ctx.moveTo(x, 472);
    ctx.lineTo(x, 472 - tickLen);
    ctx.stroke();
  }

  // Chiseled relief depth shadow
  ctx.strokeStyle = '#050302';
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(92, 162);
  ctx.lineTo(92, 292);
  ctx.arc(140, 292, 50, Math.PI, 0, true);
  ctx.lineTo(192, 162);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 26. Subtle Archaeological Survey Datum Ring Texture
// Etched circular compass survey coordinate rings with Harappan geometric ticks
export function createArchaeologicalSurveyDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // Center subtle warm glow
  const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 210);
  centerGlow.addColorStop(0.0, 'rgba(255, 195, 113, 0.28)');
  centerGlow.addColorStop(0.4, 'rgba(201, 122, 62, 0.12)');
  centerGlow.addColorStop(0.8, 'rgba(120, 60, 20, 0.04)');
  centerGlow.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 210, 0, Math.PI * 2);
  ctx.fill();

  // Outer and Inner Etched Brass Rings
  ctx.shadowColor = '#e69d45';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#e6a86c';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(cx, cy, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 218, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.stroke();

  // Cardinal ticks & survey degree notches
  for (let i = 0; i < 48; i++) {
    const angle = (i * Math.PI * 2) / 48;
    const isCardinal = i % 12 === 0;
    const isMajor = i % 4 === 0;
    const rIn = isCardinal ? 198 : isMajor ? 208 : 218;
    const rOut = 230;

    const x1 = cx + Math.cos(angle) * rIn;
    const y1 = cy + Math.sin(angle) * rIn;
    const x2 = cx + Math.cos(angle) * rOut;
    const y2 = cy + Math.sin(angle) * rOut;

    ctx.lineWidth = isCardinal ? 3 : isMajor ? 2 : 1;
    ctx.strokeStyle = isCardinal ? '#ffd9a8' : '#e6a86c';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Crosshairs through center with break
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(230, 168, 108, 0.7)';
  // Horizontal
  ctx.beginPath();
  ctx.moveTo(cx - 240, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + 240, cy);
  // Vertical
  ctx.moveTo(cx, cy - 240);
  ctx.lineTo(cx, cy - 30);
  ctx.moveTo(cx, cy + 30);
  ctx.lineTo(cx, cy + 240);
  ctx.stroke();

  // Center specimen bullseye
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffd9a8';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 27. Soft Gaussian Dust Particle Texture (For atmospheric motes illuminated in golden light)
export function createDustParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 32;
  const cy = 32;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  grad.addColorStop(0.0, 'rgba(255, 235, 195, 1.0)');
  grad.addColorStop(0.2, 'rgba(255, 205, 140, 0.85)');
  grad.addColorStop(0.5, 'rgba(230, 160, 80, 0.35)');
  grad.addColorStop(0.8, 'rgba(180, 100, 40, 0.1)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 28. Focused Volumetric Light Beam Cone Texture
export function createGoldenGlowBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 512);

  // Downward expanding soft conical beam
  const grad = ctx.createLinearGradient(128, 0, 128, 512);
  grad.addColorStop(0.0, 'rgba(255, 220, 150, 0.45)');
  grad.addColorStop(0.2, 'rgba(240, 185, 110, 0.3)');
  grad.addColorStop(0.7, 'rgba(200, 130, 60, 0.12)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(110, 0);
  ctx.lineTo(146, 0);
  ctx.lineTo(240, 512);
  ctx.lineTo(16, 512);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}



