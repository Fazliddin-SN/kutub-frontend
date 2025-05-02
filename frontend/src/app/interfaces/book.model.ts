export type Book = {
  book_id: string;
  title: string;
  author: string;
  isbn: string;
  category_id: string;
  publication_date: string;
  image_path: null;
  status: string;
  library_id: number;
  read_count: number;
};

export type BookForm = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publication_date: string;
  status: string;
  image: string;
};

export type BorrowedBook = {
  rental_id: number;
  book_id: number;
  title: string;
  author: string;
  library_name: string;
  rental_date: string; // ISO date string
  due_date: string; // ISO date string
  return_date: string; // ISO date string
  owner_name: string;
};
