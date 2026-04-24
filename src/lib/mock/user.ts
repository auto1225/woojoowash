export interface CarInfo {
  brand: string;
  model: string;
  plate: string;
  color: string;
}

export interface ReservationInfo {
  id: string;
  storeName: string;
  productName: string;
  date: string;
  time: string;
  durationMin: number;
  price: number;
  status: "confirmed" | "done" | "canceled";
}

export const MOCK_USER = {
  name: "김우주",
  phone: "010-1234-5678",
  cars: [
    { brand: "현대", model: "그랜저 IG", plate: "12가 3456", color: "펄 화이트" },
  ] as CarInfo[],
  reservations: [
    {
      id: "rsv_001",
      storeName: "우주워시 강남점",
      productName: "기본(베이직) 디테일링",
      date: "2026-04-25",
      time: "14:30",
      durationMin: 60,
      price: 55000,
      status: "confirmed",
    },
    {
      id: "rsv_000",
      storeName: "우주워시 역삼점",
      productName: "셀프세차 1시간",
      date: "2026-04-20",
      time: "11:00",
      durationMin: 60,
      price: 8000,
      status: "done",
    },
  ] as ReservationInfo[],
};
