import {
  BusinessType,
  Gender,
  GoalType,
  TrainerSpecialty,
  Weekday,
  WorkoutTimePreference,
} from "../enums";

export interface ContactInfo {
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface SocialLink {
  name: string;
  link: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface ProfessionalInfo {
  specialties: TrainerSpecialty[];
  certifications: string[];
  yearsOfExperience: number;
  bio?: string;
  socialLinks?: SocialLink[];
  businessType: BusinessType;
  languages: string[];
  profilePhoto: string;
  gallery: string[];
}

export interface Availability {
  preferredTime: WorkoutTimePreference;
  checkIn: string;
  checkOut: string;
  daysAvailable: Weekday[];
  timezone: string;
}

export interface Transformations {
  clientName: string;
  timeline: string;
  beforeImages: string[];
  afterImages: string[];
  transformationGoal: GoalType;
  resultsAndAchievements: string[];
}

export interface Testimonials {
  clientName: string;
  profileImage: string;
  note: string;
}

export interface Trainer {
  _id: string;
  userId: string;

  isProfileCompleted: boolean;
  isSubscribed: boolean;

  gender: Gender;
  dateOfBirth?: Date;
  contact: ContactInfo;
  bankDetails: BankDetails;
  professional: ProfessionalInfo;
  availability: Availability;
  transformations?: Transformations[];
  testimonials?: Testimonials[];

  createdAt: Date;
  updatedAt: Date;
}
