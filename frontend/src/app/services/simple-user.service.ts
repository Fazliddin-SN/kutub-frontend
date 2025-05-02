import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GlobalConfigService } from "../global-config.service";
import { Observable } from "rxjs";
import { AvailableBooks, LibraryData } from "../interfaces/library.model";
import { BorrowedBook } from "../interfaces/book.model";

@Injectable({
  providedIn: "root",
})
export class SimpleUserService {
  private http = inject(HttpClient);
  // base url
  baseUrl: string = "";
  // providing token in headers
  token: string | null = localStorage.getItem("token");

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });

  constructor(private config: GlobalConfigService) {
    this.baseUrl = this.config.baseUrl;
  }

  // getting the library details for the user who is the member
  getMyLibraries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/libraries`, {
      headers: this.headers,
    });
  }

  // getting avaiable books from libraries that the user is a member of
  getAvailabelBooks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/available-books`, {
      headers: this.headers,
    });
  }

  // getting the books the user has borrowed and currently has
  getBorrowedBooks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/borrowed-books`, {
      headers: this.headers,
    });
  }
}
