import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalConfigService {
  // readonly baseUrl = "http://185.196.213.248:3017";
  readonly baseUrl = "http://localhost:3020";
  private http = inject(HttpClient);

  constructor() {
    this.loadCategories();
    this.getBookStatuses();
    this.getRentalStatuses();
  }

  loadCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getBookStatuses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/b-status`, {});
  }

  getRentalStatuses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/r-status`, {});
  }
}
