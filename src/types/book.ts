export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  publishedYear?: number;
  status?: string;
  copies?: number;
  totalCopies?: number;
  userName?: string;
  userEmail?: string;
  createdAt?: string | Date;
}

