export type Page =
  | 'dashboard'
  | 'my-fish'
  | 'water-parameters'
  | 'equipment'
  | 'feeding-plan'
  | 'maintenance'
  | 'disease-guide'
  | 'ai-analysis'
  | 'knowledge-base'
  | 'achievements'
  | 'reports'
  | 'settings';

export interface MenuItem {
  id: Page;
  name: string;
  icon: JSX.Element;
}

export interface AiDiagnosis {
  possible_diseases: {
    name: string;
    confidence: 'Yüksek' | 'Orta' | 'Düşük';
    symptoms_match: string[];
    description: string;
  }[];
  recommended_treatments: {
    treatment_name: string;
    steps: string[];
    medication_suggestion?: string;
  }[];
  preventative_actions: string[];
  disclaimer: string;
}

export interface AiImageAnalysis {
  title: string;
  description: string;
  details: {
    label: string;
    value: string;
  }[];
}

export interface KnowledgeBaseArticle {
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
}


// Multi-Aquarium Data Structures
export interface Fish {
  id: number;
  name: string;
  species: string;
  count: number;
  addedDate: string;
  notes?: string;
  imageUrl: string;
}

export interface WaterLog {
  id: number;
  date: string;
  temperature: number;
  ph: number;
  tds: number;
  no3: number;
  kh: number;
  gh: number;
}

export interface EquipmentItem {
    id: number;
    name: string;
    type: 'Filtre' | 'Isıtıcı' | 'Aydınlatma' | 'Hava Motoru';
    model: string;
    installDate: string;
    lastMaintenance: string;
    maintenanceIntervalDays: number; // in days
    isTurnedOn?: boolean; // For IoT simulation
}

export interface FeedingScheduleItem {
    id: number;
    time: string;
    foodType: string;
    amount: string;
    days: ('Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz')[];
}

export interface FoodStock {
    id: number;
    name: string;
    type: 'Pul Yem' | 'Canlı Yem' | 'Dondurulmuş Yem' | 'Granül Yem';
    remainingPercentage: number;
}

export interface MaintenanceLog {
    id: number;
    date: string;
    task: string;
    notes: string;
}

export interface UpcomingMaintenanceTask {
    id: number;
    task: string;
    dueDate: string;
}

export interface Expense {
    name: string;
    value: number;
}


export interface Aquarium {
    id: string;
    name: string;
    fish: Fish[];
    waterLogs: WaterLog[];
    equipment: EquipmentItem[];
    feedingSchedule: FeedingScheduleItem[];
    foodStock: FoodStock[];
    maintenanceLogs: MaintenanceLog[];
    upcomingMaintenance: UpcomingMaintenanceTask[];
    expenses: Expense[];
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
}
