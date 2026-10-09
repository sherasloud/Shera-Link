export type NavigationTab = 
  | 'telemetry' 
  | 'mesh_map' 
  | 'vouchers' 
  | 'community' 
  | 'ai_ops';

export interface StarlinkTelemetry {
  dishModel: string;
  terminalState: 'ONLINE' | 'SEARCHING' | 'DEGRADED' | 'STANDBY';
  satelliteId: string;
  constellationTotalPassing: number;
  azimuthDeg: number;
  elevationDeg: number;
  downlinkCurrentMbps: number;
  downlinkPeakMbps: number;
  uplinkCurrentMbps: number;
  uplinkPeakMbps: number;
  pingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  snrDb: number;
  obstructionPercent: number;
  carrierFrequencyGhz: number;
  heaterStatus: 'OFF' | 'AUTO_IDLE' | 'MELTING_ACTIVE';
  uptimeSeconds: number;
  ipAddress: string;
  hardwareRevision: string;
}

export interface PowerTelemetry {
  solarGenerationWatts: number;
  solarDailyHarvestKwh: number;
  batterySocPercent: number;
  batteryVoltageVolts: number;
  batteryTempCelsius: number;
  totalSystemLoadWatts: number;
  batteryRuntimeHours: number;
  generatorStandby: boolean;
  mpptEfficiencyPercent: number;
}

export interface ConnectedDevice {
  id: string;
  deviceName: string;
  userType: 'Student' | 'Villager' | 'Doctor' | 'Merchant' | 'Teacher' | 'Farmer';
  macAddress: string;
  ipAddress: string;
  signalDbm: number;
  downloadRateKbps: number;
  uploadRateKbps: number;
  totalDataUsedMb: number;
  voucherPlan: string;
  connectedSinceMinutes: number;
}

export interface VillageNode {
  id: string;
  name: string;
  bengaliName: string;
  location: string;
  category: 'school' | 'clinic' | 'bazaar' | 'agriculture' | 'residential' | 'ghat';
  coordinates: { x: number; y: number }; // percentage on map (0-100)
  distanceMeters: number;
  radioFrequency: '5.8 GHz PtMP' | '2.4/5 GHz Dual Outdoor AP';
  signalRssiDbm: number;
  status: 'online' | 'degraded' | 'offline';
  qosPriority: 'critical' | 'high' | 'standard';
  maxBandwidthMbps: number;
  currentDownloadMbps: number;
  currentUploadMbps: number;
  connectedDevicesCount: number;
  hardware: string;
  activeDevices: ConnectedDevice[];
  notes: string;
}

export interface VoucherPlan {
  id: string;
  name: string;
  bengaliName: string;
  targetAudience: string;
  priceBDT: number;
  priceUSD: number;
  durationHours: number;
  durationLabel: string;
  dataQuotaGB: number | 'Unlimited';
  speedCapMbps: number;
  description: string;
  badge?: string;
  category: 'student' | 'haat_day' | 'family' | 'home_monthly' | 'clinic_free';
}

export interface ActiveSession {
  code: string;
  planName: string;
  deviceMac: string;
  userPhone: string;
  startTime: string;
  expiresInMinutes: number;
  totalMinutes: number;
  usedDataMb: number;
  totalDataMb: number; // 0 for unlimited
  status: 'active' | 'paused' | 'expired';
}

export interface TelemedicineConsult {
  id: string;
  patientName: string;
  villagePara: string;
  age: number;
  gender: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  status: 'in_call' | 'waiting' | 'completed';
  urgency: 'urgent' | 'routine';
  scheduledTime: string;
  vitals: {
    bp: string;
    pulse: number;
    oxygenSat: number;
    temp: string;
  };
  notes: string;
}

export interface AgriculturalCropPrice {
  crop: string;
  bengaliCrop: string;
  unit: string;
  todayHaatPriceBDT: number;
  yesterdayPriceBDT: number;
  trend: 'up' | 'down' | 'stable';
  districtCityPriceBDT: number;
}

export interface OfflineCacheItem {
  id: string;
  title: string;
  category: 'Primary Education' | 'Secondary Science' | 'Vocational Skills' | 'Agriculture Guide' | 'Health & Hygiene';
  sizeMb: number;
  language: string;
  downloadsCount: number;
  thumbnailIcon: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  bengaliTitle: string;
  category: 'Union Notice' | 'Weather & Flood' | 'Health Drive' | 'Network Maintenance';
  date: string;
  urgency: 'high' | 'normal';
  details: string;
}
