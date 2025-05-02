import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GlobalConfigService } from "../global-config.service";
import { Observable } from "rxjs";
import { UserNotification } from "../interfaces/notification.model";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
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

  // getting notifications for the book borrowers
  notificationsForUser(): Observable<{ notifications: UserNotification[] }> {
    return this.http.get<{ notifications: UserNotification[] }>(
      `${this.baseUrl}/notifications/users`,
      { headers: this.headers }
    );
  }

  // approving the notification meaning
  markRead(id: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/notifications/${id}/read`,
      {},
      { headers: this.headers }
    );
  }
}
