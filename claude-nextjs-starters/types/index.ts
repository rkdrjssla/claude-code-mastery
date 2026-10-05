// 사용자 정보 (Supabase Auth)
export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

// 견적서
export type Quote = {
  id: string;
  user_id: string;
  notion_page_id: string;
  client_name: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

// 견적서 항목
export type QuoteItem = {
  id: string;
  quote_id: string;
  name: string;
  quantity: number;
  unit_price: number;
};

// API 응답
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};
