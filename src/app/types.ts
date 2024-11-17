export interface LocationData {
  id: string;
  lat: number;
  long: number;
  name: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  location: string;
  timestamp: string;
  coordinates?: {
    lat: number;
    long: number;
  };
}
