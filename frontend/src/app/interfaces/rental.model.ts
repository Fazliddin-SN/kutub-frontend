export interface RentalForm {
  user_id: string;
  book_id: string;
  rental_date: string;
  due_date: string;
  return_date: string;
  actual_return_date: string;
  status: string;
}

export interface RentalRequestForm {
  user_email: string;
  message: string;
  owner_id: string;
  book_id: string;
}

export interface RentalRequests {
  request_id: string;
  user_email: string;
  message: string;
  owner_id: string;
  title: string;
  created_at: string;
}
