interface NFTEntry {
  id: number;
  eth: number;
  relativeEth?: number;
  rank?: number;
  lastUpdated: string;
  ownerUrl: string;
  ownerName: string;
}

interface TotalObject {
  totalDonated?: number;
  totalData?: NFTEntry[];
}
