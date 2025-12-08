export interface Address {
  zipcode: string;
  address: string;
  kana: string;
}

export interface ApiResponse {
  status: number;
  message: string | null;
  results: ApiResult[] | null;
}

export interface ApiResult {
  zipcode: string;
  prefcode: string;
  address1: string;
  address2: string;
  address3: string;
  kana1: string;
  kana2: string;
  kana3: string;
}