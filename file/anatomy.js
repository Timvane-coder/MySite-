import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import * as math from 'mathjs';
import GIFEncoder from 'gifencoder';
import { PassThrough } from 'stream';





// ============================================================================
// ANATOMICAL SHAPES LIBRARY
// ============================================================================
class AnatomicalShapes {
  static drawHeart(ctx, x, y, width, height, chamber, state = 'neutral') {
    ctx.save();
    ctx.translate(x, y);
    
    const colors = {
      deoxygenated: { base: '#8B4789', light: '#A569A0', dark: '#6B3569' },
      oxygenated: { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' },
      neutral: { base: '#E8B4B8', light: '#F5D7D9', dark: '#D19CA0' }
    };
    
    const color = colors[state] || colors.neutral;
    
    switch(chamber) {
      case 'rightAtrium':
        this.drawRightAtrium(ctx, color, width, height);
        break;
      case 'rightVentricle':
        this.drawRightVentricle(ctx, color, width, height);
        break;
      case 'leftAtrium':
        this.drawLeftAtrium(ctx, color, width, height);
        break;
      case 'leftVentricle':
        this.drawLeftVentricle(ctx, color, width, height);
        break;
      case 'wholeheart':
        this.drawWholeHeart(ctx, color, width, height);
        break;
    }
    
    ctx.restore();
  }

  static drawRightAtrium(ctx, color, width, height) {
    const w = width, h = height;
    
    // Create gradient for 3D effect
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Draw anatomically accurate right atrium shape
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.bezierCurveTo(w * 0.1, h * 0.05, w * 0.05, h * 0.15, w * 0.1, h * 0.3);
    ctx.bezierCurveTo(w * 0.15, h * 0.45, w * 0.25, h * 0.55, w * 0.4, h * 0.6);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.bezierCurveTo(w * 0.85, h * 0.55, w * 0.95, h * 0.45, w * 0.9, h * 0.3);
    ctx.bezierCurveTo(w * 0.85, h * 0.15, w * 0.75, h * 0.05, w * 0.6, h * 0.1);
    ctx.closePath();
    ctx.fill();
    
    // Add highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.25, w * 0.15, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add texture lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * (0.2 + i * 0.1));
      ctx.lineTo(w * 0.7, h * (0.25 + i * 0.08));
      ctx.stroke();
    }
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.bezierCurveTo(w * 0.1, h * 0.05, w * 0.05, h * 0.15, w * 0.1, h * 0.3);
    ctx.bezierCurveTo(w * 0.15, h * 0.45, w * 0.25, h * 0.55, w * 0.4, h * 0.6);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.bezierCurveTo(w * 0.85, h * 0.55, w * 0.95, h * 0.45, w * 0.9, h * 0.3);
    ctx.bezierCurveTo(w * 0.85, h * 0.15, w * 0.75, h * 0.05, w * 0.6, h * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawRightVentricle(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createRadialGradient(w * 0.4, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Anatomically accurate right ventricle (triangular/crescent shape)
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.1);
    ctx.bezierCurveTo(w * 0.15, h * 0.2, w * 0.1, h * 0.35, w * 0.15, h * 0.55);
    ctx.bezierCurveTo(w * 0.2, h * 0.75, w * 0.3, h * 0.9, w * 0.45, h * 0.95);
    ctx.bezierCurveTo(w * 0.55, h * 0.97, w * 0.65, h * 0.95, w * 0.7, h * 0.85);
    ctx.bezierCurveTo(w * 0.8, h * 0.65, w * 0.85, h * 0.45, w * 0.8, h * 0.25);
    ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.65, h * 0.08, w * 0.5, h * 0.1);
    ctx.closePath();
    ctx.fill();
    
    // Muscle striations
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const startY = h * (0.2 + i * 0.1);
      ctx.moveTo(w * 0.25, startY);
      ctx.quadraticCurveTo(w * 0.45, startY + h * 0.05, w * 0.65, startY);
      ctx.stroke();
    }
    
    // Apex (pointed bottom)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.85);
    ctx.lineTo(w * 0.45, h * 0.95);
    ctx.lineTo(w * 0.55, h * 0.85);
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.1);
    ctx.bezierCurveTo(w * 0.15, h * 0.2, w * 0.1, h * 0.35, w * 0.15, h * 0.55);
    ctx.bezierCurveTo(w * 0.2, h * 0.75, w * 0.3, h * 0.9, w * 0.45, h * 0.95);
    ctx.bezierCurveTo(w * 0.55, h * 0.97, w * 0.65, h * 0.95, w * 0.7, h * 0.85);
    ctx.bezierCurveTo(w * 0.8, h * 0.65, w * 0.85, h * 0.45, w * 0.8, h * 0.25);
    ctx.bezierCurveTo(w * 0.75, h * 0.15, w * 0.65, h * 0.08, w * 0.5, h * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawLeftAtrium(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Left atrium - similar to right but slightly smaller
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.15);
    ctx.bezierCurveTo(w * 0.15, h * 0.1, w * 0.08, h * 0.2, w * 0.12, h * 0.35);
    ctx.bezierCurveTo(w * 0.18, h * 0.48, w * 0.28, h * 0.58, w * 0.42, h * 0.62);
    ctx.lineTo(w * 0.68, h * 0.62);
    ctx.bezierCurveTo(w * 0.82, h * 0.58, w * 0.92, h * 0.48, w * 0.88, h * 0.35);
    ctx.bezierCurveTo(w * 0.84, h * 0.2, w * 0.75, h * 0.1, w * 0.62, h * 0.15);
    ctx.closePath();
    ctx.fill();
    
    // Pulmonary vein connections (4 openings)
    ctx.fillStyle = color.dark;
    const veinPositions = [[0.15, 0.25], [0.25, 0.18], [0.65, 0.18], [0.75, 0.25]];
    veinPositions.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.ellipse(w * px, h * py, w * 0.04, h * 0.03, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(w * 0.4, h * 0.3, w * 0.12, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.15);
    ctx.bezierCurveTo(w * 0.15, h * 0.1, w * 0.08, h * 0.2, w * 0.12, h * 0.35);
    ctx.bezierCurveTo(w * 0.18, h * 0.48, w * 0.28, h * 0.58, w * 0.42, h * 0.62);
    ctx.lineTo(w * 0.68, h * 0.62);
    ctx.bezierCurveTo(w * 0.82, h * 0.58, w * 0.92, h * 0.48, w * 0.88, h * 0.35);
    ctx.bezierCurveTo(w * 0.84, h * 0.2, w * 0.75, h * 0.1, w * 0.62, h * 0.15);
    ctx.closePath();
    ctx.stroke();
  }

  static drawLeftVentricle(ctx, color, width, height) {
    const w = width, h = height;
    
    const gradient = ctx.createRadialGradient(w * 0.45, h * 0.35, 0, w * 0.5, h * 0.5, w * 0.7);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.4, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    // Left ventricle - most muscular chamber (thicker walls)
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.08);
    ctx.bezierCurveTo(w * 0.2, h * 0.15, w * 0.12, h * 0.3, w * 0.15, h * 0.5);
    ctx.bezierCurveTo(w * 0.18, h * 0.68, w * 0.28, h * 0.85, w * 0.43, h * 0.95);
    ctx.lineTo(w * 0.57, h * 0.95);
    ctx.bezierCurveTo(w * 0.72, h * 0.85, w * 0.82, h * 0.68, w * 0.85, h * 0.5);
    ctx.bezierCurveTo(w * 0.88, h * 0.3, w * 0.8, h * 0.15, w * 0.65, h * 0.08);
    ctx.closePath();
    ctx.fill();
    
    // Thick myocardium (heart muscle) texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      ctx.beginPath();
      const startY = h * (0.15 + i * 0.08);
      ctx.moveTo(w * 0.22, startY);
      ctx.quadraticCurveTo(w * 0.5, startY + h * 0.04, w * 0.78, startY);
      ctx.stroke();
    }
    
