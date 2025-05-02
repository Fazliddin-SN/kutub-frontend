import { inject, Injectable } from "@angular/core";
import { GlobalConfigService } from "../global-config.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LibraryUser, LibraryUserForm } from "../interfaces/libraryuser.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LibraryUserService {
  private http = inject(HttpClient);

  // base url
  baseUrl: string = "";
  // providing token in headers
  token: string | null = localStorage.getItem("token");
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
  });

  //

  constructor(private config: GlobalConfigService) {
    this.baseUrl = config.baseUrl;
  }
  // registering new library user
  register(userData: Partial<LibraryUser>): Observable<any> {
    return this.http.post(`${this.baseUrl}/library/members`, userData, {
      headers: this.headers,
    });
  }

  // fetching members details
  getMembers(): Observable<{ members: LibraryUser[] }> {
    return this.http.get<{ members: LibraryUser[] }>(
      `${this.baseUrl}/library/members`,
      { headers: this.headers }
    );
  }

  // removing the library user by id
  removeUser(userId: string | null): Observable<any> {
    return this.http.delete(`${this.baseUrl}/library/members/${userId}`, {
      headers: this.headers,
    });
  }

  // get  library member by id
  getuserById(userId: string): Observable<any> {
    console.log("userId ", userId);

    return this.http.get(`${this.baseUrl}/library/members/${userId}`, {
      headers: this.headers,
    });
  }

  // update library user by id
  updateUser(
    userId: string,
    userData: Partial<LibraryUserForm>
  ): Observable<any> {
    // const { user_name, full_name, address, email, password, phone_number } =
    //   userData;
    return this.http.put(
      `${this.baseUrl}/library/members/${userId}/edit`,
      { ...userData, user_name: userData.user_name },
      {
        headers: this.headers,
      }
    );
  }
}
