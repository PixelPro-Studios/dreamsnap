export interface Theme {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  promptTemplate: string;
  referenceImage?: string; // Optional reference image for style guidance
  themeImage?: string; // Image for theme selection display
  category?: string; // Theme category for filtering
  disabled?: boolean; // Whether theme is selectable
}

export interface Lead {
  id?: string;
  fullName: string;
  instagramHandle1?: string;
  instagramHandle2?: string;
  phoneNumber: string;
  countryCode: string;
  consentGiven: boolean;
  eventId?: string;
  themeSelected: string;
  wouldPayForProduct?: boolean;
  createdAt?: string;
}

export interface CaptureState {
  capturedPhotos: string[];
  selectedPhoto: string | null;
  selectedTheme: Theme | null;
  generatedImage: string | null;
  finalImage: string | null;
  leadData: Partial<Lead> | null;
}
