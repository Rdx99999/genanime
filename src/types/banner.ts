export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  color: string;
  rating?: string;
  episodes?: number;
  isActive: boolean;
  order: number;
  buttonText?: string;
  buttonAction?: string;
  animeId?: string;
}