export interface LibraryData {
  library_id: number;
  library_name: string;
  lib_owner_name: string;
  lib_owner_address: string;
  lib_owner_email: string;
}

export type AvailableBooks = {
  book_id: string;
  read_count: number;
  title: string;
  author: string;
  category_name: string;
  status: string;
  publication_date: string;
  library_name: string;
  user_id: string;
  owner_name: string;
  owner_address: string;
};
