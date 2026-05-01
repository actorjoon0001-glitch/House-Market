export type ProjectStyle =
  | "modern"
  | "hanok"
  | "minimal"
  | "industrial"
  | "natural";

export type DesignRequirements = {
  totalAreaPyeong: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  style: ProjectStyle;
  budgetWon?: number;
  notes?: string;
};

export type Room = {
  id: string;
  name: string;
  /** meters, top-left origin */
  x: number;
  y: number;
  w: number;
  h: number;
  floor?: number;
};

export type Opening = {
  /** wall midpoint, meters */
  x: number;
  y: number;
  /** 0 = horizontal, 90 = vertical */
  rotation: number;
  width: number;
};

export type FloorPlan = {
  /** overall bounding box in meters */
  width: number;
  depth: number;
  totalAreaM2: number;
  rooms: Room[];
  doors?: Opening[];
  windows?: Opening[];
  notes?: string;
};

export type EstimateBreakdownItem = {
  label: string;
  amountWon: number;
};

export type Estimate = {
  totalWon: number;
  pyeongUnitWon: number;
  breakdown: EstimateBreakdownItem[];
  leadTimeDays: number;
  assumptions: string[];
};

export const PYEONG_TO_M2 = 3.305785;
