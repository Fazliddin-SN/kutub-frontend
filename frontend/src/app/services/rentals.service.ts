import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GlobalConfigService } from "../global-config.service";
import {
  RentalForm,
  RentalRequestForm,
  RentalRequests,
} from "../interfaces/rental.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RentalsService {
  private http = inject(HttpClient);
  // base url
  baseUrl: string = "";
  // providing token in headers
  token: string | null = localStorage.getItem("token");
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });

  constructor(private config: GlobalConfigService) {
    this.baseUrl = config.baseUrl;
  }

  // creating new rental for lib user
  createRental(rentalData: Partial<RentalForm>): Observable<any> {
    return this.http.post(`${this.baseUrl}/rentals`, rentalData, {
      headers: this.headers,
    });
  }
  // fetching rentals for the current library
  fetchRentals(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/rentals`, {
      headers: this.headers,
    });
  }

  // assigning the book returned and removing the rental from rentals list
  updateRental(retalId: string, bookId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/rentals/delete?rental_id=${retalId}&book_id=${bookId}`,
      {},
      { headers: this.headers }
    );
  }

  // updating rental data , especially rental_date, due_date, return_date
  updateRentalData(
    rentalId: string,
    rentalData: Partial<RentalForm>
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/rentals/${rentalId}/edit`,
      rentalData,
      { headers: this.headers }
    );
  }

  // feching rental data by it ID
  fetchRental(rental_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rentals/${rental_id}`, {
      headers: this.headers,
    });
  }

  // this is for the library owners so that they can handle the cominng requests from the lib users
  fetchRentalRequests(): Observable<{ requests: RentalRequests[] }> {
    return this.http.get<{ requests: RentalRequests[] }>(
      `${this.baseUrl}/rentals/requests/details`,
      { headers: this.headers }
    );
  }

  fetchRentalById(rental_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/rentals/${rental_id}`, {
      headers: this.headers,
    });
  }

  // fetching overDue rentals
  fetchOverDueRentals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rentals/overdue`, {
      headers: this.headers,
    });
  }

  // owner can approve the request, when request approved, it means the owner has decideded to give a book to the requester
  markAsRead(user_email: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/rentals/request/approve`,
      { user_email },
      { headers: this.headers }
    );
  }
  // This is for rental requests meaning the users can send requests to users
  createRequest(requestData: RentalRequestForm): Observable<any> {
    return this.http.post<RentalRequestForm>(
      `${this.baseUrl}/rentals/request`,
      { requestData },
      { headers: this.headers }
    );
  }
}
