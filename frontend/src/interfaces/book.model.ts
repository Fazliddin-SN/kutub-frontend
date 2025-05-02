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
};
