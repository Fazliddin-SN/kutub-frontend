import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { Book, BookForm } from "../interfaces/book.model";
import { Observable, retry } from "rxjs";
import { GlobalConfigService } from "../global-config.service";

@Injectable({
  providedIn: "root",
})
export class BookService {
  // http requests
  private http = inject(HttpClient);
  private baseUrl: string;

  constructor(private config: GlobalConfigService) {
    this.baseUrl = config.baseUrl;
  }

  // token and header
  token: string | null = localStorage.getItem("token");
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });
  // fetching all books that belong to a specific library
  getBooks(): Observable<{ books: Book[] }> {
    return this.http.get<{ books: Book[] }>(`${this.baseUrl}/library/books`, {
      headers: this.headers,
    });
  }

  // create book
  addNewBook(bookData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/books/add`, bookData, {
      headers: this.headers,
    });
  }

  removeBook(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/books/${bookId}`, {
      headers: this.headers.delete("Content-Type"),
    });
  }
  // get book by id
  getBookById(bookId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/books/${bookId}`, {
      headers: this.headers,
    });
  }

  // update book
  updateBook(bookId: string, bookData: any): Observable<any> {
    console.log("book data", bookData);

    return this.http.put(`${this.baseUrl}/books/update/${bookId}`, bookData, {
      headers: this.headers,
    });
  }
}