    // Papillary muscles (internal structures)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.7);
    ctx.lineTo(w * 0.35, h * 0.85);
    ctx.lineTo(w * 0.4, h * 0.7);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.7);
    ctx.lineTo(w * 0.65, h * 0.85);
    ctx.lineTo(w * 0.7, h * 0.7);
    ctx.fill();
    
    // Apex
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(w * 0.43, h * 0.92);
    ctx.lineTo(w * 0.5, h * 0.98);
    ctx.lineTo(w * 0.57, h * 0.92);
    ctx.fill();
    
    // Strong outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.08);
    ctx.bezierCurveTo(w * 0.2, h * 0.15, w * 0.12, h * 0.3, w * 0.15, h * 0.5);
    ctx.bezierCurveTo(w * 0.18, h * 0.68, w * 0.28, h * 0.85, w * 0.43, h * 0.95);
    ctx.lineTo(w * 0.57, h * 0.95);
    ctx.bezierCurveTo(w * 0.72, h * 0.85, w * 0.82, h * 0.68, w * 0.85, h * 0.5);
    ctx.bezierCurveTo(w * 0.88, h * 0.3, w * 0.8, h * 0.15, w * 0.65, h * 0.08);
    ctx.closePath();
    ctx.stroke();
  }

  static drawWholeHeart(ctx, color, width, height) {
    const w = width, h = height;

    ctx.save();

    // Draw the classic heart shape outline
    const heartCenterX = w * 0.5;
    const heartCenterY = h * 0.4;
    
    // Create heart-shaped path
    ctx.beginPath();
    
    // Top left curve
    ctx.moveTo(heartCenterX, heartCenterY);
    ctx.bezierCurveTo(
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY
    );
    
    // Bottom left curve
    ctx.bezierCurveTo(
        heartCenterX - w * 0.4, heartCenterY + h * 0.15,
        heartCenterX - w * 0.25, heartCenterY + h * 0.3,
        heartCenterX, heartCenterY + h * 0.5
    );
    
    // Bottom right curve  
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.3,
        heartCenterX + w * 0.4, heartCenterY + h * 0.15,
        heartCenterX + w * 0.4, heartCenterY
    );
    
    // Top right curve
    ctx.bezierCurveTo(
        heartCenterX + w * 0.4, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY
    );
    
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createLinearGradient(heartCenterX - w * 0.4, 0, heartCenterX + w * 0.4, h);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Now draw chambers inside the heart shape
    // Right side (deoxygenated - purple)
    const rightColor = { base: '#8B4789', light: '#A569A0', dark: '#6B3569' };

    // Right atrium (top right)
    ctx.fillStyle = rightColor.base;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.bezierCurveTo(
        heartCenterX + w * 0.15, heartCenterY - h * 0.15,
        heartCenterX + w * 0.25, heartCenterY - h * 0.05,
        heartCenterX + w * 0.25, heartCenterY + h * 0.05
    );
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.closePath();
    ctx.fill();

    // Right ventricle (bottom right)
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX + w * 0.25, heartCenterY + h * 0.05);
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.2,
        heartCenterX + w * 0.15, heartCenterY + h * 0.35,
        heartCenterX, heartCenterY + h * 0.45
    );
    ctx.closePath();
    ctx.fill();

    // Left side (oxygenated - red)
    const leftColor = { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' };

    // Left atrium (top left)
    ctx.fillStyle = leftColor.base;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.bezierCurveTo(
        heartCenterX - w * 0.15, heartCenterY - h * 0.15,
        heartCenterX - w * 0.25, heartCenterY - h * 0.05,
        heartCenterX - w * 0.25, heartCenterY + h * 0.05
    );
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.closePath();
    ctx.fill();

    // Left ventricle (bottom left)
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX - w * 0.25, heartCenterY + h * 0.05);
    ctx.bezierCurveTo(
        heartCenterX - w * 0.25, heartCenterY + h * 0.2,
        heartCenterX - w * 0.15, heartCenterY + h * 0.35,
        heartCenterX, heartCenterY + h * 0.45
    );
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;

    // Septum (dividing line)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY - h * 0.15);
    ctx.lineTo(heartCenterX, heartCenterY + h * 0.45);
    ctx.stroke();

    // Horizontal dividing line between atria and ventricles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.25, heartCenterY + h * 0.05);
    ctx.lineTo(heartCenterX + w * 0.25, heartCenterY + h * 0.05);
    ctx.stroke();

    // Main vessels at top
    // Aorta (left)
    ctx.strokeStyle = leftColor.base;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.1, heartCenterY - h * 0.2);
    ctx.lineTo(heartCenterX - w * 0.1, heartCenterY - h * 0.4);
    ctx.stroke();

    // Pulmonary artery (right)
    ctx.strokeStyle = rightColor.base;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(heartCenterX + w * 0.1, heartCenterY - h * 0.2);
    ctx.lineTo(heartCenterX + w * 0.1, heartCenterY - h * 0.4);
    ctx.stroke();

    // Vena cava
    ctx.strokeStyle = rightColor.dark;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(heartCenterX + w * 0.25, heartCenterY - h * 0.1);
    ctx.lineTo(heartCenterX + w * 0.35, heartCenterY - h * 0.25);
    ctx.stroke();

    // Pulmonary veins
    ctx.strokeStyle = leftColor.base;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(heartCenterX - w * 0.25, heartCenterY - h * 0.1);
    ctx.lineTo(heartCenterX - w * 0.35, heartCenterY - h * 0.25);
    ctx.stroke();

    // Heart outline (stronger)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(heartCenterX, heartCenterY);
    ctx.bezierCurveTo(
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY - h * 0.3,
        heartCenterX - w * 0.4, heartCenterY
    );
    ctx.bezierCurveTo(
        heartCenterX - w * 0.4, heartCenterY + h * 0.15,
        heartCenterX - w * 0.25, heartCenterY + h * 0.3,
        heartCenterX, heartCenterY + h * 0.5
    );
    ctx.bezierCurveTo(
        heartCenterX + w * 0.25, heartCenterY + h * 0.3,
        heartCenterX + w * 0.4, heartCenterY + h * 0.15,
        heartCenterX + w * 0.4, heartCenterY
    );
    ctx.bezierCurveTo(
        heartCenterX + w * 0.4, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY - h * 0.3,
        heartCenterX, heartCenterY
    );
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawBloodVessel(ctx, x, y, width, height, type = 'artery', state = 'oxygenated') {
    ctx.save();
    ctx.translate(x, y);
    
    const colors = {
      artery_oxygenated: { base: '#E74C3C', light: '#FF6B6B', dark: '#C0392B' },
      artery_deoxygenated: { base: '#8B4789', light: '#A569A0', dark: '#6B3569' },
      vein_oxygenated: { base: '#C0392B', light: '#E74C3C', dark: '#A93226' },
      vein_deoxygenated: { base: '#6B3569', light: '#8B4789', dark: '#5B2D59' }
    };
    
    const colorKey = `${type}_${state}`;
    const color = colors[colorKey] || colors.artery_oxygenated;
    
    // Vessel walls
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color.dark);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    if(type === 'artery') {
      // Thicker walls for arteries
      ctx.fillRect(0, 0, width, height);
      
      // Muscular layers
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.1, 0);
      ctx.lineTo(width * 0.1, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(width * 0.9, 0);
      ctx.lineTo(width * 0.9, height);
      ctx.stroke();
    } else {
      // Thinner walls for veins
      ctx.fillRect(0, 0, width, height);
      
      // Valves
      const valveCount = Math.floor(height / 60);
      ctx.fillStyle = color.dark;
      for(let i = 0; i < valveCount; i++) {
        const y = (i + 1) * (height / (valveCount + 1));
        ctx.beginPath();
        ctx.moveTo(width * 0.2, y);
        ctx.lineTo(width * 0.5, y - 10);
        ctx.lineTo(width * 0.8, y);
        ctx.lineTo(width * 0.5, y + 5);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Lumen (inner space)
    ctx.fillStyle = color.light;
    ctx.fillRect(width * 0.25, height * 0.1, width * 0.5, height * 0.8);
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(width * 0.3, height * 0.15, width * 0.15, height * 0.7);
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    ctx.restore();
  }

  static drawBronchialTree(ctx, x, y, width, height, depth) {
    if (depth === 0 || height < 5) return; // Add height check to prevent issues

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height * 0.3);
    ctx.stroke();

    if (depth > 1) {
        const branchY = y + height * 0.3;

        // Left branch
        const leftX = x - width * 0.2;
        const leftY = branchY + height * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, branchY);
        ctx.lineTo(leftX, leftY);
        ctx.stroke();
        this.drawBronchialTree(ctx, leftX, leftY, width * 0.6, height * 0.5, depth - 1);

        // Right branch
        const rightX = x + width * 0.2;
        const rightY = branchY + height * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, branchY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
        this.drawBronchialTree(ctx, rightX, rightY, width * 0.6, height * 0.5, depth - 1);
    }
}

  static drawLung(ctx, x, y, width, height, side = 'left') {
    ctx.save();
    ctx.translate(x, y);
    
    const color = { base: '#FFB6D9', light: '#FFD4E8', dark: '#FF8FB6' };
    
    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    
    ctx.fillStyle = gradient;
    
    if(side === 'left') {
      // Left lung - 2 lobes
      // Superior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.25, width * 0.1, height * 0.4);
      ctx.lineTo(width * 0.8, height * 0.4);
      ctx.bezierCurveTo(width * 0.9, height * 0.3, width * 0.85, height * 0.15, width * 0.7, height * 0.1);
      ctx.closePath();
      ctx.fill();
      
      // Inferior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.45);
      ctx.bezierCurveTo(width * 0.05, height * 0.6, width * 0.1, height * 0.8, width * 0.25, height * 0.9);
      ctx.bezierCurveTo(width * 0.4, height * 0.95, width * 0.6, height * 0.95, width * 0.75, height * 0.88);
      ctx.bezierCurveTo(width * 0.88, height * 0.75, width * 0.9, height * 0.6, width * 0.8, height * 0.45);
      ctx.closePath();
      ctx.fill();
    } else {
      // Right lung - 3 lobes
      // Superior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.08);
      ctx.bezierCurveTo(width * 0.1, height * 0.12, width * 0.05, height * 0.2, width * 0.1, height * 0.32);
      ctx.lineTo(width * 0.8, height * 0.32);
      ctx.bezierCurveTo(width * 0.9, height * 0.25, width * 0.85, height * 0.12, width * 0.7, height * 0.08);
      ctx.closePath();
      ctx.fill();
      
      // Middle lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.36);
      ctx.lineTo(width * 0.8, height * 0.36);
      ctx.lineTo(width * 0.85, height * 0.52);
      ctx.lineTo(width * 0.15, height * 0.52);
      ctx.closePath();
      ctx.fill();
      
      // Inferior lobe
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.56);
      ctx.bezierCurveTo(width * 0.08, height * 0.68, width * 0.1, height * 0.82, width * 0.25, height * 0.92);
      ctx.bezierCurveTo(width * 0.42, height * 0.98, width * 0.62, height * 0.96, width * 0.77, height * 0.88);
      ctx.bezierCurveTo(width * 0.9, height * 0.75, width * 0.92, height * 0.62, width * 0.85, height * 0.56);
      ctx.closePath();
      ctx.fill();
    }
    
    // Bronchial tree
    ctx.strokeStyle = '#C44569';
    ctx.lineWidth = 3;
    this.drawBronchialTree(ctx, width * 0.45, height * 0.05, width * 0.4, height * 0.8, 3);
    
    // Alveoli texture (small circles)
    ctx.fillStyle = 'rgba(255, 182, 217, 0.5)';
    for(let i = 0; i < 20; i++) {
      const ax = width * (0.2 + Math.random() * 0.6);
      const ay = height * (0.2 + Math.random() * 0.7);
      ctx.beginPath();
      ctx.arc(ax, ay, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    if(side === 'left') {
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.25, width * 0.1, height * 0.4);
      ctx.bezierCurveTo(width * 0.05, height * 0.6, width * 0.1, height * 0.8, width * 0.25, height * 0.9);
      ctx.bezierCurveTo(width * 0.4, height * 0.95, width * 0.6, height * 0.95, width * 0.75, height * 0.88);
      ctx.bezierCurveTo(width * 0.88, height * 0.75, width * 0.9, height * 0.6, width * 0.8, height * 0.45);
      ctx.lineTo(width * 0.8, height * 0.4);
      ctx.bezierCurveTo(width * 0.9, height * 0.3, width * 0.85, height * 0.15, width * 0.7, height * 0.1);
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  


  static drawBrain(ctx, x, y, width, height, section = 'whole') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFB8D1', light: '#FFD4E5', dark: '#FF9AB8' };
    const gray = { base: '#C8B8C8', light: '#E0D0E0', dark: '#A898A8' };

    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Main cerebrum shape
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.3);
    ctx.bezierCurveTo(width * 0.05, height * 0.15, width * 0.2, height * 0.05, width * 0.5, height * 0.08);
    ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.95, height * 0.15, width * 0.85, height * 0.3);
    ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.7, width * 0.7, height * 0.85);
    ctx.bezierCurveTo(width * 0.55, height * 0.92, width * 0.45, height * 0.92, width * 0.3, height * 0.85);
    ctx.bezierCurveTo(width * 0.12, height * 0.7, width * 0.08, height * 0.5, width * 0.15, height * 0.3);
    ctx.closePath();
    ctx.fill();

    // Cerebral gyri (folds)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    
    // Left hemisphere gyri
    for(let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startY = height * (0.2 + i * 0.1);
      ctx.moveTo(width * 0.15, startY);
      ctx.bezierCurveTo(
        width * (0.2 + Math.random() * 0.05), startY + height * 0.02,
        width * (0.3 + Math.random() * 0.05), startY - height * 0.02,
        width * 0.45, startY
      );
      ctx.stroke();
    }

    // Right hemisphere gyri
    for(let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startY = height * (0.2 + i * 0.1);
      ctx.moveTo(width * 0.55, startY);
      ctx.bezierCurveTo(
        width * (0.65 + Math.random() * 0.05), startY - height * 0.02,
        width * (0.75 + Math.random() * 0.05), startY + height * 0.02,
        width * 0.85, startY
      );
      ctx.stroke();
    }

    // Longitudinal fissure (split between hemispheres)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.lineTo(width * 0.5, height * 0.7);
    ctx.stroke();

    // Cerebellum (back lower part)
    ctx.fillStyle = gray.base;
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.75);
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.3, height * 0.95, width * 0.5, height * 0.95);
    ctx.bezierCurveTo(width * 0.7, height * 0.95, width * 0.8, height * 0.85, width * 0.75, height * 0.75);
    ctx.closePath();
    ctx.fill();

    // Cerebellum folds
    ctx.strokeStyle = gray.dark;
    ctx.lineWidth = 1;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const x1 = width * (0.3 + i * 0.05);
      ctx.moveTo(x1, height * 0.78);
      ctx.lineTo(x1, height * 0.92);
      ctx.stroke();
    }

    // Brain stem
    ctx.fillStyle = gray.light;
    ctx.fillRect(width * 0.45, height * 0.85, width * 0.1, height * 0.1);

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.3);
    ctx.bezierCurveTo(width * 0.05, height * 0.15, width * 0.2, height * 0.05, width * 0.5, height * 0.08);
    ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.95, height * 0.15, width * 0.85, height * 0.3);
    ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.7, width * 0.7, height * 0.85);
    ctx.bezierCurveTo(width * 0.55, height * 0.92, width * 0.45, height * 0.92, width * 0.3, height * 0.85);
    ctx.bezierCurveTo(width * 0.12, height * 0.7, width * 0.08, height * 0.5, width * 0.15, height * 0.3);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }




  static drawLiver(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#8B4513', light: '#A0522D', dark: '#654321' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Liver shape (wedge-shaped with lobes)
    ctx.beginPath();
    // Right lobe (larger)
    ctx.moveTo(width * 0.4, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.15, width * 0.05, height * 0.3, width * 0.08, height * 0.6);
    ctx.bezierCurveTo(width * 0.12, height * 0.85, width * 0.25, height * 0.95, width * 0.45, height * 0.92);
    
    // Gallbladder notch
    ctx.lineTo(width * 0.52, height * 0.92);
    ctx.quadraticCurveTo(width * 0.54, height * 0.85, width * 0.56, height * 0.92);
    
    // Left lobe (smaller)
    ctx.lineTo(width * 0.7, height * 0.88);
    ctx.bezierCurveTo(width * 0.85, height * 0.82, width * 0.95, height * 0.65, width * 0.92, height * 0.45);
    ctx.bezierCurveTo(width * 0.88, height * 0.25, width * 0.75, height * 0.12, width * 0.55, height * 0.1);
    ctx.closePath();
    ctx.fill();

    // Lobules texture (hexagonal pattern)
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    for(let row = 0; row < 6; row++) {
      for(let col = 0; col < 8; col++) {
        const lobX = width * (0.15 + col * 0.1);
        const lobY = height * (0.25 + row * 0.12);
        this.drawHexagon(ctx, lobX, lobY, 4);
      }
    }

    // Hepatic vessels
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.3, height * 0.4);
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.7, height * 0.4);
    ctx.moveTo(width * 0.5, height * 0.15);
    ctx.lineTo(width * 0.5, height * 0.5);
    ctx.stroke();

    // Gallbladder
    ctx.fillStyle = '#9ACD32';
    ctx.beginPath();
    ctx.ellipse(width * 0.54, height * 0.78, width * 0.04, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B8E23';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Falciform ligament
    ctx.strokeStyle = '#D2B48C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.08);
    ctx.lineTo(width * 0.5, height * 0.6);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.15, width * 0.05, height * 0.3, width * 0.08, height * 0.6);
    ctx.bezierCurveTo(width * 0.12, height * 0.85, width * 0.25, height * 0.95, width * 0.45, height * 0.92);
    ctx.lineTo(width * 0.52, height * 0.92);
    ctx.quadraticCurveTo(width * 0.54, height * 0.85, width * 0.56, height * 0.92);
    ctx.lineTo(width * 0.7, height * 0.88);
    ctx.bezierCurveTo(width * 0.85, height * 0.82, width * 0.95, height * 0.65, width * 0.92, height * 0.45);
    ctx.bezierCurveTo(width * 0.88, height * 0.25, width * 0.75, height * 0.12, width * 0.55, height * 0.1);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawHexagon(ctx, x, y, radius) {
    ctx.beginPath();
    for(let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      if(i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
  }

  static drawKidney(ctx, x, y, width, height, side = 'left') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#8B0000', light: '#A52A2A', dark: '#660000' };

    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Kidney bean shape
    ctx.beginPath();
    if(side === 'left') {
      ctx.moveTo(width * 0.3, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.35, width * 0.1, height * 0.55);
      ctx.bezierCurveTo(width * 0.15, height * 0.75, width * 0.25, height * 0.9, width * 0.45, height * 0.92);
      ctx.bezierCurveTo(width * 0.65, height * 0.94, width * 0.82, height * 0.85, width * 0.88, height * 0.65);
      ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.35, width * 0.75, height * 0.25);
      // Hilum (indented area)
      ctx.bezierCurveTo(width * 0.68, height * 0.3, width * 0.62, height * 0.4, width * 0.65, height * 0.5);
      ctx.bezierCurveTo(width * 0.68, height * 0.6, width * 0.72, height * 0.68, width * 0.78, height * 0.72);
      ctx.bezierCurveTo(width * 0.7, height * 0.78, width * 0.58, height * 0.8, width * 0.45, height * 0.78);
      ctx.bezierCurveTo(width * 0.55, height * 0.6, width * 0.58, height * 0.4, width * 0.55, height * 0.2);
      ctx.bezierCurveTo(width * 0.48, height * 0.12, width * 0.38, height * 0.08, width * 0.3, height * 0.1);
    } else {
      // Mirror for right kidney
      ctx.moveTo(width * 0.7, height * 0.1);
      ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.95, height * 0.35, width * 0.9, height * 0.55);
      ctx.bezierCurveTo(width * 0.85, height * 0.75, width * 0.75, height * 0.9, width * 0.55, height * 0.92);
      ctx.bezierCurveTo(width * 0.35, height * 0.94, width * 0.18, height * 0.85, width * 0.12, height * 0.65);
      ctx.bezierCurveTo(width * 0.08, height * 0.5, width * 0.12, height * 0.35, width * 0.25, height * 0.25);
      ctx.bezierCurveTo(width * 0.32, height * 0.3, width * 0.38, height * 0.4, width * 0.35, height * 0.5);
      ctx.bezierCurveTo(width * 0.32, height * 0.6, width * 0.28, height * 0.68, width * 0.22, height * 0.72);
      ctx.bezierCurveTo(width * 0.3, height * 0.78, width * 0.42, height * 0.8, width * 0.55, height * 0.78);
      ctx.bezierCurveTo(width * 0.45, height * 0.6, width * 0.42, height * 0.4, width * 0.45, height * 0.2);
      ctx.bezierCurveTo(width * 0.52, height * 0.12, width * 0.62, height * 0.08, width * 0.7, height * 0.1);
    }
    ctx.closePath();
    ctx.fill();

    // Renal cortex (outer layer)
    ctx.strokeStyle = color.light;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Renal pyramids
    ctx.fillStyle = color.dark;
    const pyramidCount = 6;
    for(let i = 0; i < pyramidCount; i++) {
      const py = height * (0.2 + i * 0.12);
      const px = side === 'left' ? width * 0.35 : width * 0.65;
      ctx.beginPath();
      ctx.moveTo(px - 8, py);
      ctx.lineTo(px, py + 12);
      ctx.lineTo(px + 8, py);
      ctx.closePath();
      ctx.fill();
    }

    // Renal pelvis
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    const pelvisX = side === 'left' ? width * 0.68 : width * 0.32;
    ctx.ellipse(pelvisX, height * 0.5, width * 0.08, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ureter
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.65);
    ctx.lineTo(pelvisX, height * 0.95);
    ctx.stroke();

    // Renal artery and vein
    ctx.strokeStyle = '#E74C3C'; // Artery
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.45);
    ctx.lineTo(side === 'left' ? width * 0.95 : width * 0.05, height * 0.45);
    ctx.stroke();

    ctx.strokeStyle = '#8B4789'; // Vein
    ctx.beginPath();
    ctx.moveTo(pelvisX, height * 0.55);
    ctx.lineTo(side === 'left' ? width * 0.95 : width * 0.05, height * 0.55);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if(side === 'left') {
      ctx.moveTo(width * 0.3, height * 0.1);
      ctx.bezierCurveTo(width * 0.1, height * 0.15, width * 0.05, height * 0.35, width * 0.1, height * 0.55);
      ctx.bezierCurveTo(width * 0.15, height * 0.75, width * 0.25, height * 0.9, width * 0.45, height * 0.92);
      ctx.bezierCurveTo(width * 0.65, height * 0.94, width * 0.82, height * 0.85, width * 0.88, height * 0.65);
      ctx.bezierCurveTo(width * 0.92, height * 0.5, width * 0.88, height * 0.35, width * 0.75, height * 0.25);
    } else {
      ctx.moveTo(width * 0.7, height * 0.1);
      ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.95, height * 0.35, width * 0.9, height * 0.55);
      ctx.bezierCurveTo(width * 0.85, height * 0.75, width * 0.75, height * 0.9, width * 0.55, height * 0.92);
      ctx.bezierCurveTo(width * 0.35, height * 0.94, width * 0.18, height * 0.85, width * 0.12, height * 0.65);
      ctx.bezierCurveTo(width * 0.08, height * 0.5, width * 0.12, height * 0.35, width * 0.25, height * 0.25);
    }
    ctx.stroke();

    ctx.restore();
  }

  static drawStomach(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFA07A', light: '#FFB89A', dark: '#FF8866' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // J-shaped stomach
    ctx.beginPath();
    // Fundus (top rounded part)
    ctx.moveTo(width * 0.4, height * 0.15);
    ctx.bezierCurveTo(width * 0.2, height * 0.1, width * 0.1, height * 0.2, width * 0.15, height * 0.35);
    
    // Greater curvature (left side)
    ctx.bezierCurveTo(width * 0.12, height * 0.5, width * 0.15, height * 0.65, width * 0.25, height * 0.78);
    ctx.bezierCurveTo(width * 0.35, height * 0.88, width * 0.5, height * 0.92, width * 0.65, height * 0.88);
    
    // Pylorus (outlet to small intestine)
    ctx.bezierCurveTo(width * 0.75, height * 0.85, width * 0.82, height * 0.78, width * 0.85, height * 0.68);
    
    // Lesser curvature (right side)
    ctx.bezierCurveTo(width * 0.88, height * 0.55, width * 0.85, height * 0.4, width * 0.78, height * 0.28);
    ctx.bezierCurveTo(width * 0.7, height * 0.18, width * 0.58, height * 0.13, width * 0.4, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Gastric rugae (folds)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    for(let i = 0; i < 5; i++) {
      ctx.beginPath();
      const startY = height * (0.3 + i * 0.12);
      ctx.moveTo(width * 0.25, startY);
      ctx.bezierCurveTo(
        width * 0.35, startY - height * 0.02,
        width * 0.45, startY + height * 0.02,
        width * 0.6, startY
      );
      ctx.stroke();
    }

    // Esophageal opening (cardia)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.ellipse(width * 0.45, height * 0.15, width * 0.05, height * 0.03, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Pyloric sphincter
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.68, width * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Mucosa texture
    ctx.fillStyle = 'rgba(255, 160, 122, 0.3)';
    for(let i = 0; i < 15; i++) {
      const dotX = width * (0.2 + Math.random() * 0.5);
      const dotY = height * (0.3 + Math.random() * 0.5);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.15);
    ctx.bezierCurveTo(width * 0.2, height * 0.1, width * 0.1, height * 0.2, width * 0.15, height * 0.35);
    ctx.bezierCurveTo(width * 0.12, height * 0.5, width * 0.15, height * 0.65, width * 0.25, height * 0.78);
    ctx.bezierCurveTo(width * 0.35, height * 0.88, width * 0.5, height * 0.92, width * 0.65, height * 0.88);
    ctx.bezierCurveTo(width * 0.75, height * 0.85, width * 0.82, height * 0.78, width * 0.85, height * 0.68);
    ctx.bezierCurveTo(width * 0.88, height * 0.55, width * 0.85, height * 0.4, width * 0.78, height * 0.28);
    ctx.bezierCurveTo(width * 0.7, height * 0.18, width * 0.58, height * 0.13, width * 0.4, height * 0.15);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawIntestine(ctx, x, y, width, height, type = 'small') {
    ctx.save();
    ctx.translate(x, y);

    const smallColor = { base: '#FFB6C1', light: '#FFC8D3', dark: '#FFA4B0' };
    const largeColor = { base: '#E6A8B8', light: '#F0BAC8', dark: '#DC96A8' };
    const color = type === 'small' ? smallColor : largeColor;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    if(type === 'small') {
      // Small intestine - coiled/folded appearance
      const coils = 6;
      const coilHeight = height / (coils + 1);
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 2;

      for(let i = 0; i < coils; i++) {
        const yPos = (i + 1) * coilHeight;
        const direction = i % 2 === 0 ? 1 : -1;
        
        ctx.beginPath();
        ctx.moveTo(width * 0.1, yPos);
        ctx.bezierCurveTo(
          width * (0.3 * direction + 0.5), yPos - coilHeight * 0.4,
          width * (0.3 * direction + 0.5), yPos + coilHeight * 0.4,
          width * 0.9, yPos + coilHeight * 0.2
        );
        ctx.lineWidth = width * 0.08;
        ctx.strokeStyle = color.base;
        ctx.stroke();
        
        // Villi (small projections)
        ctx.lineWidth = 1;
        ctx.strokeStyle = color.dark;
        for(let v = 0; v < 20; v++) {
          const vx = width * (0.2 + Math.random() * 0.6);
          const vy = yPos + (Math.random() - 0.5) * coilHeight * 0.8;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx + 2, vy - 3);
          ctx.stroke();
        }
      }

      // Duodenum curve
      ctx.beginPath();
      ctx.strokeStyle = color.base;
      ctx.lineWidth = width * 0.09;
      ctx.moveTo(width * 0.5, 0);
      ctx.bezierCurveTo(width * 0.8, height * 0.05, width * 0.9, height * 0.15, width * 0.85, height * 0.25);
      ctx.stroke();

    } else {
      // Large intestine - frame shape (ascending, transverse, descending, sigmoid colon)
      ctx.fillStyle = color.base;
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = width * 0.12;

      // Ascending colon (right side going up)
      ctx.beginPath();
      ctx.moveTo(width * 0.85, height * 0.9);
      ctx.lineTo(width * 0.85, height * 0.2);
      ctx.stroke();

      // Transverse colon (across top)
      ctx.beginPath();
      ctx.moveTo(width * 0.85, height * 0.2);
      ctx.lineTo(width * 0.15, height * 0.2);
      ctx.stroke();

      // Descending colon (left side going down)
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.2);
      ctx.lineTo(width * 0.15, height * 0.65);
      ctx.stroke();

      // Sigmoid colon (S-shaped)
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.65);
      ctx.bezierCurveTo(
        width * 0.2, height * 0.75,
        width * 0.3, height * 0.8,
        width * 0.4, height * 0.85
      );
      ctx.bezierCurveTo(
        width * 0.5, height * 0.9,
        width * 0.6, height * 0.92,
        width * 0.7, height * 0.88
      );
      ctx.stroke();

      // Haustra (pouches) - characteristic of large intestine
      const haustraCount = 8;
      ctx.lineWidth = 2;
      ctx.strokeStyle = color.dark;
      
      // Haustra on ascending colon
      for(let i = 0; i < 4; i++) {
        const hy = height * (0.3 + i * 0.15);
        ctx.beginPath();
        ctx.arc(width * 0.85, hy, width * 0.05, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();
      }

      // Haustra on transverse colon
      for(let i = 0; i < 4; i++) {
        const hx = width * (0.75 - i * 0.15);
        ctx.beginPath();
        ctx.arc(hx, height * 0.2, width * 0.05, 0, Math.PI);
        ctx.stroke();
      }

      // Haustra on descending colon
      for(let i = 0; i < 3; i++) {
        const hy = height * (0.3 + i * 0.15);
        ctx.beginPath();
        ctx.arc(width * 0.15, hy, width * 0.05, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();
      }

      // Cecum (beginning of large intestine)
      ctx.fillStyle = color.light;
      ctx.beginPath();
      ctx.ellipse(width * 0.85, height * 0.85, width * 0.08, height * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Appendix
      ctx.strokeStyle = color.base;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width * 0.82, height * 0.92);
      ctx.lineTo(width * 0.78, height * 0.98);
      ctx.stroke();

      // Rectum
      ctx.lineWidth = width * 0.1;
      ctx.strokeStyle = color.base;
      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.88);
      ctx.lineTo(width * 0.65, height * 0.98);
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawPancreas(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFDAB9', light: '#FFE4C4', dark: '#F4C2A0' };

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Pancreas shape (elongated with head, body, tail)
    ctx.beginPath();
    // Head (right, widest part)
    ctx.moveTo(width * 0.85, height * 0.35);
    ctx.bezierCurveTo(width * 0.95, height * 0.3, width * 0.98, height * 0.4, width * 0.95, height * 0.55);
    ctx.bezierCurveTo(width * 0.92, height * 0.68, width * 0.85, height * 0.75, width * 0.75, height * 0.72);
    
    // Body (middle)
    ctx.bezierCurveTo(width * 0.6, height * 0.7, width * 0.45, height * 0.65, width * 0.3, height * 0.58);
    
    // Tail (left, pointed)
    ctx.bezierCurveTo(width * 0.15, height * 0.52, width * 0.05, height * 0.45, width * 0.02, height * 0.38);
    ctx.bezierCurveTo(width * 0.0, height * 0.32, width * 0.02, height * 0.28, width * 0.08, height * 0.3);
    
    // Top curve back
    ctx.bezierCurveTo(width * 0.25, height * 0.35, width * 0.45, height * 0.32, width * 0.65, height * 0.3);
    ctx.bezierCurveTo(width * 0.75, height * 0.28, width * 0.82, height * 0.3, width * 0.85, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Lobules (grape-like clusters)
    ctx.fillStyle = color.dark;
    const lobuleCount = 12;
    for(let i = 0; i < lobuleCount; i++) {
      const lx = width * (0.15 + i * 0.06);
      const ly = height * (0.4 + (Math.random() - 0.5) * 0.15);
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pancreatic duct (Wirsung duct)
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.88, height * 0.5);
    ctx.bezierCurveTo(width * 0.65, height * 0.48, width * 0.4, height * 0.45, width * 0.15, height * 0.4);
    ctx.stroke();

    // Islets of Langerhans (hormone-producing cells)
    ctx.fillStyle = '#FFE4B5';
    const isletCount = 8;
    for(let i = 0; i < isletCount; i++) {
      const ix = width * (0.2 + Math.random() * 0.6);
      const iy = height * (0.35 + Math.random() * 0.3);
      ctx.beginPath();
      ctx.arc(ix, iy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.85, height * 0.35);
    ctx.bezierCurveTo(width * 0.95, height * 0.3, width * 0.98, height * 0.4, width * 0.95, height * 0.55);
    ctx.bezierCurveTo(width * 0.92, height * 0.68, width * 0.85, height * 0.75, width * 0.75, height * 0.72);
    ctx.bezierCurveTo(width * 0.6, height * 0.7, width * 0.45, height * 0.65, width * 0.3, height * 0.58);
    ctx.bezierCurveTo(width * 0.15, height * 0.52, width * 0.05, height * 0.45, width * 0.02, height * 0.38);
    ctx.bezierCurveTo(width * 0.0, height * 0.32, width * 0.02, height * 0.28, width * 0.08, height * 0.3);
    ctx.bezierCurveTo(width * 0.25, height * 0.35, width * 0.45, height * 0.32, width * 0.65, height * 0.3);
    ctx.bezierCurveTo(width * 0.75, height * 0.28, width * 0.82, height * 0.3, width * 0.85, height * 0.35);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawSpleen(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#800080', light: '#9370DB', dark: '#4B0082' };

    const gradient = ctx.createRadialGradient(width * 0.4, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Spleen shape (oval/football-shaped)
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.15);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.08, height * 0.35, width * 0.12, height * 0.55);
    ctx.bezierCurveTo(width * 0.16, height * 0.75, width * 0.28, height * 0.9, width * 0.45, height * 0.92);
    ctx.bezierCurveTo(width * 0.62, height * 0.94, width * 0.78, height * 0.82, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(width * 0.92, height * 0.48, width * 0.88, height * 0.28, width * 0.75, height * 0.18);
    ctx.bezierCurveTo(width * 0.62, height * 0.08, width * 0.45, height * 0.1, width * 0.3, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Hilum (indentation where vessels enter)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.4);
    ctx.bezierCurveTo(width * 0.4, height * 0.45, width * 0.4, height * 0.55, width * 0.35, height * 0.6);
    ctx.stroke();

    // Splenic pulp texture (red and white pulp)
    ctx.fillStyle = 'rgba(147, 112, 219, 0.4)'; // White pulp
    for(let i = 0; i < 15; i++) {
      const px = width * (0.2 + Math.random() * 0.5);
      const py = height * (0.2 + Math.random() * 0.6);
      ctx.beginPath();
      ctx.arc(px, py, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Splenic artery
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.95, height * 0.45);
    ctx.bezierCurveTo(width * 0.7, height * 0.42, width * 0.5, height * 0.45, width * 0.38, height * 0.48);
    ctx.stroke();

    // Splenic vein
    ctx.strokeStyle = '#8B4789';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.38, height * 0.52);
    ctx.bezierCurveTo(width * 0.5, height * 0.55, width * 0.7, height * 0.58, width * 0.95, height * 0.55);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.15);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.08, height * 0.35, width * 0.12, height * 0.55);
    ctx.bezierCurveTo(width * 0.16, height * 0.75, width * 0.28, height * 0.9, width * 0.45, height * 0.92);
    ctx.bezierCurveTo(width * 0.62, height * 0.94, width * 0.78, height * 0.82, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(width * 0.92, height * 0.48, width * 0.88, height * 0.28, width * 0.75, height * 0.18);
    ctx.bezierCurveTo(width * 0.62, height * 0.08, width * 0.45, height * 0.1, width * 0.3, height * 0.15);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawBladder(ctx, x, y, width, height, fillLevel = 0.5) {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#FFD700', light: '#FFED4E', dark: '#D4AF37' };

    // Bladder wall
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Bladder shape (balloon-like when full)
    const fullness = 0.3 + fillLevel * 0.6; // Scale from 0.3 to 0.9
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.bezierCurveTo(
      width * (0.2 - fullness * 0.1), height * 0.15,
      width * (0.1 - fullness * 0.05), height * 0.4,
      width * 0.15, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.9);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.8, height * 0.85, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(
      width * (0.9 + fullness * 0.05), height * 0.4,
      width * (0.8 + fullness * 0.1), height * 0.15,
      width * 0.5, height * 0.1
    );
    ctx.closePath();
    ctx.fill();

    // Urine (if present)
    if(fillLevel > 0.1) {
      ctx.fillStyle = 'rgba(255, 255, 150, 0.6)';
      ctx.beginPath();
      const urineTop = height * (0.9 - fillLevel * 0.7);
      ctx.moveTo(width * 0.2, urineTop);
      ctx.lineTo(width * 0.8, urineTop);
      ctx.bezierCurveTo(width * 0.8, height * 0.85, width * 0.65, height * 0.92, width * 0.5, height * 0.9);
      ctx.bezierCurveTo(width * 0.35, height * 0.92, width * 0.2, height * 0.85, width * 0.2, urineTop);
      ctx.closePath();
      ctx.fill();
    }

    // Detrusor muscle (bladder wall texture)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const angle = (i * Math.PI) / 4;
      const x1 = width * 0.5 + Math.cos(angle) * width * 0.15;
      const y1 = height * 0.5 + Math.sin(angle) * height * 0.2;
      const x2 = width * 0.5 + Math.cos(angle) * width * 0.35;
      const y2 = height * 0.5 + Math.sin(angle) * height * 0.35;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Ureters (tubes from kidneys)
    ctx.strokeStyle = color.base;
    ctx.lineWidth = 3;
    // Left ureter
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.05);
    ctx.bezierCurveTo(width * 0.28, height * 0.08, width * 0.32, height * 0.12, width * 0.35, height * 0.15);
    ctx.stroke();
    // Right ureter
    ctx.beginPath();
    ctx.moveTo(width * 0.7, height * 0.05);
    ctx.bezierCurveTo(width * 0.72, height * 0.08, width * 0.68, height * 0.12, width * 0.65, height * 0.15);
    ctx.stroke();

    // Urethra (tube to outside)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.9);
    ctx.lineTo(width * 0.5, height * 0.98);
    ctx.stroke();

    // Trigone (triangular area at base)
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.75);
    ctx.lineTo(width * 0.65, height * 0.75);
    ctx.lineTo(width * 0.5, height * 0.85);
    ctx.closePath();
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.1);
    ctx.bezierCurveTo(
      width * (0.2 - fullness * 0.1), height * 0.15,
      width * (0.1 - fullness * 0.05), height * 0.4,
      width * 0.15, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.2, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.9);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.8, height * 0.85, width * 0.85, height * 0.65);
    ctx.bezierCurveTo(
      width * (0.9 + fullness * 0.05), height * 0.4,
      width * (0.8 + fullness * 0.1), height * 0.15,
      width * 0.5, height * 0.1
    );
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  static drawEye(ctx, x, y, width, height, pupilDilation = 0.3) {
    ctx.save();
    ctx.translate(x, y);

    // Sclera (white of eye)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.5, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blood vessels
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
    ctx.lineWidth = 0.5;
    for(let i = 0; i < 8; i++) {
      ctx.beginPath();
      const angle = (i * Math.PI) / 4;
      const startX = width * 0.5 + Math.cos(angle) * width * 0.25;
      const startY = height * 0.5 + Math.sin(angle) * height * 0.2;
      const endX = width * 0.5 + Math.cos(angle) * width * 0.42;
      const endY = height * 0.5 + Math.sin(angle) * height * 0.38;
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + Math.random() * 10 - 5,
        startY + Math.random() * 10 - 5,
        endX,
        endY
      );
      ctx.stroke();
    }

    // Iris
    const irisGradient = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 0,
      width * 0.5, height * 0.5, width * 0.25
    );
    irisGradient.addColorStop(0, '#8B7355');
    irisGradient.addColorStop(0.3, '#A0826D');
    irisGradient.addColorStop(0.7, '#654321');
    irisGradient.addColorStop(1, '#3E2723');
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Iris texture (radial lines)
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      ctx.beginPath();
      ctx.moveTo(
        width * 0.5 + Math.cos(angle) * width * 0.08,
        height * 0.5 + Math.sin(angle) * height * 0.08
      );
      ctx.lineTo(
        width * 0.5 + Math.cos(angle) * width * 0.24,
        height * 0.5 + Math.sin(angle) * height * 0.24
      );
      ctx.stroke();
    }

    // Pupil
    const pupilSize = width * (0.08 + pupilDilation * 0.12);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, pupilSize, 0, Math.PI * 2);
    ctx.fill();

    // Reflection/highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.45, width * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.42, height * 0.48, width * 0.02, 0, Math.PI * 2);
    ctx.fill();

    // Cornea outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.27, 0, Math.PI * 2);
    ctx.stroke();

    // Sclera outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.5, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawSkeleton(ctx, x, y, width, height, bone = 'skull') {
    ctx.save();
    ctx.translate(x, y);

    const boneColor = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    switch(bone) {
      case 'skull':
        this.drawSkull(ctx, boneColor, width, height);
        break;
      case 'femur':
        this.drawFemur(ctx, boneColor, width, height);
        break;
      case 'ribcage':
        this.drawRibcage(ctx, boneColor, width, height);
        break;
      case 'spine':
        this.drawSpine(ctx, boneColor, width, height);
        break;
    }

    ctx.restore();
  }

  static drawSkull(ctx, color, width, height) {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.4, width * 0.5);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.6, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Cranium (brain case)
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.bezierCurveTo(width * 0.15, height * 0.25, width * 0.1, height * 0.15, width * 0.2, height * 0.08);
    ctx.bezierCurveTo(width * 0.35, height * 0.02, width * 0.65, height * 0.02, width * 0.8, height * 0.08);
    ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.85, height * 0.25, width * 0.7, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.lineTo(width * 0.28, height * 0.55);
    ctx.lineTo(width * 0.35, height * 0.68);
    ctx.lineTo(width * 0.65, height * 0.68);
    ctx.lineTo(width * 0.72, height * 0.55);
    ctx.lineTo(width * 0.7, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Eye sockets
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(width * 0.35, height * 0.42, width * 0.08, height * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width * 0.65, height * 0.42, width * 0.08, height * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nasal cavity
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.52);
    ctx.lineTo(width * 0.42, height * 0.62);
    ctx.lineTo(width * 0.5, height * 0.64);
    ctx.lineTo(width * 0.58, height * 0.62);
    ctx.lineTo(width * 0.55, height * 0.52);
    ctx.closePath();
    ctx.fill();

    // Teeth (upper jaw)
    ctx.fillStyle = color.light;
    for(let i = 0; i < 8; i++) {
      const tx = width * (0.38 + i * 0.03);
      ctx.fillRect(tx, height * 0.68, width * 0.025, height * 0.05);
    }

    // Mandible (lower jaw)
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.68);
    ctx.lineTo(width * 0.28, height * 0.75);
    ctx.bezierCurveTo(width * 0.25, height * 0.85, width * 0.35, height * 0.92, width * 0.5, height * 0.94);
    ctx.bezierCurveTo(width * 0.65, height * 0.92, width * 0.75, height * 0.85, width * 0.72, height * 0.75);
    ctx.lineTo(width * 0.65, height * 0.68);
    ctx.closePath();
    ctx.fill();

    // Lower teeth
    ctx.fillStyle = color.light;
    for(let i = 0; i < 8; i++) {
      const tx = width * (0.38 + i * 0.03);
      ctx.fillRect(tx, height * 0.73, width * 0.025, height * 0.04);
    }
    // Cranial sutures (skull joints)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 1.5;
    // Sagittal suture
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.05);
    ctx.bezierCurveTo(width * 0.5, height * 0.15, width * 0.5, height * 0.25, width * 0.5, height * 0.35);
    ctx.stroke();
    // Coronal suture
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.15);
    ctx.bezierCurveTo(width * 0.35, height * 0.12, width * 0.65, height * 0.12, width * 0.78, height * 0.15);
    ctx.stroke();

    // Temporal bone features
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.4, width * 0.04, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.4, width * 0.04, 0, Math.PI * 2);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.35);
    ctx.bezierCurveTo(width * 0.15, height * 0.25, width * 0.1, height * 0.15, width * 0.2, height * 0.08);
    ctx.bezierCurveTo(width * 0.35, height * 0.02, width * 0.65, height * 0.02, width * 0.8, height * 0.08);
    ctx.bezierCurveTo(width * 0.9, height * 0.15, width * 0.85, height * 0.25, width * 0.7, height * 0.35);
    ctx.stroke();
  }

  static drawFemur(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Femoral head (ball joint at hip)
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.15, width * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Greater trochanter (bump on outside)
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.18, width * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.2);
    ctx.lineTo(width * 0.48, height * 0.28);
    ctx.lineTo(width * 0.52, height * 0.28);
    ctx.lineTo(width * 0.43, height * 0.15);
    ctx.closePath();
    ctx.fill();

    // Shaft (main body of femur)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.28);
    ctx.lineTo(width * 0.45, height * 0.75);
    ctx.lineTo(width * 0.55, height * 0.75);
    ctx.lineTo(width * 0.52, height * 0.28);
    ctx.closePath();
    ctx.fill();

    // Medullary cavity (marrow cavity - hollow center)
    ctx.fillStyle = '#FFE4C4';
    ctx.beginPath();
    ctx.moveTo(width * 0.49, height * 0.35);
    ctx.lineTo(width * 0.47, height * 0.7);
    ctx.lineTo(width * 0.53, height * 0.7);
    ctx.lineTo(width * 0.51, height * 0.35);
    ctx.closePath();
    ctx.fill();

    // Lateral condyle (outer knuckle)
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Medial condyle (inner knuckle)
    ctx.beginPath();
    ctx.arc(width * 0.6, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Intercondylar notch (groove between condyles)
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.82);
    ctx.lineTo(width * 0.46, height * 0.92);
    ctx.lineTo(width * 0.54, height * 0.92);
    ctx.lineTo(width * 0.52, height * 0.82);
    ctx.closePath();
    ctx.fill();

    // Linea aspera (ridge on back of shaft)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.32);
    ctx.lineTo(width * 0.5, height * 0.72);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.15, width * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.55, height * 0.18, width * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.4, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width * 0.6, height * 0.88, width * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }

  static drawRibcage(ctx, color, width, height) {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Sternum (breastbone)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.05);
    ctx.lineTo(width * 0.46, height * 0.55);
    ctx.lineTo(width * 0.54, height * 0.55);
    ctx.lineTo(width * 0.52, height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Manubrium (top of sternum)
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.05);
    ctx.lineTo(width * 0.42, height * 0.12);
    ctx.lineTo(width * 0.58, height * 0.12);
    ctx.lineTo(width * 0.56, height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Xiphoid process (bottom of sternum)
    ctx.beginPath();
    ctx.moveTo(width * 0.48, height * 0.55);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width * 0.52, height * 0.55);
    ctx.closePath();
    ctx.fill();

    // Ribs (12 pairs)
    ctx.strokeStyle = color.base;
    ctx.lineWidth = 3;
    ctx.fillStyle = gradient;

    const ribCount = 12;
    for(let i = 0; i < ribCount; i++) {
      const startY = height * (0.08 + i * 0.042);
      const ribWidth = width * (0.35 + (i < 7 ? i * 0.05 : (11 - i) * 0.03));
      const ribHeight = height * (0.08 + i * 0.01);

      // Right rib
      ctx.beginPath();
      ctx.moveTo(width * 0.52, startY);
      ctx.bezierCurveTo(
        width * (0.52 + ribWidth * 0.3), startY,
        width * (0.52 + ribWidth * 0.7), startY + ribHeight * 0.5,
        width * (0.52 + ribWidth), startY + ribHeight
      );
      if(i < 10) {
        // True and false ribs attach to sternum
        ctx.bezierCurveTo(
          width * (0.52 + ribWidth * 0.7), startY + ribHeight * 1.2,
          width * (0.52 + ribWidth * 0.3), startY + ribHeight * 0.8,
          width * 0.52, startY + ribHeight * 0.6
        );
      }
      ctx.stroke();

      // Left rib
      ctx.beginPath();
      ctx.moveTo(width * 0.48, startY);
      ctx.bezierCurveTo(
        width * (0.48 - ribWidth * 0.3), startY,
        width * (0.48 - ribWidth * 0.7), startY + ribHeight * 0.5,
        width * (0.48 - ribWidth), startY + ribHeight
      );
      if(i < 10) {
        ctx.bezierCurveTo(
          width * (0.48 - ribWidth * 0.7), startY + ribHeight * 1.2,
          width * (0.48 - ribWidth * 0.3), startY + ribHeight * 0.8,
          width * 0.48, startY + ribHeight * 0.6
        );
      }
      ctx.stroke();
    }

    // Costal cartilage (softer connection to sternum)
    ctx.strokeStyle = '#B0C4DE';
    ctx.lineWidth = 2;
    for(let i = 0; i < 7; i++) {
      const startY = height * (0.08 + i * 0.042);
      const cartY = startY + height * (0.05 + i * 0.008);
      ctx.beginPath();
      ctx.moveTo(width * 0.52, startY);
      ctx.lineTo(width * 0.65, cartY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width * 0.48, startY);
      ctx.lineTo(width * 0.35, cartY);
      ctx.stroke();
    }

    // Sternum outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.44, height * 0.05);
    ctx.lineTo(width * 0.42, height * 0.12);
    ctx.lineTo(width * 0.46, height * 0.55);
    ctx.lineTo(width * 0.5, height * 0.62);
    ctx.lineTo(width * 0.54, height * 0.55);
    ctx.lineTo(width * 0.58, height * 0.12);
    ctx.lineTo(width * 0.56, height * 0.05);
    ctx.closePath();
    ctx.stroke();
  }

  static drawSpine(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    // Vertebrae (33 bones, draw representative sections)
    const vertebraCount = 24; // Draw 24 vertebrae
    const vertebraHeight = height / vertebraCount;

    for(let i = 0; i < vertebraCount; i++) {
      const y = i * vertebraHeight;
      const size = width * (0.15 - Math.abs(i - 12) * 0.002); // Vary size

      ctx.fillStyle = gradient;

      // Vertebral body (anterior/front)
      ctx.beginPath();
      ctx.roundRect(width * 0.35, y + vertebraHeight * 0.2, width * 0.3, vertebraHeight * 0.6, 2);
      ctx.fill();

      // Vertebral arch (posterior)
      ctx.beginPath();
      ctx.arc(width * 0.5, y + vertebraHeight * 0.5, width * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Spinous process (the bump you can feel on your back)
      ctx.beginPath();
      ctx.moveTo(width * 0.48, y + vertebraHeight * 0.5);
      ctx.lineTo(width * 0.45, y + vertebraHeight * 0.8);
      ctx.lineTo(width * 0.55, y + vertebraHeight * 0.8);
      ctx.lineTo(width * 0.52, y + vertebraHeight * 0.5);
      ctx.closePath();
      ctx.fill();

      // Transverse processes (side projections)
      ctx.fillRect(width * 0.2, y + vertebraHeight * 0.4, width * 0.1, vertebraHeight * 0.2);
      ctx.fillRect(width * 0.7, y + vertebraHeight * 0.4, width * 0.1, vertebraHeight * 0.2);

      // Outline vertebra
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width * 0.35, y + vertebraHeight * 0.2, width * 0.3, vertebraHeight * 0.6, 2);
      ctx.stroke();
    }

    // Intervertebral discs (between vertebrae)
    ctx.fillStyle = '#87CEEB';
    for(let i = 0; i < vertebraCount - 1; i++) {
      const y = (i + 1) * vertebraHeight - vertebraHeight * 0.15;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, y, width * 0.18, vertebraHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spinal cord (inside vertebral canal)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.lineTo(width * 0.5, height);
    ctx.stroke();

    // Spinal nerves (exiting on sides)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < vertebraCount; i++) {
      const y = i * vertebraHeight + vertebraHeight * 0.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, y);
      ctx.lineTo(width * 0.15, y + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(width * 0.5, y);
      ctx.lineTo(width * 0.85, y + 5);
      ctx.stroke();
    }

    // Curvatures (natural curves of spine)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width * 0.5, 0);
    ctx.bezierCurveTo(
      width * 0.6, height * 0.15,
      width * 0.4, height * 0.4,
      width * 0.55, height * 0.65
    );
    ctx.bezierCurveTo(width * 0.6, height * 0.8, width * 0.5, height * 0.95, width * 0.5, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  static drawMuscle(ctx, x, y, width, height, type = 'bicep') {
    ctx.save();
    ctx.translate(x, y);

    const muscleColor = { base: '#DC143C', light: '#FF6B7A', dark: '#A52A2A' };

    switch(type) {
      case 'bicep':
        this.drawBicep(ctx, muscleColor, width, height);
        break;
      case 'heart':
        // Already have heart muscle, use cardiac pattern
        this.drawCardiacMuscle(ctx, muscleColor, width, height);
        break;
      case 'smooth':
        this.drawSmoothMuscle(ctx, muscleColor, width, height);
        break;
    }

    ctx.restore();
  }

  static drawBicep(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.dark);
    gradient.addColorStop(0.3, color.base);
    gradient.addColorStop(0.7, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;

    // Bicep muscle belly
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.lineTo(width * 0.65, height * 0.85);
    ctx.bezierCurveTo(width * 0.7, height * 0.75, width * 0.8, height * 0.65, width * 0.85, height * 0.5);
    ctx.bezierCurveTo(width * 0.9, height * 0.35, width * 0.85, height * 0.2, width * 0.7, height * 0.1);
    ctx.closePath();
    ctx.fill();

    // Muscle fibers (striations)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 20; i++) {
      ctx.beginPath();
      const y = height * (0.15 + i * 0.035);
      ctx.moveTo(width * 0.2, y);
      ctx.lineTo(width * 0.8, y);
      ctx.stroke();
    }

    // Tendons
    ctx.fillStyle = '#F5DEB3';
    // Upper tendon
    ctx.fillRect(width * 0.4, height * 0.02, width * 0.2, height * 0.1);
    // Lower tendon
    ctx.fillRect(width * 0.42, height * 0.85, width * 0.16, height * 0.13);

    // Fascia (connective tissue covering)
    ctx.strokeStyle = 'rgba(245, 222, 179, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.stroke();

    // Outline
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);
    ctx.bezierCurveTo(width * 0.15, height * 0.2, width * 0.1, height * 0.35, width * 0.15, height * 0.5);
    ctx.bezierCurveTo(width * 0.2, height * 0.65, width * 0.3, height * 0.75, width * 0.35, height * 0.85);
    ctx.lineTo(width * 0.65, height * 0.85);
    ctx.bezierCurveTo(width * 0.7, height * 0.75, width * 0.8, height * 0.65, width * 0.85, height * 0.5);
    ctx.bezierCurveTo(width * 0.9, height * 0.35, width * 0.85, height * 0.2, width * 0.7, height * 0.1);
    ctx.closePath();
    ctx.stroke();
  }

  static drawCardiacMuscle(ctx, color, width, height) {
    // Cardiac muscle cells (interconnected)
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.6);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Intercalated discs (connections between cells)
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      const y = height * (i / 10);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Striations
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for(let i = 0; i < 30; i++) {
      const y = height * (i / 30);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Branch points
    ctx.fillStyle = color.dark;
    for(let i = 0; i < 5; i++) {
      const x = width * (0.2 + Math.random() * 0.6);
      const y = height * (0.2 + Math.random() * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static drawSmoothMuscle(ctx, color, width, height) {
    // Smooth muscle (no striations, spindle-shaped cells)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color.light);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);

    // Draw spindle-shaped cells overlapping
    const cellCount = 15;
    for(let i = 0; i < cellCount; i++) {
      const cy = (i / cellCount) * height;
      const offset = (i % 2) * width * 0.1;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.15, height * 0.08, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Nucleus
      ctx.fillStyle = '#4B0082';
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.04, height * 0.02, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Outline
      ctx.strokeStyle = color.dark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width * 0.5 + offset, cy, width * 0.15, height * 0.08, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  static drawNeuron(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const neuronColor = { base: '#FFD700', light: '#FFED4E', dark: '#DAA520' };

    // Cell body (soma)
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.15);
    gradient.addColorStop(0, neuronColor.light);
    gradient.addColorStop(0.7, neuronColor.base);
    gradient.addColorStop(1, neuronColor.dark);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Nucleolus
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(width * 0.52, height * 0.48, width * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Dendrites (branching inputs)
    ctx.strokeStyle = neuronColor.base;
    ctx.lineWidth = 2;
    const dendriteCount = 6;
    for(let i = 0; i < dendriteCount; i++) {
      const angle = ((i / dendriteCount) * Math.PI * 2) - Math.PI / 2;
      if(Math.abs(angle) < Math.PI * 0.6) { // Don't draw on axon side
        this.drawDendrite(ctx, 
          width * 0.5 + Math.cos(angle) * width * 0.15,
          height * 0.5 + Math.sin(angle) * height * 0.15,
          angle, 3, width * 0.08
        );
      }
    }

    // Axon (long projection)
    ctx.strokeStyle = neuronColor.base;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.65);
    ctx.bezierCurveTo(
      width * 0.52, height * 0.75,
      width * 0.48, height * 0.85,
      width * 0.5, height * 0.95
    );
    ctx.stroke();

    // Myelin sheath (insulation on axon)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = neuronColor.dark;
    ctx.lineWidth = 1;
    const myelinSegments = 4;
    for(let i = 0; i < myelinSegments; i++) {
      const segY = height * (0.68 + i * 0.07);
      ctx.beginPath();
      ctx.ellipse(width * 0.5, segY, width * 0.04, height * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Nodes of Ranvier (gaps in myelin)
    ctx.fillStyle = neuronColor.base;
    for(let i = 0; i < myelinSegments - 1; i++) {
      const nodeY = height * (0.705 + i * 0.07);
      ctx.fillRect(width * 0.48, nodeY, width * 0.04, height * 0.01);
    }

    // Axon terminals (synaptic buttons)
    const terminalCount = 3;
    for(let i = 0; i < terminalCount; i++) {
      const tx = width * (0.4 + i * 0.1);
      ctx.fillStyle = neuronColor.light;
      ctx.beginPath();
      ctx.arc(tx, height * 0.98, width * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = neuronColor.dark;
      ctx.stroke();

      // Synaptic vesicles
      ctx.fillStyle = '#FF69B4';
      for(let v = 0; v < 3; v++) {
        ctx.beginPath();
        ctx.arc(
          tx + (Math.random() - 0.5) * width * 0.02,
          height * 0.98 + (Math.random() - 0.5) * height * 0.02,
          1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Connection line to terminal
      ctx.strokeStyle = neuronColor.base;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, height * 0.95);
      ctx.lineTo(tx, height * 0.95);
      ctx.stroke();
    }

    // Cell body outline
    ctx.strokeStyle = neuronColor.dark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, width * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawDendrite(ctx, x, y, angle, depth, length) {
    if(depth === 0 || length < 2) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Branch into smaller dendrites
    if(depth > 1) {
      this.drawDendrite(ctx, endX, endY, angle - 0.4, depth - 1, length * 0.7);
      this.drawDendrite(ctx, endX, endY, angle + 0.4, depth - 1, length * 0.7);
    }
  }

  static drawSkin(ctx, x, y, width, height, section = 'cross-section') {
    ctx.save();
    ctx.translate(x, y);

    if(section === 'cross-section') {
      // Epidermis (outer layer)
      const epidermisgradient = ctx.createLinearGradient(0, 0, 0, height * 0.15);
      epidermisgradient.addColorStop(0, '#F5D0C5');
      epidermisgradient.addColorStop(1, '#E8B4A8');
      ctx.fillStyle = epidermisgradient;
      ctx.fillRect(0, 0, width, height * 0.15);

      // Stratum corneum (dead cell layer)
      ctx.fillStyle = '#FAEBD7';
      for(let i = 0; i < 20; i++) {
        const cellX = (i / 20) * width;
        ctx.fillRect(cellX, 0, width / 22, height * 0.03);
      }

      // Dermis (middle layer)
      const dermisGradient = ctx.createLinearGradient(0, height * 0.15, 0, height * 0.75);
      dermisGradient.addColorStop(0, '#E8B4A8');
      dermisGradient.addColorStop(0.5, '#D19A8E');
      dermisGradient.addColorStop(1, '#C08878');
      ctx.fillStyle = dermisGradient;
      ctx.fillRect(0, height * 0.15, width, height * 0.6);

      // Hypodermis (subcutaneous fat layer)
      ctx.fillStyle = '#FFE4B5';
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // Fat cells
      ctx.fillStyle = '#FFEFD5';
      ctx.strokeStyle = '#DEB887';
      ctx.lineWidth = 1;
      for(let i = 0; i < 8; i++) {
        const fatX = width * (0.1 + (i % 4) * 0.22);
        const fatY = height * (0.77 + Math.floor(i / 4) * 0.12);
        ctx.beginPath();
        ctx.arc(fatX, fatY, width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Hair follicle
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.05);
      ctx.quadraticCurveTo(width * 0.32, height * 0.3, width * 0.35, height * 0.6);
      ctx.lineTo(width * 0.37, height * 0.6);
      ctx.quadraticCurveTo(width * 0.34, height * 0.3, width * 0.32, height * 0.05);
      ctx.closePath();
      ctx.fill();

      // Hair shaft (above skin)
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.31, 0);
      ctx.lineTo(width * 0.31, height * 0.06);
      ctx.stroke();

      // Sebaceous gland (oil gland)
      ctx.fillStyle = '#F0E68C';
      ctx.beginPath();
      ctx.arc(width * 0.34, height * 0.22, width * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#BDB76B';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sweat gland (coiled tube)
      ctx.strokeStyle = '#87CEEB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i = 0; i < 5; i++) {
        const coilY = height * (0.5 + i * 0.04);
        ctx.arc(width * 0.7, coilY, width * 0.03, 0, Math.PI * 2);
      }
      ctx.stroke();

      // Sweat duct
      ctx.beginPath();
      ctx.moveTo(width * 0.7, height * 0.5);
      ctx.lineTo(width * 0.68, height * 0.15);
      ctx.lineTo(width * 0.67, 0);
      ctx.stroke();

      // Blood vessels (capillaries)
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.4);
      ctx.bezierCurveTo(width * 0.2, height * 0.42, width * 0.3, height * 0.38, width * 0.5, height * 0.4);
      ctx.bezierCurveTo(width * 0.7, height * 0.42, width * 0.8, height * 0.38, width, height * 0.4);
      ctx.stroke();

      // Nerve endings (Meissner's corpuscles)
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 1;
      for(let i = 0; i < 3; i++) {
        const nerveX = width * (0.2 + i * 0.3);
        ctx.beginPath();
        ctx.ellipse(nerveX, height * 0.2, width * 0.02, height * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Pacinian corpuscle (pressure receptor, deeper)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.65, width * 0.05, 0, Math.PI * 2);
      ctx.fill();
      // Layered appearance
      for(let i = 1; i <= 3; i++) {
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.65, width * (0.05 - i * 0.012), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Layer labels/boundaries
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.15);
      ctx.lineTo(width, height * 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width, height * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  static drawRedBloodCell(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // Biconcave disc shape (side view creates characteristic dumbbell)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E74C3C');
    gradient.addColorStop(1, '#C0392B');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Central pallor (lighter center due to biconcave shape)
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#A52A2A';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawWhiteBloodCell(ctx, x, y, size, type = 'neutrophil') {
    ctx.save();
    ctx.translate(x, y);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#E8E8FF');
    gradient.addColorStop(0.6, '#D0D0F8');
    gradient.addColorStop(1, '#B8B8E8');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    switch(type) {
      case 'neutrophil':
        // Multi-lobed nucleus
        ctx.fillStyle = '#4B0082';
        for(let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.3,
            Math.sin(angle) * size * 0.3,
            size * 0.25,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;

      case 'lymphocyte':
        // Large round nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'monocyte':
        // Kidney-shaped nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.ellipse(-size * 0.15, 0, size * 0.45, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'eosinophil':
        // Bi-lobed nucleus
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(-size * 0.25, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.25, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        // Red granules
        ctx.fillStyle = '#FF6347';
        for(let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.6,
            Math.sin(angle) * size * 0.6,
            size * 0.08,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;

      case 'basophil':
        // Obscured nucleus with large granules
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Large dark granules
        ctx.fillStyle = '#191970';
        for(let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.cos(angle) * size * 0.5,
            Math.sin(angle) * size * 0.5,
            size * 0.12,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
    }

    // Outline
    ctx.strokeStyle = '#8888CC';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  static drawPlatelet(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // Small irregular disc
    ctx.fillStyle = '#DDA0DD';
    ctx.beginPath();
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = size * (0.8 + Math.random() * 0.4);
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if(i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Granules
    ctx.fillStyle = '#8B008B';
    for(let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * size * 0.5,
        (Math.random() - 0.5) * size * 0.5,
        size * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  static drawCell(ctx, x, y, size, type = 'generic') {
    ctx.save();
    ctx.translate(x, y);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#FFE4E1');
    gradient.addColorStop(0.6, '#FFD6D1');
    gradient.addColorStop(1, '#FFC8C1');

    // Cell membrane
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus
    ctx.fillStyle = '#9370DB';
    ctx.beginPath();
    ctx.arc(size * 0.1, -size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Nucleolus
    ctx.fillStyle = '#4B0082';
    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.05, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Mitochondria
    ctx.strokeStyle = '#FF6347';
    ctx.fillStyle = '#FF7F50';
    ctx.lineWidth = 1;
    for(let i = 0; i < 3; i++) {
      const mx = (Math.random() - 0.5) * size * 1.2;
      const my = (Math.random() - 0.5) * size * 1.2;
      ctx.beginPath();
      ctx.ellipse(mx, my, size * 0.15, size * 0.08, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Cristae (inner folds)
      ctx.strokeStyle = '#DC143C';
      for(let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.moveTo(mx - size * 0.1, my - size * 0.05 + j * size * 0.05);
        ctx.lineTo(mx + size * 0.1, my - size * 0.05 + j * size * 0.05);
        ctx.stroke();
      }
      ctx.strokeStyle = '#FF6347';
    }

    // Endoplasmic reticulum
    ctx.strokeStyle = '#8FBC8F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(let i = 0; i < 5; i++) {
      const erAngle = (i / 5) * Math.PI * 2;
      const erX = Math.cos(erAngle) * size * 0.6;
      const erY = Math.sin(erAngle) * size * 0.6;
      if(i === 0) ctx.moveTo(erX, erY);
      else ctx.lineTo(erX, erY);
    }
    ctx.stroke();

    // Ribosomes (small dots on ER)
    ctx.fillStyle = '#556B2F';
    for(let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = size * 0.6;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Golgi apparatus
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.4, size * 0.3, size * 0.15 + i * size * 0.03, Math.PI, Math.PI * 1.5);
      ctx.stroke();
    }

    // Lysosomes
    ctx.fillStyle = '#FF69B4';
    for(let i = 0; i < 3; i++) {
      const lx = (Math.random() - 0.5) * size * 1.2;
      const ly = (Math.random() - 0.5) * size * 1.2;
      ctx.beginPath();
      ctx.arc(lx, ly, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cell membrane outline
    ctx.strokeStyle = '#CD5C5C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();

    // Membrane proteins (bumps on surface)
    ctx.fillStyle = '#F08080';
    for(let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * size * 1.05,
        Math.sin(angle) * size * 1.05,
        size * 0.08,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  static drawDNA(ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);

    const turns = 5;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;

    // Draw double helix
    for(let strand = 0; strand < 2; strand++) {
      ctx.strokeStyle = strand === 0 ? '#4169E1' : '#DC143C';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for(let i = 0; i <= totalPoints; i++) {
        const t = i / totalPoints;
        const y_pos = t * height;
        const angle = t * turns * Math.PI * 2 + (strand * Math.PI);
        const x_pos = width * 0.5 + Math.cos(angle) * width * 0.3;

        if(i === 0) ctx.moveTo(x_pos, y_pos);
        else ctx.lineTo(x_pos, y_pos);
      }
      ctx.stroke();
    }

    // Base pairs (rungs of the ladder)
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    for(let i = 0; i < totalPoints; i += 2) {
      const t = i / totalPoints;
      const y_pos = t * height;
      const angle = t * turns * Math.PI * 2;
      
      const x1 = width * 0.5 + Math.cos(angle) * width * 0.3;
      const x2 = width * 0.5 + Math.cos(angle + Math.PI) * width * 0.3;

      ctx.beginPath();
      ctx.moveTo(x1, y_pos);
      ctx.lineTo(x2, y_pos);
      ctx.stroke();

      // Nucleotide bases (A-T, G-C)
      const bases = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'];
      const baseColor = bases[i % 4];
      
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(x1, y_pos, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y_pos, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static drawValve(ctx, x, y, width, height, type = 'atrioventricular', state = 'closed') {
    ctx.save();
    ctx.translate(x, y);

    const color = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    if(type === 'atrioventricular') {
      // Mitral or tricuspid valve
      const leaflets = type === 'mitral' ? 2 : 3;
      
      for(let i = 0; i < leaflets; i++) {
        const angle = (i / leaflets) * Math.PI * 2 - Math.PI / 2;
        const openAngle = state === 'open' ? 0.6 : 0;
        
        ctx.fillStyle = color.base;
        ctx.strokeStyle = color.dark;
        ctx.lineWidth = 2;
        
        ctx.save();
        ctx.rotate(angle + openAngle);
        
        // Valve leaflet
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          width * 0.2, height * 0.1,
          width * 0.3, height * 0.3,
          width * 0.25, height * 0.5
        );
        ctx.bezierCurveTo(
          width * 0.2, height * 0.4,
          width * 0.1, height * 0.2,
          0, 0
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Chordae tendineae (tendon strings)
        ctx.strokeStyle = '#CD853F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.5);
        ctx.lineTo(width * 0.3, height * 0.8);
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Papillary muscle attachment
      ctx.fillStyle = '#DC143C';
      ctx.beginPath();
      ctx.arc(0, height * 0.85, width * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
    } else if(type === 'semilunar') {
      // Aortic or pulmonary valve (3 cusps)
      for(let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const openAngle = state === 'open' ? 0.8 : 0;
        
        ctx.save();
        ctx.rotate(angle + openAngle);
        
        ctx.fillStyle = color.light;
        ctx.strokeStyle = color.dark;
        ctx.lineWidth = 2;
        
        // Semilunar cusp (pocket-like)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          width * 0.15, height * 0.05,
          width * 0.25, height * 0.15,
          width * 0.2, height * 0.3
        );
        ctx.bezierCurveTo(
          width * 0.15, height * 0.25,
          width * 0.05, height * 0.15,
          0, 0
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Nodule of Arantius (thickening at tip)
        ctx.fillStyle = color.dark;
        ctx.beginPath();
        ctx.arc(width * 0.12, height * 0.18, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    ctx.restore();
  }
}


// ============================================================================
// ANATOMICAL DIAGRAM RENDERER CLASS
// ============================================================================

class AnatomicalDiagramRenderer {
    constructor(canvas = null) {
        this.defaultFont = 'Arial, sans-serif';
        this.defaultFontSize = 12;
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;  // Only get context if canvas exists
    }
  // ============================================================================
  // CARDIOVASCULAR SYSTEM DIAGRAMS
  // ============================================================================

  renderHeartAnatomyDiagram(x, y, width, height, options = {}) {
    const {
      showLabels = true,
      showBloodFlow = true,
      animate = false,
      chamber = 'wholeheart'
    } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    if(showLabels) {
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = '#2C3E50';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Human Heart Anatomy', width / 2, -20);
    }

    // Draw heart
    if(chamber === 'wholeheart') {
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, 'wholeheart');
      
      if(showLabels) {
        this.addLabel('Right Atrium', width * 0.7, height * 0.2, '#8B4789');
        this.addLabel('Right Ventricle', width * 0.7, height * 0.6, '#8B4789');
        this.addLabel('Left Atrium', width * 0.2, height * 0.2, '#E74C3C');
        this.addLabel('Left Ventricle', width * 0.2, height * 0.6, '#E74C3C');
        this.addLabel('Septum', width * 0.5, height * 0.5, '#5D4E60');
      }

      // Blood flow arrows
      if(showBloodFlow) {
        // Deoxygenated blood (blue/purple) from body to right atrium
        this.drawArrow(width * 0.85, height * 0.15, width * 0.75, height * 0.22, '#8B4789', 'From Body');
        
        // To lungs from right ventricle
        this.drawArrow(width * 0.75, height * 0.4, width * 0.85, height * 0.35, '#8B4789', 'To Lungs');
        
        // Oxygenated blood (red) from lungs to left atrium
        this.drawArrow(width * 0.15, height * 0.15, width * 0.25, height * 0.22, '#E74C3C', 'From Lungs');
        
        // To body from left ventricle
        this.drawArrow(width * 0.25, height * 0.4, width * 0.15, height * 0.35, '#E74C3C', 'To Body');
      }
    } else {
      // Individual chamber view
      const state = chamber.includes('Atrium') ? 'deoxygenated' : 
                   chamber.includes('right') ? 'deoxygenated' : 'oxygenated';
      AnatomicalShapes.drawHeart(this.ctx, 0, 0, width, height, chamber, state);
      
      if(showLabels) {
        const chamberNames = {
          'rightAtrium': 'Right Atrium',
          'rightVentricle': 'Right Ventricle',
          'leftAtrium': 'Left Atrium',
          'leftVentricle': 'Left Ventricle'
        };
        this.addLabel(chamberNames[chamber], width / 2, -10, '#2C3E50');
      }
    }

    // Animation for heartbeat
    if(animate) {
      const scale = 1 + Math.sin(this.currentFrame * 0.1) * 0.05;
      this.ctx.scale(scale, scale);
    }

    this.ctx.restore();
  }



  renderCirculatorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showOxygenation = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Circulatory System', width / 2, -20);

    // Heart in center
    const heartWidth = width * 0.2;
    const heartHeight = height * 0.25;
    const heartX = width * 0.4;
    const heartY = height * 0.35;
    AnatomicalShapes.drawHeart(this.ctx, heartX, heartY, heartWidth, heartHeight, 'wholeheart');

    // Lungs
    const lungWidth = width * 0.15;
    const lungHeight = height * 0.2;
    AnatomicalShapes.drawLung(this.ctx, width * 0.15, height * 0.1, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.1, lungWidth, lungHeight, 'right');

    // Body representation (simplified)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.65, width * 0.3, height * 0.3, 10);
    this.ctx.fill();
    this.ctx.stroke();

    // Blood vessels - Pulmonary circulation (heart to lungs)
    // Right ventricle to lungs (deoxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.25, height * 0.25,
      '#8B4789', 'Pulmonary Artery'
    );
    this.drawCurvedArrow(
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.5,
      width * 0.7, height * 0.25,
      '#8B4789', ''
    );

    // Lungs to left atrium (oxygenated)
    this.drawCurvedArrow(
      width * 0.25, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', 'Pulmonary Vein'
    );
    this.drawCurvedArrow(
      width * 0.7, height * 0.32,
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.3,
      '#E74C3C', ''
    );

    // Systemic circulation (heart to body)
    // Left ventricle to body (oxygenated)
    this.drawCurvedArrow(
      heartX + heartWidth * 0.3, heartY + heartHeight * 0.7,
      width * 0.5, height * 0.65,
      '#E74C3C', 'Aorta'
    );

    // Body to right atrium (deoxygenated)
    this.drawCurvedArrow(
      width * 0.5, height * 0.95,
      heartX + heartWidth * 0.7, heartY + heartHeight * 0.7,
      '#8B4789', 'Vena Cava'
    );

    if(showLabels) {
      this.addLabel('Lungs', width * 0.25, height * 0.08, '#2C3E50');
      this.addLabel('Lungs', width * 0.7, height * 0.08, '#2C3E50');
      this.addLabel('Heart', heartX + heartWidth / 2, heartY - 10, '#2C3E50');
      this.addLabel('Body Tissues', width * 0.5, height * 0.8, '#2C3E50');
    }

    // Legend
    if(showOxygenation) {
      this.drawLegend(width * 0.02, height * 0.85, [
        { color: '#E74C3C', label: 'Oxygenated Blood' },
        { color: '#8B4789', label: 'Deoxygenated Blood' }
      ]);
    }

    this.ctx.restore();
  }

  renderBloodVesselComparison(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Vessel Comparison', width / 2, -20);

    const vesselWidth = width * 0.15;
    const vesselHeight = height * 0.8;
    const spacing = width * 0.28;

    // Artery (oxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'artery',
      'oxygenated'
    );
    if(showLabels) {
      this.addLabel('Artery', width * 0.175, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thick walls', width * 0.175, height * 0.95);
      this.ctx.fillText('High pressure', width * 0.175, height * 0.98);
    }

    // Vein (deoxygenated)
    AnatomicalShapes.drawBloodVessel(
      this.ctx,
      width * 0.1 + spacing,
      height * 0.1,
      vesselWidth,
      vesselHeight,
      'vein',
      'deoxygenated'
    );
    if(showLabels) {
      this.addLabel('Vein', width * 0.175 + spacing, height * 0.05, '#8B4789');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Thin walls', width * 0.175 + spacing, height * 0.95);
      this.ctx.fillText('Has valves', width * 0.175 + spacing, height * 0.98);
    }

    // Capillary
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.1 + spacing * 2, height * 0.1);
    this.ctx.lineTo(width * 0.1 + spacing * 2, height * 0.9);
    this.ctx.stroke();

    // Capillary detail (single cell layer)
    this.ctx.strokeStyle = '#95A5A6';
    this.ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      const cy = height * (0.15 + i * 0.075);
      this.ctx.beginPath();
      this.ctx.arc(width * 0.1 + spacing * 2, cy, 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    if(showLabels) {
      this.addLabel('Capillary', width * 0.1 + spacing * 2, height * 0.05, '#E74C3C');
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('One cell thick', width * 0.1 + spacing * 2, height * 0.95);
      this.ctx.fillText('Gas exchange', width * 0.1 + spacing * 2, height * 0.98);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // RESPIRATORY SYSTEM DIAGRAMS
  // ============================================================================

  renderRespiratorySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showGasExchange = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Respiratory System', width / 2, -20);

    // Trachea
    const tracheaWidth = width * 0.08;
    const tracheaHeight = height * 0.25;
    this.ctx.fillStyle = '#FFB6D9';
    this.ctx.strokeStyle = '#FF8FB6';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.46, height * 0.05, tracheaWidth, tracheaHeight, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Tracheal rings
    for(let i = 0; i < 8; i++) {
      this.ctx.strokeStyle = '#FF8FB6';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const ringY = height * (0.08 + i * 0.03);
      this.ctx.arc(width * 0.5, ringY, tracheaWidth * 0.5, Math.PI, 0);
      this.ctx.stroke();
    }

    // Bronchi (branching)
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.lineWidth = 6;
    // Left bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.48, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.35, width * 0.25, height * 0.42);
    this.ctx.stroke();
    // Right bronchus
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.52, height * 0.3);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.35, width * 0.75, height * 0.42);
    this.ctx.stroke();

    // Lungs
    const lungWidth = width * 0.3;
    const lungHeight = height * 0.55;
    AnatomicalShapes.drawLung(this.ctx, width * 0.05, height * 0.4, lungWidth, lungHeight, 'left');
    AnatomicalShapes.drawLung(this.ctx, width * 0.65, height * 0.4, lungWidth, lungHeight, 'right');

    // Diaphragm
    this.ctx.strokeStyle = '#DC143C';
    this.ctx.fillStyle = 'rgba(220, 20, 60, 0.2)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.05, height * 0.95);
    this.ctx.quadraticCurveTo(width * 0.5, height * 1.05, width * 0.95, height * 0.95);
    this.ctx.fill();
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Trachea', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Bronchi', width * 0.5, height * 0.35, '#2C3E50');
      this.addLabel('Left Lung', width * 0.2, height * 0.38, '#2C3E50');
      this.addLabel('Right Lung', width * 0.8, height * 0.38, '#2C3E50');
      this.addLabel('Diaphragm', width * 0.5, height * 0.98, '#2C3E50');
    }

    // Gas exchange inset
    if(showGasExchange) {
      this.drawGasExchangeInset(width * 0.65, height * 0.05, width * 0.3, height * 0.25);
    }

    this.ctx.restore();
  }

  drawGasExchangeInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Gas Exchange in Alveoli', width / 2, 15);

    // Alveolus
    this.ctx.strokeStyle = '#FFB6D9';
    this.ctx.fillStyle = 'rgba(255, 182, 217, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Capillary around alveolus
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.55, width * 0.22, 0, Math.PI * 2);
    this.ctx.stroke();

    // O2 molecules entering blood
    this.ctx.fillStyle = '#3498DB';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('O₂', width * 0.25, height * 0.45);
    this.drawArrow(width * 0.25, height * 0.48, width * 0.25, height * 0.58, '#3498DB');

    // CO2 molecules leaving blood
    this.ctx.fillStyle = '#E67E22';
    this.ctx.fillText('CO₂', width * 0.35, height * 0.65);
    this.drawArrow(width * 0.35, height * 0.62, width * 0.35, height * 0.52, '#E67E22');

    // Red blood cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, width * 0.45, height * 0.55, 8);

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Alveolus', width * 0.5, height * 0.4);
    this.ctx.fillText('Capillary', width * 0.5, height * 0.7);

    this.ctx.restore();
  }

  // ============================================================================
  // DIGESTIVE SYSTEM DIAGRAMS
  // ============================================================================

  renderDigestiveSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showPath = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive System', width / 2, -20);

    // Esophagus
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.fillRect(width * 0.45, 0, width * 0.1, height * 0.15);

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.35, height * 0.14, width * 0.3, height * 0.2);

    // Liver (overlapping stomach area)
    AnatomicalShapes.drawLiver(this.ctx, width * 0.15, height * 0.08, width * 0.25, height * 0.18);

    // Pancreas (behind stomach)
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.25, height * 0.24, width * 0.35, height * 0.08);

    // Small intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.25, height * 0.35, width * 0.5, height * 0.35, 'small');

    // Large intestine
    AnatomicalShapes.drawIntestine(this.ctx, width * 0.15, height * 0.3, width * 0.7, height * 0.65, 'large');

    if(showLabels) {
      this.addLabel('Esophagus', width * 0.5, -5, '#2C3E50');
      this.addLabel('Liver', width * 0.12, height * 0.12, '#8B4513');
      this.addLabel('Stomach', width * 0.35, height * 0.18, '#FFA07A');
      this.addLabel('Pancreas', width * 0.22, height * 0.28, '#FFDAB9');
      this.addLabel('Small\nIntestine', width * 0.5, height * 0.5, '#FFB6C1');
      this.addLabel('Large\nIntestine', width * 0.08, height * 0.55, '#E6A8B8');
    }

    // Digestive path arrow
    if(showPath) {
      this.ctx.strokeStyle = '#E74C3C';
      this.ctx.fillStyle = '#E74C3C';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.01);
      this.ctx.lineTo(width * 0.5, height * 0.14);
      this.ctx.quadraticCurveTo(width * 0.45, height * 0.24, width * 0.55, height * 0.34);
      this.ctx.quadraticCurveTo(width * 0.4, height * 0.5, width * 0.6, height * 0.65);
      this.ctx.quadraticCurveTo(width * 0.3, height * 0.4, width * 0.85, height * 0.5);
      this.ctx.quadraticCurveTo(width * 0.7, height * 0.7, width * 0.7, height * 0.88);
      this.ctx.stroke();
      
      this.ctx.setLineDash([]);
    }

    this.ctx.restore();
  }

  renderDigestiveOrganComparison(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digestive Organs', width / 2, -20);

    const organWidth = width * 0.22;
    const organHeight = height * 0.4;
    const spacing = width * 0.25;

    // Stomach
    AnatomicalShapes.drawStomach(this.ctx, width * 0.02, height * 0.1, organWidth, organHeight);
    this.addLabel('Stomach', width * 0.13, height * 0.05, '#FFA07A');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Digests proteins', width * 0.13, height * 0.55);
    this.ctx.fillText('Acidic environment', width * 0.13, height * 0.58);

    // Liver
    AnatomicalShapes.drawLiver(this.ctx, width * 0.02 + spacing, height * 0.1, organWidth, organHeight);
    this.addLabel('Liver', width * 0.13 + spacing, height * 0.05, '#8B4513');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Produces bile', width * 0.13 + spacing, height * 0.55);
    this.ctx.fillText('Detoxifies blood', width * 0.13 + spacing, height * 0.58);

    // Pancreas
    AnatomicalShapes.drawPancreas(this.ctx, width * 0.02 + spacing * 2, height * 0.18, organWidth * 1.3, organHeight * 0.6);
    this.addLabel('Pancreas', width * 0.13 + spacing * 2.2, height * 0.05, '#FFDAB9');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.fillText('Digestive enzymes', width * 0.13 + spacing * 2.2, height * 0.55);
    this.ctx.fillText('Insulin production', width * 0.13 + spacing * 2.2, height * 0.58);

    // Small intestine cross-section
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.fillStyle = '#FFD4E5';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.13, height * 0.78, organWidth * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Villi
    for(let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const vx = width * 0.13 + Math.cos(angle) * organWidth * 0.25;
      const vy = height * 0.78 + Math.sin(angle) * organWidth * 0.25;
      this.ctx.fillStyle = '#FFA4B0';
      this.ctx.beginPath();
      this.ctx.moveTo(vx, vy);
      this.ctx.lineTo(vx + Math.cos(angle) * 8, vy + Math.sin(angle) * 8);
      this.ctx.lineTo(vx + Math.cos(angle + 0.3) * 5, vy + Math.sin(angle + 0.3) * 5);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.addLabel('Small Intestine', width * 0.13, height * 0.65, '#FFB6C1');
    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nutrient absorption', width * 0.13, height * 0.92);
    this.ctx.fillText('Villi increase surface', width * 0.13, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // NERVOUS SYSTEM DIAGRAMS
  // ============================================================================

  renderNervousSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Central Nervous System', width / 2, -20);

    // Brain
    const brainWidth = width * 0.35;
    const brainHeight = height * 0.3;
    AnatomicalShapes.drawBrain(this.ctx, width * 0.32, height * 0.05, brainWidth, brainHeight);

    // Spinal cord
    const spineWidth = width * 0.12;
    const spineHeight = height * 0.6;
    AnatomicalShapes.drawSkeleton(this.ctx, width * 0.44, height * 0.35, spineWidth, spineHeight, 'spine');

    // Peripheral nerves
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 2;

    // Nerves branching from spinal cord
    for(let i = 0; i < 12; i++) {
      const ny = height * (0.4 + i * 0.045);
      
      // Left side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.44, ny);
      this.ctx.quadraticCurveTo(width * 0.3, ny + height * 0.02, width * 0.15, ny + height * 0.05);
      this.ctx.stroke();

      // Right side
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.56, ny);
      this.ctx.quadraticCurveTo(width * 0.7, ny + height * 0.02, width * 0.85, ny + height * 0.05);
      this.ctx.stroke();
    }

    // Nerve signal animation
    if(showSignal) {
      const signalY = height * (0.4 + (this.currentFrame % 60) / 5);
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if(showLabels) {
      this.addLabel('Brain', width * 0.5, height * 0.02, '#2C3E50');
      this.addLabel('Spinal Cord', width * 0.5, height * 0.33, '#2C3E50');
      this.addLabel('Peripheral\nNerves', width * 0.1, height * 0.5, '#FFD700');
    }

    this.ctx.restore();
  }

  renderNeuronDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, showSignal = false } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Neuron Structure', width / 2, -20);

    // Draw neuron
    AnatomicalShapes.drawNeuron(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Dendrites label
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.3);
      this.ctx.lineTo(width * 0.1, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Dendrites\n(receive signals)', width * 0.02, height * 0.23, '#2C3E50', 'left');

      // Cell body label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Cell Body\n(soma)', width * 0.82, height * 0.48, '#2C3E50', 'left');

      // Nucleus label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.5);
      this.ctx.lineTo(width * 0.7, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.58, '#2C3E50', 'left');

      // Axon label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.8);
      this.ctx.lineTo(width * 0.8, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Axon\n(transmits signals)', width * 0.82, height * 0.78, '#2C3E50', 'left');

      // Myelin sheath label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.68);
      this.ctx.lineTo(width * 0.7, height * 0.65);
      this.ctx.stroke();
      this.addLabel('Myelin Sheath', width * 0.72, height * 0.63, '#2C3E50', 'left');

      // Axon terminals label
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.45, height * 0.98);
      this.ctx.lineTo(width * 0.3, height * 0.95);
      this.ctx.stroke();
      this.addLabel('Axon Terminals\n(synaptic buttons)', width * 0.02, height * 0.93, '#2C3E50', 'left');
    }

    // Signal animation
    if(showSignal) {
      const signalProgress = (this.currentFrame % 60) / 60;
      const signalY = height * (0.3 + signalProgress * 0.68);
      
      this.ctx.fillStyle = '#FFD700';
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(width * 0.5, signalY, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();
  }

  // ============================================================================
  // SKELETAL SYSTEM DIAGRAMS
  // ============================================================================

  renderSkeletalSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, bone = 'skull' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const boneNames = {
      'skull': 'Human Skull',
      'femur': 'Femur (Thigh Bone)',
      'ribcage': 'Ribcage',
      'spine': 'Vertebral Column'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(boneNames[bone] || 'Skeletal System', width / 2, -20);

    // Draw bone
    AnatomicalShapes.drawSkeleton(this.ctx, 0, 0, width, height, bone);

    if(showLabels) {
      switch(bone) {
        case 'skull':
          this.addLabel('Cranium', width * 0.5, height * 0.15, '#2C3E50');
          this.addLabel('Eye Socket', width * 0.35, height * 0.42, '#2C3E50');
          this.addLabel('Nasal Cavity', width * 0.5, height * 0.57, '#2C3E50');
          this.addLabel('Mandible', width * 0.5, height * 0.85, '#2C3E50');
          break;
        case 'femur':
          this.addLabel('Femoral Head', width * 0.3, height * 0.15, '#2C3E50');
          this.addLabel('Greater\nTrochanter', width * 0.7, height * 0.18, '#2C3E50');
          this.addLabel('Shaft', width * 0.7, height * 0.5, '#2C3E50');
          this.addLabel('Condyles', width * 0.5, height * 0.88, '#2C3E50');
          break;
        case 'ribcage':
          this.addLabel('Sternum', width * 0.5, height * 0.3, '#2C3E50');
          this.addLabel('Ribs', width * 0.15, height * 0.5, '#2C3E50');
          this.addLabel('Costal\nCartilage', width * 0.75, height * 0.35, '#2C3E50');
          break;
        case 'spine':
          this.addLabel('Cervical\nVertebrae', width * 0.7, height * 0.15, '#2C3E50');
          this.addLabel('Thoracic\nVertebrae', width * 0.7, height * 0.4, '#2C3E50');
          this.addLabel('Lumbar\nVertebrae', width * 0.7, height * 0.65, '#2C3E50');
          this.addLabel('Sacrum', width * 0.7, height * 0.85, '#2C3E50');
          break;
      }
    }

    this.ctx.restore();
  }

  renderBoneStructureDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Bone Structure (Cross-Section)', width / 2, -20);

    // Long bone cross-section
    const boneColor = { base: '#F5F5DC', light: '#FFFAF0', dark: '#D3D3C0' };

    // Compact bone (outer layer)
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, boneColor.light);
    gradient.addColorStop(0.5, boneColor.base);
    gradient.addColorStop(1, boneColor.dark);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.2, height * 0.15, width * 0.6, height * 0.7, 10);
    this.ctx.fill();

    // Medullary cavity (marrow)
    this.ctx.fillStyle = '#FFE4C4';
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.35, height * 0.25, width * 0.3, height * 0.5, 5);
    this.ctx.fill();

    // Yellow marrow (fat)
    this.ctx.fillStyle = '#FFEFD5';
    for(let i = 0; i < 8; i++) {
      const mx = width * (0.4 + Math.random() * 0.2);
      const my = height * (0.3 + Math.random() * 0.4);
      this.ctx.beginPath();
      this.ctx.arc(mx, my, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Periosteum (outer membrane)
    this.ctx.strokeStyle = '#CD853F';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.19, height * 0.14, width * 0.62, height * 0.72, 10);
    this.ctx.stroke();

    // Haversian canals (in compact bone)
    this.ctx.fillStyle = '#FFB6C1';
    for(let i = 0; i < 6; i++) {
      for(let j = 0; j < 3; j++) {
        const hx = width * (0.23 + j * 0.06);
        const hy = height * (0.2 + i * 0.1);
        this.ctx.beginPath();
        this.ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Concentric lamellae around canal
        for(let k = 1; k <= 2; k++) {
          this.ctx.strokeStyle = 'rgba(211, 211, 192, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.arc(hx, hy, 2 + k * 3, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    }

    // Spongy bone (at ends)
    this.ctx.strokeStyle = boneColor.dark;
    this.ctx.lineWidth = 2;
    // Top end
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 3; j++) {
        const sx = width * (0.25 + i * 0.06);
        const sy = height * (0.05 + j * 0.03);
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(sx + 10, sy + 5);
        this.ctx.stroke();
      }
    }

    // Labels
    this.addLabel('Compact Bone', width * 0.05, height * 0.5, '#2C3E50', 'left');
    this.addLabel('Medullary Cavity\n(Bone Marrow)', width * 0.5, height * 0.5, '#2C3E50');
    this.addLabel('Periosteum', width * 0.15, height * 0.15, '#CD853F', 'left');
    this.addLabel('Haversian\nCanal', width * 0.23, height * 0.3, '#FFB6C1', 'center');
    this.addLabel('Spongy Bone', width * 0.5, height * 0.05, '#2C3E50');

    this.ctx.restore();
  }

  // ============================================================================
  // MUSCULAR SYSTEM DIAGRAMS
  // ============================================================================

  renderMuscularSystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'skeletal' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    const typeNames = {
      'skeletal': 'Skeletal Muscle',
      'cardiac': 'Cardiac Muscle',
      'smooth': 'Smooth Muscle'
    };

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(typeNames[type] || 'Muscle Types', width / 2, -20);

    if(type === 'skeletal') {
      // Draw bicep
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.3, height * 0.1, width * 0.4, height * 0.8, 'bicep');

      if(showLabels) {
        this.addLabel('Origin\n(Tendon)', width * 0.5, height * 0.05, '#2C3E50');
        this.addLabel('Muscle Belly', width * 0.75, height * 0.5, '#DC143C');
        this.addLabel('Insertion\n(Tendon)', width * 0.5, height * 0.95, '#2C3E50');
        
        // Muscle fiber detail inset
        this.drawMuscleFiberInset(width * 0.02, height * 0.1, width * 0.25, height * 0.3);
      }
    } else if(type === 'cardiac') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'heart');

      if(showLabels) {
        this.addLabel('Branching\nFibers', width * 0.75, height * 0.3, '#DC143C');
        this.addLabel('Intercalated\nDiscs', width * 0.75, height * 0.5, '#A52A2A');
      }
    } else if(type === 'smooth') {
      AnatomicalShapes.drawMuscle(this.ctx, width * 0.25, height * 0.1, width * 0.5, height * 0.8, 'smooth');

      if(showLabels) {
        this.addLabel('Spindle-shaped\nCells', width * 0.75, height * 0.4, '#DC143C');
        this.addLabel('No Striations', width * 0.75, height * 0.6, '#A52A2A');
      }
    }

    this.ctx.restore();
  }

  drawMuscleFiberInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Fiber Detail', width / 2, 12);

    // Muscle fiber
    this.ctx.fillStyle = '#DC143C';
    this.ctx.strokeStyle = '#A52A2A';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(width * 0.15, height * 0.2, width * 0.7, height * 0.7, 3);
    this.ctx.fill();
    this.ctx.stroke();

    // Myofibrils (internal structures)
    for(let i = 0; i < 4; i++) {
      const fx = width * (0.25 + i * 0.15);
      this.ctx.strokeStyle = '#8B0000';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(fx, height * 0.25);
      this.ctx.lineTo(fx, height * 0.85);
      this.ctx.stroke();
    }

    // Striations (Z-lines)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    for(let i = 0; i < 8; i++) {
      const fy = height * (0.3 + i * 0.08);
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, fy);
      this.ctx.lineTo(width * 0.8, fy);
      this.ctx.stroke();
    }

    // Nuclei
    this.ctx.fillStyle = '#4B0082';
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.3, height * 0.4, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(width * 0.6, height * 0.6, width * 0.05, height * 0.06, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Labels
    this.ctx.font = '9px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Sarcomere', width * 0.05, height * 0.5);
    this.ctx.fillText('Nucleus', width * 0.87, height * 0.45);

    this.ctx.restore();
  }

  renderMuscleContractionDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Muscle Contraction (Sliding Filament)', width / 2, -20);

    const sarcomereHeight = height * 0.35;

    // Relaxed sarcomere
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('RELAXED', width * 0.05, height * 0.15);

    this.drawSarcomere(width * 0.1, height * 0.18, width * 0.8, sarcomereHeight, false);

    // Contracted sarcomere
    this.ctx.fillText('CONTRACTED', width * 0.05, height * 0.6);
    this.drawSarcomere(width * 0.1, height * 0.63, width * 0.8, sarcomereHeight, true);

    // Arrows showing direction
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.lineWidth = 3;
    
    // Left arrow
    this.drawArrow(width * 0.15, height * 0.55, width * 0.35, height * 0.55, '#E74C3C', '', 10);
    // Right arrow
    this.drawArrow(width * 0.85, height * 0.55, width * 0.65, height * 0.55, '#E74C3C', '', 10);

    this.ctx.restore();
  }

  drawSarcomere(x, y, width, height, contracted = false) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const overlapWidth = contracted ? width * 0.35 : width * 0.15;

    // Z-lines (boundaries)
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(width, 0);
    this.ctx.lineTo(width, height);
    this.ctx.stroke();

    // M-line (center)
    this.ctx.beginPath();
    this.ctx.moveTo(width / 2, height * 0.3);
    this.ctx.lineTo(width / 2, height * 0.7);
    this.ctx.stroke();

    // Thin filaments (actin - red)
    this.ctx.strokeStyle = '#E74C3C';
    this.ctx.lineWidth = 4;
    for(let i = 0; i < 5; i++) {
      const yPos = height * (0.2 + i * 0.15);
      // From left Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(5, yPos);
      this.ctx.lineTo(overlapWidth + width * 0.1, yPos);
      this.ctx.stroke();
      // From right Z-line
      this.ctx.beginPath();
      this.ctx.moveTo(width - 5, yPos);
      this.ctx.lineTo(width - overlapWidth - width * 0.1, yPos);
      this.ctx.stroke();
    }

    // Thick filaments (myosin - blue)
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 6;
    for(let i = 0; i < 4; i++) {
      const yPos = height * (0.25 + i * 0.17);
      this.ctx.beginPath();
      this.ctx.moveTo(width / 2 - width * 0.2, yPos);
      this.ctx.lineTo(width / 2 + width * 0.2, yPos);
      this.ctx.stroke();

      // Myosin heads
      this.ctx.fillStyle = '#2980B9';
      for(let j = 0; j < 6; j++) {
        const headX = width / 2 - width * 0.15 + j * width * 0.06;
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(headX, yPos + 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Labels
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Z', 0, -5);
    this.ctx.fillText('Z', width, -5);
    this.ctx.fillText('M', width / 2, -5);

    this.ctx.restore();
  }

  // ============================================================================
  // CELLULAR & MICROSCOPIC DIAGRAMS
  // ============================================================================

  renderCellDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, type = 'generic' } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Animal Cell Structure', width / 2, -20);

    // Draw cell
    const cellSize = Math.min(width, height) * 0.4;
    AnatomicalShapes.drawCell(this.ctx, width / 2, height / 2, cellSize, type);

    if(showLabels) {
      // Cell membrane
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.75, height * 0.35);
      this.ctx.lineTo(width * 0.9, height * 0.3);
      this.ctx.stroke();
      this.addLabel('Cell Membrane', width * 0.92, height * 0.28, '#2C3E50', 'left');

      // Nucleus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.45);
      this.ctx.lineTo(width * 0.7, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nucleus', width * 0.72, height * 0.13, '#2C3E50', 'left');

      // Mitochondria
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.6);
      this.ctx.lineTo(width * 0.1, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Mitochondrion', width * 0.02, height * 0.58, '#2C3E50', 'left');

      // Endoplasmic reticulum
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.65, height * 0.65);
      this.ctx.lineTo(width * 0.9, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Endoplasmic\nReticulum', width * 0.92, height * 0.68, '#2C3E50', 'left');

      // Golgi apparatus
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.3, height * 0.7);
      this.ctx.lineTo(width * 0.1, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Golgi Apparatus', width * 0.02, height * 0.78, '#2C3E50', 'left');
    }

    this.ctx.restore();
  }

  renderBloodCellsDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Blood Cells', width / 2, -20);

    const cellSpacing = width * 0.2;
    const startX = width * 0.15;
    const cellY = height * 0.4;

    // Red Blood Cell
    AnatomicalShapes.drawRedBloodCell(this.ctx, startX, cellY, 25);
    if(showLabels) {
      this.addLabel('Red Blood Cell\n(Erythrocyte)', startX, cellY + 50, '#E74C3C');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Carries oxygen', startX, cellY + 75);
    }

    // White Blood Cells
    const wbcTypes = ['neutrophil', 'lymphocyte', 'monocyte'];
    const wbcNames = ['Neutrophil', 'Lymphocyte', 'Monocyte'];
    
    for(let i = 0; i < 3; i++) {
      const cellX = startX + (i + 1) * cellSpacing;
      AnatomicalShapes.drawWhiteBloodCell(this.ctx, cellX, cellY, 25, wbcTypes[i]);
      if(showLabels) {
        this.addLabel(`${wbcNames[i]}\n(White Blood Cell)`, cellX, cellY + 50, '#D0D0F8');
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.textAlign = 'center';
        const functions = ['Fights bacteria', 'Immune response', 'Phagocytosis'];
        this.ctx.fillText(functions[i], cellX, cellY + 75);
      }
    }

    // Platelets
    for(let i = 0; i < 5; i++) {
      const px = width * (0.3 + i * 0.08);
      const py = height * 0.8;
      AnatomicalShapes.drawPlatelet(this.ctx, px, py, 8);
    }
    if(showLabels) {
      this.addLabel('Platelets\n(Thrombocytes)', width * 0.5, height * 0.85, '#DDA0DD');
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Blood clotting', width * 0.5, height * 0.92);
    }

    this.ctx.restore();
  }

  renderDNADiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('DNA Double Helix', width / 2, -20);

    // Draw DNA
    AnatomicalShapes.drawDNA(this.ctx, 0, 0, width, height);

    if(showLabels) {
      // Sugar-phosphate backbone
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.25, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.2);
      this.ctx.stroke();
      this.addLabel('Sugar-Phosphate\nBackbone', width * 0.02, height * 0.18, '#4169E1', 'left');

      // Base pairs
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.7, height * 0.4);
      this.ctx.stroke();
      this.addLabel('Base Pairs', width * 0.72, height * 0.38, '#808080', 'left');

      // Base pair legend
      this.drawLegend(width * 0.65, height * 0.65, [
        { color: '#FF6B6B', label: 'Adenine (A)' },
        { color: '#4ECDC4', label: 'Thymine (T)' },
        { color: '#FFD93D', label: 'Guanine (G)' },
        { color: '#95E1D3', label: 'Cytosine (C)' }
      ]);

      // Complementary base pairing note
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('A pairs with T', width * 0.65, height * 0.55);
      this.ctx.fillText('G pairs with C', width * 0.65, height * 0.58);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // INTEGUMENTARY SYSTEM (SKIN) DIAGRAMS
  // ============================================================================

  renderSkinDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Skin Structure (Cross-Section)', width / 2, -20);

    // Draw skin
    AnatomicalShapes.drawSkin(this.ctx, 0, 0, width, height, 'cross-section');

    if(showLabels) {
      // Layer labels
      this.addLabel('Epidermis', width * 0.85, height * 0.08, '#F5D0C5', 'left');
      this.addLabel('Dermis', width * 0.85, height * 0.45, '#E8B4A8', 'left');
      this.addLabel('Hypodermis\n(Subcutaneous)', width * 0.85, height * 0.85, '#FFE4B5', 'left');

      // Structure labels
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      
      // Hair follicle
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.32, height * 0.3);
      this.ctx.lineTo(width * 0.15, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Hair Follicle', width * 0.02, height * 0.23, '#8B4513', 'left');

      // Sebaceous gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.36, height * 0.22);
      this.ctx.lineTo(width * 0.45, height * 0.18);
      this.ctx.stroke();
      this.addLabel('Oil Gland', width * 0.47, height * 0.16, '#F0E68C', 'left');

      // Sweat gland
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.7, height * 0.6);
      this.ctx.lineTo(width * 0.8, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Sweat Gland', width * 0.82, height * 0.58, '#87CEEB', 'left');

      // Blood vessels
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.4);
      this.ctx.lineTo(width * 0.6, height * 0.35);
      this.ctx.stroke();
      this.addLabel('Blood Vessels', width * 0.62, height * 0.33, '#E74C3C', 'left');

      // Nerve endings
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.2, height * 0.2);
      this.ctx.lineTo(width * 0.1, height * 0.15);
      this.ctx.stroke();
      this.addLabel('Nerve Endings', width * 0.02, height * 0.13, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // URINARY SYSTEM DIAGRAMS
  // ============================================================================

  renderUrinarySystemDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Urinary System', width / 2, -20);

    // Kidneys
    const kidneyWidth = width * 0.2;
    const kidneyHeight = height * 0.35;
    AnatomicalShapes.drawKidney(this.ctx, width * 0.15, height * 0.15, kidneyWidth, kidneyHeight, 'left');
    AnatomicalShapes.drawKidney(this.ctx, width * 0.65, height * 0.15, kidneyWidth, kidneyHeight, 'right');

    // Bladder
    const bladderWidth = width * 0.25;
    const bladderHeight = height * 0.3;
    AnatomicalShapes.drawBladder(this.ctx, width * 0.375, height * 0.6, bladderWidth, bladderHeight, 0.6);

    // Ureters connecting kidneys to bladder
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 4;
    // Left ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.32, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.35, height * 0.55, width * 0.42, height * 0.65);
    this.ctx.stroke();
    // Right ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.48);
    this.ctx.quadraticCurveTo(width * 0.65, height * 0.55, width * 0.58, height * 0.65);
    this.ctx.stroke();

    // Urethra
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.5, height * 0.9);
    this.ctx.lineTo(width * 0.5, height * 0.98);
    this.ctx.stroke();

    if(showLabels) {
      this.addLabel('Kidneys', width * 0.5, height * 0.08, '#8B0000');
      this.addLabel('Ureters', width * 0.38, height * 0.55, '#FFD700');
      this.addLabel('Bladder', width * 0.5, height * 0.58, '#FFD700');
      this.addLabel('Urethra', width * 0.55, height * 0.94, '#FFD700');

      // Function notes
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#7F8C8D';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Filters blood', width * 0.25, height * 0.52);
      this.ctx.fillText('Stores urine', width * 0.5, height * 0.95);
    }

    this.ctx.restore();
  }

  renderKidneyDetailDiagram(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Kidney Internal Structure', width / 2, -20);

    // Draw kidney
    AnatomicalShapes.drawKidney(this.ctx, width * 0.2, height * 0.1, width * 0.6, height * 0.8, 'left');

    // Labels with leader lines
    this.ctx.strokeStyle = '#2C3E50';
    this.ctx.lineWidth = 1;

    // Renal cortex
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.35, height * 0.3);
    this.ctx.lineTo(width * 0.15, height * 0.25);
    this.ctx.stroke();
    this.addLabel('Renal Cortex', width * 0.02, height * 0.23, '#A52A2A', 'left');

    // Renal medulla
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.45, height * 0.45);
    this.ctx.lineTo(width * 0.15, height * 0.45);
    this.ctx.stroke();
    this.addLabel('Renal Medulla\n(Pyramids)', width * 0.02, height * 0.43, '#8B0000', 'left');

    // Renal pelvis
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.65, height * 0.5);
    this.ctx.lineTo(width * 0.85, height * 0.5);
    this.ctx.stroke();
    this.addLabel('Renal Pelvis', width * 0.87, height * 0.48, '#FFD700', 'left');

    // Ureter
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.68, height * 0.75);
    this.ctx.lineTo(width * 0.85, height * 0.8);
    this.ctx.stroke();
    this.addLabel('Ureter', width * 0.87, height * 0.78, '#FFD700', 'left');

    // Renal artery
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.42);
    this.ctx.lineTo(width * 0.85, height * 0.35);
    this.ctx.stroke();
    this.addLabel('Renal Artery', width * 0.87, height * 0.33, '#E74C3C', 'left');

    // Renal vein
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.7, height * 0.58);
    this.ctx.lineTo(width * 0.85, height * 0.65);
    this.ctx.stroke();
    this.addLabel('Renal Vein', width * 0.87, height * 0.63, '#8B4789', 'left');

    // Nephron inset
    this.drawNephronInset(width * 0.02, height * 0.55, width * 0.3, height * 0.4);

    this.ctx.restore();
  }

  drawNephronInset(x, y, width, height) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Border
    this.ctx.strokeStyle = '#34495E';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = '#ECF0F1';
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // Title
    this.ctx.font = 'bold 11px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Nephron (Functional Unit)', width / 2, 12);

    // Glomerulus (ball of capillaries)
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.strokeStyle = '#C0392B';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.08, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Bowman's capsule
    this.ctx.strokeStyle = '#3498DB';
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(width * 0.3, height * 0.25, width * 0.12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Proximal convoluted tubule
    this.ctx.strokeStyle = '#F39C12';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.42, height * 0.25);
    for(let i = 0; i < 3; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 + i * 0.05), height * (0.3 + i * 0.03),
        width * (0.5 + i * 0.05), height * (0.35 + i * 0.03),
        width * (0.52 + i * 0.05), height * (0.37 + i * 0.03)
      );
    }
    this.ctx.stroke();

    // Loop of Henle
    this.ctx.strokeStyle = '#9B59B6';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.67, height * 0.46);
    this.ctx.lineTo(width * 0.7, height * 0.65);
    this.ctx.lineTo(width * 0.6, height * 0.65);
    this.ctx.lineTo(width * 0.57, height * 0.46);
    this.ctx.stroke();

    // Distal convoluted tubule
    this.ctx.strokeStyle = '#1ABC9C';
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.57, height * 0.46);
    for(let i = 0; i < 2; i++) {
      this.ctx.bezierCurveTo(
        width * (0.5 - i * 0.08), height * (0.5 + i * 0.05),
        width * (0.5 - i * 0.08), height * (0.55 + i * 0.05),
        width * (0.45 - i * 0.08), height * (0.58 + i * 0.05)
      );
    }
    this.ctx.stroke();

    // Collecting duct
    this.ctx.strokeStyle = '#E67E22';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(width * 0.29, height * 0.68);
    this.ctx.lineTo(width * 0.29, height * 0.9);
    this.ctx.stroke();

    // Labels
    this.ctx.font = '8px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Glomerulus', width * 0.3, height * 0.15);
    this.ctx.fillText('Loop of Henle', width * 0.63, height * 0.75);
    this.ctx.fillText('Collecting\nDuct', width * 0.29, height * 0.95);

    this.ctx.restore();
  }

  // ============================================================================
  // SENSORY ORGAN DIAGRAMS
  // ============================================================================

  renderEyeDiagram(x, y, width, height, options = {}) {
    const { showLabels = true, pupilDilation = 0.3 } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Human Eye Anatomy', width / 2, -20);

    // Draw eye
    AnatomicalShapes.drawEye(this.ctx, width * 0.2, height * 0.2, width * 0.6, height * 0.6, pupilDilation);

    if(showLabels) {
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;

      // Cornea
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.55, height * 0.35);
      this.ctx.lineTo(width * 0.7, height * 0.25);
      this.ctx.stroke();
      this.addLabel('Cornea', width * 0.72, height * 0.23, '#2C3E50', 'left');

      // Iris
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.6, height * 0.5);
      this.ctx.lineTo(width * 0.8, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Iris', width * 0.82, height * 0.48, '#8B7355', 'left');

      // Pupil
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.5);
      this.ctx.lineTo(width * 0.3, height * 0.5);
      this.ctx.stroke();
      this.addLabel('Pupil', width * 0.02, height * 0.48, '#000000', 'left');

      // Lens
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.53, height * 0.6);
      this.ctx.lineTo(width * 0.7, height * 0.7);
      this.ctx.stroke();
      this.addLabel('Lens', width * 0.72, height * 0.68, '#2C3E50', 'left');

      // Retina
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.73, height * 0.55);
      this.ctx.lineTo(width * 0.85, height * 0.6);
      this.ctx.stroke();
      this.addLabel('Retina', width * 0.87, height * 0.58, '#2C3E50', 'left');

      // Optic nerve
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.6);
      this.ctx.lineTo(width * 0.5, height * 0.85);
      this.ctx.stroke();
      
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(width * 0.5, height * 0.75);
      this.ctx.lineTo(width * 0.3, height * 0.8);
      this.ctx.stroke();
      this.addLabel('Optic Nerve', width * 0.02, height * 0.78, '#FFD700', 'left');
    }

    this.ctx.restore();
  }

  // ============================================================================
  // VALVE DIAGRAMS
  // ============================================================================

  renderHeartValvesDiagram(x, y, width, height, options = {}) {
    const { showLabels = true } = options;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Title
    this.ctx.font = 'bold 22px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Heart Valves', width / 2, -20);

    const valveSize = width * 0.18;
    const spacing = width * 0.25;

    // Atrioventricular valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('AV Valves', width * 0.25, height * 0.15);

    // Tricuspid valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'atrioventricular',
      'closed'
    );
    this.addLabel('Tricuspid\n(Closed)', width * 0.17, height * 0.48, '#2C3E50');

    // Mitral valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.08 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'mitral',
      'open'
    );
    this.addLabel('Mitral\n(Open)', width * 0.17 + spacing, height * 0.48, '#2C3E50');

    // Semilunar valves
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = '#2C3E50';
    this.ctx.fillText('Semilunar Valves', width * 0.75, height * 0.15);

    // Pulmonary valve (open)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'open'
    );
    this.addLabel('Pulmonary\n(Open)', width * 0.67, height * 0.48, '#2C3E50');

    // Aortic valve (closed)
    AnatomicalShapes.drawValve(
      this.ctx,
      width * 0.58 + spacing,
      height * 0.2,
      valveSize,
      valveSize * 1.2,
      'semilunar',
      'closed'
    );
    this.addLabel('Aortic\n(Closed)', width * 0.67 + spacing, height * 0.48, '#2C3E50');

    // Function description
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7F8C8D';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Prevent backflow of blood through the heart', width / 2, height * 0.6);

    if(showLabels) {
      // Legend
      this.drawLegend(width * 0.3, height * 0.7, [
        { color: '#F5F5DC', label: 'Valve Leaflets' },
        { color: '#CD853F', label: 'Chordae Tendineae' },
        { color: '#DC143C', label: 'Papillary Muscle' }
      ]);
    }

    this.ctx.restore();
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  addLabel(text, x, y, color = '#2C3E50', align = 'center') {
    this.ctx.font = 'bold 13px Arial';
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      this.ctx.fillText(line, x, y + index * 15);
    });
  }

  drawArrow(x1, y1, x2, y2, color, label = '', arrowSize = 8) {
    this.ctx.save();
    
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 2;

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - arrowSize * Math.cos(angle - Math.PI / 6),
      y2 - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - arrowSize * Math.cos(angle + Math.PI / 6),
      y2 - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    if(label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, midX, midY - 5);
    }

    this.ctx.restore();
  }

  drawCurvedArrow(x1, y1, x2, y2, color, label = '') {
    this.ctx.save();
    
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 3;

    // Calculate control point for curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const ctrlX = midX - dy * 0.3;
    const ctrlY = midY + dx * 0.3;

    // Draw curved line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    this.ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(y2 - ctrlY, x2 - ctrlX);
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - 10 * Math.cos(angle - Math.PI / 6),
      y2 - 10 * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - 10 * Math.cos(angle + Math.PI / 6),
      y2 - 10 * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    if(label) {
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, ctrlX, ctrlY - 5);
    }

    this.ctx.restore();
  }

  drawLegend(x, y, items) {
    this.ctx.save();
    this.ctx.translate(x, y);

    const boxSize = 12;
    const spacing = 20;

    items.forEach((item, index) => {
      const yPos = index * spacing;

      // Color box
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(0, yPos, boxSize, boxSize);
      this.ctx.strokeStyle = '#2C3E50';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(0, yPos, boxSize, boxSize);

      // Label
      this.ctx.font = '11px Arial';
      this.ctx.fillStyle = '#2C3E50';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(item.label, boxSize + 5, yPos + boxSize - 2);
    });

    this.ctx.restore();
  }

  // ============================================================================
  // ANIMATION & RENDERING
  // ============================================================================

  animate() {
    this.currentFrame++;
    requestAnimationFrame(() => this.animate());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveAsPNG(filename = 'anatomical-diagram.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// ============================================================================
// ANATOMICAL DIAGRAMS REGISTRY - Comprehensive Anatomy Configuration System
// ============================================================================

class AnatomicalDiagramsRegistry {
    static diagrams = {
        // ===== CARDIOVASCULAR SYSTEM =====
        'heartAnatomy': {
            name: 'Heart Anatomy',
            category: 'Cardiovascular System',
            description: 'Complete heart structure with chambers and blood flow',
            dataRequired: ['chamber'],
            usage: 'Best for showing heart structure and chamber details',
            examples: ['Medical education', 'Patient briefings', 'Anatomy studies'],
            chamberOptions: ['wholeheart', 'rightAtrium', 'rightVentricle', 'leftAtrium', 'leftVentricle'],
            defaultOptions: {
                title: 'Heart Anatomy',
                chamber: 'wholeheart',
                showLabels: true,
                showBloodFlow: true,
                animate: false,
                width: 600,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        'circulatorySystem': {
            name: 'Circulatory System',
            category: 'Cardiovascular System',
            description: 'Complete blood circulation pathway through body',
            dataRequired: [],
            usage: 'Best for showing systemic and pulmonary circulation',
            examples: ['Blood flow education', 'Circulatory teaching', 'Medical diagrams'],
            defaultOptions: {
                title: 'Circulatory System',
                showLabels: true,
                showOxygenation: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodVesselComparison': {
            name: 'Blood Vessel Comparison',
            category: 'Cardiovascular System',
            description: 'Comparison of arteries, veins, and capillaries',
            dataRequired: [],
            usage: 'Best for comparing vessel structures',
            examples: ['Vessel anatomy', 'Blood transport', 'Vascular system'],
            defaultOptions: {
                title: 'Blood Vessel Comparison',
                showLabels: true,
                width: 700,
                height: 400,
                backgroundColor: '#ffffff'
            }
        },

        'heartValves': {
            name: 'Heart Valves',
            category: 'Cardiovascular System',
            description: 'All four heart valves showing structure and function',
            dataRequired: [],
            usage: 'Best for showing valve anatomy and operation',
            examples: ['Valve disorders', 'Cardiac anatomy', 'Heart function'],
            defaultOptions: {
                title: 'Heart Valves',
                showLabels: true,
                width: 800,
                height: 500,
                backgroundColor: '#ffffff'
            }
        },

        // ===== RESPIRATORY SYSTEM =====
        'respiratorySystem': {
            name: 'Respiratory System',
            category: 'Respiratory System',
            description: 'Complete respiratory tract with gas exchange',
            dataRequired: [],
            usage: 'Best for showing breathing anatomy',
            examples: ['Lung function', 'Breathing education', 'Respiratory health'],
            defaultOptions: {
                title: 'Respiratory System',
                showLabels: true,
                showGasExchange: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== DIGESTIVE SYSTEM =====
        'digestiveSystem': {
            name: 'Digestive System',
            category: 'Digestive System',
            description: 'Complete digestive tract from mouth to intestines',
            dataRequired: [],
            usage: 'Best for showing digestion pathway',
            examples: ['Digestive health', 'Nutrition education', 'GI tract'],
            defaultOptions: {
                title: 'Digestive System',
                showLabels: true,
                showPath: true,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'digestiveOrgans': {
            name: 'Digestive Organs',
            category: 'Digestive System',
            description: 'Individual digestive organs with functions',
            dataRequired: [],
            usage: 'Best for comparing digestive organ structures',
            examples: ['Organ functions', 'Digestive process', 'Anatomy education'],
            defaultOptions: {
                title: 'Digestive Organs',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== NERVOUS SYSTEM =====
        'nervousSystem': {
            name: 'Nervous System',
            category: 'Nervous System',
            description: 'Central nervous system with brain and spinal cord',
            dataRequired: [],
            usage: 'Best for showing neural pathways',
            examples: ['Neurology', 'Brain structure', 'Nerve signals'],
            defaultOptions: {
                title: 'Central Nervous System',
                showLabels: true,
                showSignal: false,
                width: 600,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'neuronStructure': {
            name: 'Neuron Structure',
            category: 'Nervous System',
            description: 'Detailed neuron anatomy with all components',
            dataRequired: [],
            usage: 'Best for showing nerve cell structure',
            examples: ['Cellular neurology', 'Signal transmission', 'Neural anatomy'],
            defaultOptions: {
                title: 'Neuron Structure',
                showLabels: true,
                showSignal: false,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== SKELETAL SYSTEM =====
        'skull': {
            name: 'Human Skull',
            category: 'Skeletal System',
            description: 'Skull anatomy with cranium and facial bones',
            dataRequired: [],
            usage: 'Best for cranial anatomy education',
            examples: ['Skull anatomy', 'Cranial structure', 'Head bones'],
            defaultOptions: {
                title: 'Human Skull',
                bone: 'skull',
                showLabels: true,
                width: 500,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'femur': {
            name: 'Femur',
            category: 'Skeletal System',
            description: 'Thigh bone structure and features',
            dataRequired: [],
            usage: 'Best for long bone anatomy',
            examples: ['Bone structure', 'Orthopedics', 'Skeletal anatomy'],
            defaultOptions: {
                title: 'Femur (Thigh Bone)',
                bone: 'femur',
                showLabels: true,
                width: 400,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'ribcage': {
            name: 'Ribcage',
            category: 'Skeletal System',
            description: 'Thoracic cage with ribs and sternum',
            dataRequired: [],
            usage: 'Best for thoracic anatomy',
            examples: ['Chest structure', 'Rib anatomy', 'Thoracic cage'],
            defaultOptions: {
                title: 'Ribcage',
                bone: 'ribcage',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'spine': {
            name: 'Vertebral Column',
            category: 'Skeletal System',
            description: 'Spine with vertebrae and spinal cord',
            dataRequired: [],
            usage: 'Best for spinal anatomy',
            examples: ['Back pain education', 'Spinal structure', 'Vertebrae'],
            defaultOptions: {
                title: 'Vertebral Column',
                bone: 'spine',
                showLabels: true,
                width: 400,
                height: 800,
                backgroundColor: '#ffffff'
            }
        },

        'boneStructure': {
            name: 'Bone Structure',
            category: 'Skeletal System',
            description: 'Cross-section showing internal bone anatomy',
            dataRequired: [],
            usage: 'Best for showing bone composition',
            examples: ['Bone health', 'Osteoporosis education', 'Bone anatomy'],
            defaultOptions: {
                title: 'Bone Structure (Cross-Section)',
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== MUSCULAR SYSTEM =====
        'skeletalMuscle': {
            name: 'Skeletal Muscle',
            category: 'Muscular System',
            description: 'Voluntary muscle structure with fibers',
            dataRequired: [],
            usage: 'Best for muscle anatomy education',
            examples: ['Muscle structure', 'Exercise physiology', 'Athletic training'],
            defaultOptions: {
                title: 'Skeletal Muscle',
                type: 'skeletal',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'muscleContraction': {
            name: 'Muscle Contraction',
            category: 'Muscular System',
            description: 'Sliding filament model of muscle contraction',
            dataRequired: [],
            usage: 'Best for showing muscle mechanics',
            examples: ['Exercise science', 'Physiology', 'Muscle function'],
            defaultOptions: {
                title: 'Muscle Contraction (Sliding Filament)',
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== CELLULAR & MICROSCOPIC =====
        'cellStructure': {
            name: 'Animal Cell',
            category: 'Cellular & Microscopic',
            description: 'Complete cell with organelles',
            dataRequired: [],
            usage: 'Best for cell biology education',
            examples: ['Cell biology', 'Organelles', 'Cellular anatomy'],
            defaultOptions: {
                title: 'Animal Cell Structure',
                type: 'generic',
                showLabels: true,
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'bloodCells': {
            name: 'Blood Cells',
            category: 'Cellular & Microscopic',
            description: 'Red blood cells, white blood cells, and platelets',
            dataRequired: [],
            usage: 'Best for hematology education',
            examples: ['Blood composition', 'Immune system', 'Hematology'],
            defaultOptions: {
                title: 'Blood Cells',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        'dnaStructure': {
            name: 'DNA Double Helix',
            category: 'Cellular & Microscopic',
            description: 'DNA structure with base pairs',
            dataRequired: [],
            usage: 'Best for genetics education',
            examples: ['Genetics', 'Molecular biology', 'DNA structure'],
            defaultOptions: {
                title: 'DNA Double Helix',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== INTEGUMENTARY SYSTEM =====
        'skinStructure': {
            name: 'Skin Layers',
            category: 'Integumentary System',
            description: 'Cross-section showing all skin layers',
            dataRequired: [],
            usage: 'Best for dermatology education',
            examples: ['Skin anatomy', 'Dermatology', 'Wound healing'],
            defaultOptions: {
                title: 'Skin Structure (Cross-Section)',
                showLabels: true,
                width: 800,
                height: 600,
                backgroundColor: '#ffffff'
            }
        },

        // ===== URINARY SYSTEM =====
        'urinarySystem': {
            name: 'Urinary System',
            category: 'Urinary System',
            description: 'Kidneys, bladder, and urinary tract',
            dataRequired: [],
            usage: 'Best for renal anatomy',
            examples: ['Kidney function', 'Urinary health', 'Renal anatomy'],
            defaultOptions: {
                title: 'Urinary System',
                showLabels: true,
                width: 600,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        'kidneyDetail': {
            name: 'Kidney Internal Structure',
            category: 'Urinary System',
            description: 'Detailed kidney anatomy with nephron',
            dataRequired: [],
            usage: 'Best for renal physiology',
            examples: ['Kidney function', 'Filtration process', 'Nephron anatomy'],
            defaultOptions: {
                title: 'Kidney Internal Structure',
                width: 700,
                height: 700,
                backgroundColor: '#ffffff'
            }
        },

        // ===== SENSORY ORGANS =====
        'eyeAnatomy': {
            name: 'Eye Anatomy',
            category: 'Sensory Organs',
            description: 'Complete eye structure with all components',
            dataRequired: [],
            usage: 'Best for ophthalmology education',
            examples: ['Vision anatomy', 'Eye structure', 'Ophthalmology'],
            defaultOptions: {
                title: 'Human Eye Anatomy',
                showLabels: true,
                pupilDilation: 0.3,
                width: 700,
                height: 600,
                backgroundColor: '#ffffff'
            }
        }
    };

    static getDiagram(key) {
        return this.diagrams[key];
    }

    static getAllDiagrams() {
        return Object.keys(this.diagrams);
    }

    static getDiagramsByCategory(category) {
        return Object.entries(this.diagrams)
            .filter(([_, diagram]) => diagram.category === category)
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getAllCategories() {
        return [...new Set(Object.values(this.diagrams).map(d => d.category))];
    }

    static searchDiagrams(query) {
        const lowerQuery = query.toLowerCase();
        return Object.entries(this.diagrams)
            .filter(([key, diagram]) =>
                diagram.name.toLowerCase().includes(lowerQuery) ||
                diagram.description.toLowerCase().includes(lowerQuery) ||
                diagram.category.toLowerCase().includes(lowerQuery) ||
                key.toLowerCase().includes(lowerQuery)
            )
            .reduce((acc, [key, diagram]) => {
                acc[key] = diagram;
                return acc;
            }, {});
    }

    static getDiagramStats() {
        const stats = {};
        this.getAllCategories().forEach(category => {
            const diagrams = this.getDiagramsByCategory(category);
            stats[category] = {
                count: Object.keys(diagrams).length,
                diagrams: Object.keys(diagrams)
            };
        });
        return stats;
    }
}


export { AnatomicalDiagramsRegistry,AnatomicalShapes,AnatomicalDiagramRenderer};


// ============================================================================
// ADD THIS TO EnhancedSpreadsheetWorkbook CLASS
/**
export class EnhancedSpreadsheetWorkbook {
    constructor(options = {}) {
        this.width = options.width || 1600;
        this.height = options.height || 2000;
        this.theme = options.theme || 'professional';

        // Spreadsheet data
        this.data = [];
        this.headers = [];
        this.formulas = {};
        this.calculations = {};
        this.history = [];

        // Chart management
        this.charts = [];
        this.chartRenderer = new ChartCanvasRenderer();

        // Anatomical diagram management
        this.anatomicalDiagrams = [];
        this.diagramRenderer = new AnatomicalDiagramRenderer(null);

        // Cross-section diagram management
        this.crossSectionDiagrams = [];
        this.crossSectionRenderer = new CrossSectionDiagramRenderer(null);

        // Stereochemistry diagram management
        this.stereochemistryDiagrams = [];
        this.stereochemistryRenderer = new StereochemistryDiagramRenderer(null);

        // Graphing Calculator management
        this.graphingCalculator = null;

        // Statistical Workbook management
        this.statisticalWorkbook = null;
        this.statisticalAnalyses = [];

        // Unified diagram tracking (for convenience)
        this.allDiagrams = {
            anatomical: this.anatomicalDiagrams,
            crossSection: this.crossSectionDiagrams,
            stereochemistry: this.stereochemistryDiagrams
        };

        // Visual settings
        this.cellWidth = 150;
        this.cellHeight = 30;
        this.headerHeight = 35;
        this.fontSize = 11;
        this.headerFontSize = 12;

        // Metadata
        this.sheetName = options.sheetName || 'Sheet1';
        this.createdDate = new Date();
        this.lastModified = new Date();
        this.author = options.author || 'User';

        this.setThemeColors();
    }

    // ==================== THEME COLORS ====================
    setThemeColors() {
        const themes = {
            professional: {
                background: '#ffffff',
                gridColor: '#e0e0e0',
                headerBg: '#2c3e50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#c0c0c0'
            },
            dark: {
                background: '#1e1e1e',
                gridColor: '#404040',
                headerBg: '#0d47a1',
                headerText: '#ffffff',
                cellBg: '#2d2d2d',
                cellText: '#ffffff',
                borderColor: '#505050'
            },
            light: {
                background: '#f5f5f5',
                gridColor: '#d0d0d0',
                headerBg: '#4caf50',
                headerText: '#ffffff',
                cellBg: '#ffffff',
                cellText: '#000000',
                borderColor: '#bdbdbd'
            }
        };
        this.colors = themes[this.theme] || themes.professional;
    }

     


       // ========================================================================
    // ANATOMICAL DIAGRAM MANAGEMENT METHODS
    // ========================================================================

    // Get available anatomical diagrams
    getAvailableAnatomicalDiagrams() {
        const diagrams = {};
        const categories = AnatomicalDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            diagrams[category] = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        });

        return diagrams;
    }

    // Get diagram suggestions based on context
    suggestAnatomicalDiagrams(context = null) {
        const suggestions = [];

        // Check headers for medical/anatomical keywords
        const hasCardiovascular = this.headers.some(h => 
            /heart|blood|artery|vein|circulation|cardiac/i.test(h)
        );
        
        const hasRespiratory = this.headers.some(h => 
            /lung|breath|respiratory|oxygen|co2/i.test(h)
        );
        
        const hasDigestive = this.headers.some(h => 
            /stomach|intestine|digest|food|nutrition/i.test(h)
        );

        const hasNervous = this.headers.some(h => 
            /brain|nerve|neural|neuron|spine/i.test(h)
        );

        const hasSkeletal = this.headers.some(h => 
            /bone|skeleton|skull|spine|fracture/i.test(h)
        );

        // Add suggestions based on context
        if (hasCardiovascular) {
            suggestions.push({
                key: 'heartAnatomy',
                priority: 10,
                reason: 'Cardiovascular data detected in headers'
            });
            suggestions.push({
                key: 'circulatorySystem',
                priority: 9,
                reason: 'Blood circulation context identified'
            });
        }

        if (hasRespiratory) {
            suggestions.push({
                key: 'respiratorySystem',
                priority: 10,
                reason: 'Respiratory data detected'
            });
        }

        if (hasDigestive) {
            suggestions.push({
                key: 'digestiveSystem',
                priority: 10,
                reason: 'Digestive system data detected'
            });
        }

        if (hasNervous) {
            suggestions.push({
                key: 'nervousSystem',
                priority: 10,
                reason: 'Nervous system data detected'
            });
            suggestions.push({
                key: 'neuronStructure',
                priority: 8,
                reason: 'Neural anatomy context'
            });
        }

        if (hasSkeletal) {
            suggestions.push({
                key: 'skull',
                priority: 9,
                reason: 'Skeletal data detected'
            });
            suggestions.push({
                key: 'boneStructure',
                priority: 8,
                reason: 'Bone anatomy context'
            });
        }

        // General suggestions if no specific context
        if (suggestions.length === 0) {
            suggestions.push(
                { key: 'heartAnatomy', priority: 7, reason: 'Popular anatomy diagram' },
                { key: 'cellStructure', priority: 6, reason: 'Fundamental biology' },
                { key: 'bloodCells', priority: 5, reason: 'Common medical reference' }
            );
        }

        return suggestions.sort((a, b) => b.priority - a.priority);
    }

    // Get diagram help
    getAnatomicalDiagramHelp(diagramKey) {
        const diagram = AnatomicalDiagramsRegistry.getDiagram(diagramKey);
        if (!diagram) {
            return { error: 'Diagram not found' };
        }

        return {
            name: diagram.name,
            category: diagram.category,
            description: diagram.description,
            usage: diagram.usage,
            examples: diagram.examples,
            dataRequired: diagram.dataRequired,
            defaultOptions: diagram.defaultOptions,
            chamberOptions: diagram.chamberOptions || null
        };
    }

    // Add anatomical diagram to workbook
    addAnatomicalDiagram(diagramConfig) {
        const {
            key,
            title = null,
            options = {},
            filename = null
        } = diagramConfig;

        // Validate diagram exists
        const diagram = AnatomicalDiagramsRegistry.getDiagram(key);
        if (!diagram) {
            throw new Error(`Anatomical diagram '${key}' not found`);
        }

        // Merge options
        const mergedOptions = { ...diagram.defaultOptions, ...options };
        if (title) mergedOptions.title = title;

        // Store diagram config
        const diagramObj = {
            id: `diagram_${this.anatomicalDiagrams.length + 1}`,
            key,
            title: mergedOptions.title,
            options: mergedOptions,
            filename: filename || `${this.sheetName}_${key}_${Date.now()}.png`,
            createdAt: new Date(),
            category: diagram.category
        };

        this.anatomicalDiagrams.push(diagramObj);
        this.addToHistory(`Added anatomical diagram: ${diagram.name}`);

        return diagramObj;
    }

    // Render anatomical diagram to PNG
    renderAnatomicalDiagramToPNG(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const diagramConfig = this.anatomicalDiagrams[diagramIndex];
        
        
        const width = diagramConfig.options.width || 800;
        const height = diagramConfig.options.height || 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Update renderer's canvas
        this.diagramRenderer.canvas = canvas;
        this.diagramRenderer.ctx = ctx;

        // Render the appropriate diagram
        this.renderSpecificDiagram(diagramConfig.key, diagramConfig.options);

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diagramConfig.filename, buffer);

        return {
            id: diagramConfig.id,
            filename: diagramConfig.filename,
            size: buffer.length,
            category: diagramConfig.category
        };
    }

    // Helper method to render specific diagram types
    renderSpecificDiagram(key, options) {
        const x = 0;
        const y = 0;
        const width = options.width || 800;
        const height = options.height || 600;

        switch (key) {
            case 'heartAnatomy':
                this.diagramRenderer.renderHeartAnatomyDiagram(x, y, width, height, options);
                break;
            case 'circulatorySystem':
                this.diagramRenderer.renderCirculatorySystemDiagram(x, y, width, height, options);
                break;
            case 'bloodVesselComparison':
                this.diagramRenderer.renderBloodVesselComparison(x, y, width, height, options);
                break;
            case 'heartValves':
                this.diagramRenderer.renderHeartValvesDiagram(x, y, width, height, options);
                break;
            case 'respiratorySystem':
                this.diagramRenderer.renderRespiratorySystemDiagram(x, y, width, height, options);
                break;
            case 'digestiveSystem':
                this.diagramRenderer.renderDigestiveSystemDiagram(x, y, width, height, options);
                break;
            case 'digestiveOrgans':
                this.diagramRenderer.renderDigestiveOrganComparison(x, y, width, height);
                break;
            case 'nervousSystem':
                this.diagramRenderer.renderNervousSystemDiagram(x, y, width, height, options);
                break;
            case 'neuronStructure':
                this.diagramRenderer.renderNeuronDiagram(x, y, width, height, options);
                break;
            case 'skull':
            case 'femur':
            case 'ribcage':
            case 'spine':
                this.diagramRenderer.renderSkeletalSystemDiagram(x, y, width, height, options);
                break;
            case 'boneStructure':
                this.diagramRenderer.renderBoneStructureDiagram(x, y, width, height);
                break;
            case 'skeletalMuscle':
                this.diagramRenderer.renderMuscularSystemDiagram(x, y, width, height, options);
                break;
            case 'muscleContraction':
                this.diagramRenderer.renderMuscleContractionDiagram(x, y, width, height);
                break;
            case 'cellStructure':
                this.diagramRenderer.renderCellDiagram(x, y, width, height, options);
                break;
            case 'bloodCells':
                this.diagramRenderer.renderBloodCellsDiagram(x, y, width, height, options);
                break;
            case 'dnaStructure':
                this.diagramRenderer.renderDNADiagram(x, y, width, height, options);
                break;
            case 'skinStructure':
                this.diagramRenderer.renderSkinDiagram(x, y, width, height, options);
                break;
            case 'urinarySystem':
                this.diagramRenderer.renderUrinarySystemDiagram(x, y, width, height, options);
                break;
            case 'kidneyDetail':
                this.diagramRenderer.renderKidneyDetailDiagram(x, y, width, height);
                break;
            case 'eyeAnatomy':
                this.diagramRenderer.renderEyeDiagram(x, y, width, height, options);
                break;
            default:
                throw new Error(`Rendering for diagram '${key}' not implemented`);
        }
    }


    // Helper method for rendering specific anatomical diagrams
renderSpecificAnatomicalDiagram(key, options) {
    const x = 0;
    const y = 0;
    const width = options.width || 800;
    const height = options.height || 600;

    switch (key) {
        case 'heartAnatomy':
            this.diagramRenderer.renderHeartAnatomyDiagram(x, y, width, height, options);
            break;
        case 'circulatorySystem':
            this.diagramRenderer.renderCirculatorySystemDiagram(x, y, width, height, options);
            break;
        case 'bloodVesselComparison':
            this.diagramRenderer.renderBloodVesselComparison(x, y, width, height, options);
            break;
        case 'heartValves':
            this.diagramRenderer.renderHeartValvesDiagram(x, y, width, height, options);
            break;
        case 'respiratorySystem':
            this.diagramRenderer.renderRespiratorySystemDiagram(x, y, width, height, options);
            break;
        case 'digestiveSystem':
            this.diagramRenderer.renderDigestiveSystemDiagram(x, y, width, height, options);
            break;
        case 'digestiveOrgans':
            this.diagramRenderer.renderDigestiveOrganComparison(x, y, width, height);
            break;
        case 'nervousSystem':
            this.diagramRenderer.renderNervousSystemDiagram(x, y, width, height, options);
            break;
        case 'neuronStructure':
            this.diagramRenderer.renderNeuronDiagram(x, y, width, height, options);
            break;
        case 'skull':
        case 'femur':
        case 'ribcage':
        case 'spine':
            this.diagramRenderer.renderSkeletalSystemDiagram(x, y, width, height, options);
            break;
        case 'boneStructure':
            this.diagramRenderer.renderBoneStructureDiagram(x, y, width, height);
            break;
        case 'skeletalMuscle':
            this.diagramRenderer.renderMuscularSystemDiagram(x, y, width, height, options);
            break;
        case 'muscleContraction':
            this.diagramRenderer.renderMuscleContractionDiagram(x, y, width, height);
            break;
        case 'cellStructure':
            this.diagramRenderer.renderCellDiagram(x, y, width, height, options);
            break;
        case 'bloodCells':
            this.diagramRenderer.renderBloodCellsDiagram(x, y, width, height, options);
            break;
        case 'dnaStructure':
            this.diagramRenderer.renderDNADiagram(x, y, width, height, options);
            break;
        case 'skinStructure':
            this.diagramRenderer.renderSkinDiagram(x, y, width, height, options);
            break;
        case 'urinarySystem':
            this.diagramRenderer.renderUrinarySystemDiagram(x, y, width, height, options);
            break;
        case 'kidneyDetail':
            this.diagramRenderer.renderKidneyDetailDiagram(x, y, width, height);
            break;
        case 'eyeAnatomy':
            this.diagramRenderer.renderEyeDiagram(x, y, width, height, options);
            break;
        default:
            throw new Error(`Rendering for anatomical diagram '${key}' not implemented`);
    }
}



    // Render all anatomical diagrams
    renderAllAnatomicalDiagrams() {
        const results = [];

        this.anatomicalDiagrams.forEach((_, index) => {
            try {
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    index
                });
            }
        });

        return results;
    }

    // Get anatomical diagram statistics
    getAnatomicalDiagramStatistics() {
        const stats = AnatomicalDiagramsRegistry.getDiagramStats();
        return {
            totalDiagrams: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
            byCategory: stats,
            diagramsInWorkbook: this.anatomicalDiagrams.length
        };
    }

    // Search anatomical diagrams
    searchAnatomicalDiagrams(query) {
        return AnatomicalDiagramsRegistry.searchDiagrams(query);
    }

    // List all anatomical diagrams in workbook
    listAnatomicalDiagrams() {
        return this.anatomicalDiagrams.map((diagram, index) => ({
            index,
            id: diagram.id,
            name: diagram.title,
            type: AnatomicalDiagramsRegistry.getDiagram(diagram.key).name,
            category: diagram.category,
            filename: diagram.filename,
            created: diagram.createdAt
        }));
    }

    // Remove anatomical diagram
    removeAnatomicalDiagram(diagramIndex) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const removed = this.anatomicalDiagrams.splice(diagramIndex, 1);
        this.addToHistory(`Removed anatomical diagram: ${removed[0].title}`);
        return removed[0];
    }

    // Update anatomical diagram
    updateAnatomicalDiagram(diagramIndex, updates) {
        if (diagramIndex < 0 || diagramIndex >= this.anatomicalDiagrams.length) {
            throw new Error(`Diagram index ${diagramIndex} out of range`);
        }

        const diagram = this.anatomicalDiagrams[diagramIndex];
        
        if (updates.title) diagram.title = updates.title;
        if (updates.options) {
            diagram.options = { ...diagram.options, ...updates.options };
        }

        this.addToHistory(`Updated anatomical diagram: ${diagram.title}`);
        return diagram;
    }

    // Generate anatomical diagram guide
    generateAnatomicalDiagramGuide() {
        const guide = {
            title: 'Available Anatomical Diagrams',
            categories: {},
            totalDiagrams: 0,
            suggestions: []
        };

        const categories = AnatomicalDiagramsRegistry.getAllCategories();

        categories.forEach(category => {
            const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
            guide.categories[category] = Object.entries(diagrams).map(([key, diagram]) => ({
                key,
                name: diagram.name,
                description: diagram.description,
                usage: diagram.usage,
                examples: diagram.examples
            }));
            guide.totalDiagrams += Object.keys(diagrams).length;
        });

        // Add suggestions based on workbook context
        guide.suggestions = this.suggestAnatomicalDiagrams();

        return guide;
    }

    // Batch add anatomical diagrams by category
    addAnatomicalDiagramsByCategory(category, options = {}) {
        const diagrams = AnatomicalDiagramsRegistry.getDiagramsByCategory(category);
        const results = [];

        Object.keys(diagrams).forEach(key => {
            try {
                const result = this.addAnatomicalDiagram({
                    key,
                    options,
                    filename: `${this.sheetName}_${key}_${Date.now()}.png`
                });
                results.push(result);
            } catch (error) {
                results.push({ key, error: error.message });
            }
        });

        return results;
    }

    // Export anatomical diagrams to a folder
    exportAnatomicalDiagramsToFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const results = [];

        this.anatomicalDiagrams.forEach((diagram, index) => {
            try {
                const originalFilename = diagram.filename;
                diagram.filename = `${folderPath}/${diagram.filename}`;
                
                const result = this.renderAnatomicalDiagramToPNG(index);
                results.push(result);
                
                // Restore original filename
                diagram.filename = originalFilename;
            } catch (error) {
                results.push({
                    index,
                    error: error.message
                });
            }
        });

        return {
            folder: folderPath,
            results,
            totalExported: results.filter(r => !r.error).length
        };
    }

    // Generate combined report with charts and anatomical diagrams
    generateCombinedReport() {
        const baseReport = this.generateReport();
        
        return {
            ...baseReport,
            anatomicalDiagrams: this.listAnatomicalDiagrams(),
            anatomicalStats: this.getAnatomicalDiagramStatistics(),
            visualizations: {
                charts: this.charts.length,
                anatomicalDiagrams: this.anatomicalDiagrams.length,
                total: this.charts.length + this.anatomicalDiagrams.length
            }
        };
    }




// ============================================================================
// EXPORT REGISTRIES AND CLASSES
// ============================================================================

export { 
    AnatomicalDiagramsRegistry, 
    AnatomicalShapes,
    AnatomicalDiagramRenderer
};

*/
