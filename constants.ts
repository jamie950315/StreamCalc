import { Resolution, Codec, FrameRate } from './types';

// Base bitrate (Mbps) reference for 1080p 60fps H.264 without HDR
export const BASE_BITRATE_REF = 20; 

export const RESOLUTION_MULTIPLIERS: Record<Resolution, number> = {
  [Resolution.P720]: 0.5,
  [Resolution.P1080]: 1.0,
  [Resolution.P1440]: 1.7, // ~1.78x pixel count of 1080p
  [Resolution.P4K]: 4.0,   // 4x pixel count of 1080p
};

export const FRAMERATE_MULTIPLIERS: Record<FrameRate, number> = {
  [FrameRate.FPS30]: 0.6,
  [FrameRate.FPS60]: 1.0,
  [FrameRate.FPS90]: 1.4,
  [FrameRate.FPS120]: 1.8,
  [FrameRate.FPS144]: 2.0,
};

export const CODEC_EFFICIENCY: Record<Codec, number> = {
  [Codec.H264]: 1.0,
  [Codec.HEVC]: 0.65, // ~35% more efficient
  [Codec.AV1]: 0.60,  // ~40% more efficient
};

export const HDR_OVERHEAD = 1.15; // ~15% overhead for 10-bit color data