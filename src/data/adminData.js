// Clean Real Cyber Cafe Workstations Setup (PC-01 to PC-10)
export const initialWorkstations = Array.from({ length: 10 }, (_, i) => ({
  id: `PC-${String(i + 1).padStart(2, '0')}`,
  status: "Available",
  user: "-",
  startTime: null,
  startEpoch: null,
  purpose: "-",
  hourlyRate: 40
}));

// Real Default Rates
export const defaultRates = [
  { label: "B/W Laser Print", key: "bwPrint", rate: 2, unit: "per page" },
  { label: "Color Laser Print", key: "colorPrint", rate: 10, unit: "per page" },
  { label: "Xerox Photocopy", key: "xerox", rate: 2, unit: "per side" },
  { label: "PC Internet Browsing", key: "pcHour", rate: 40, unit: "per hour" },
  { label: "A4 Lamination", key: "lamination", rate: 40, unit: "per sheet" },
  { label: "PVC Smart Card", key: "pvcCard", rate: 80, unit: "per card" },
  { label: "8 Passport Photos", key: "photos", rate: 60, unit: "8 photos" }
];