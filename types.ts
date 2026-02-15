export enum Resolution {
  P720 = '720p',
  P1080 = '1080p',
  P1440 = '1440p',
  P4K = '4K',
}

export enum FrameRate {
  FPS30 = 30,
  FPS60 = 60,
  FPS90 = 90,
  FPS120 = 120,
  FPS144 = 144,
}

export enum Codec {
  H264 = 'H.264',
  HEVC = 'HEVC (H.265)',
  AV1 = 'AV1',
}

export interface StreamSettings {
  resolution: string;
  frameRate: FrameRate;
  hdr: boolean;
  codec: Codec;
}

export interface CalculationResult {
  minBitrate: number;
  optimalBitrate: number;
  maxBitrate: number; // Point of diminishing returns
}

export type LanguageCode = 'en' | 'zh-TW' | 'ja' | 'de' | 'fr' | 'es' | 'ru';