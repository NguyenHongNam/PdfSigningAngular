export interface Contract {
    id: number;
    title: string;
    path: string;
    createdAt?: Date;
    isSigned: boolean;
  }