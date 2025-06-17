import { inject, Injectable } from "@angular/core";
import { GlobalConfigService } from "../global-config.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { User } from "../interfaces/user.model";
import { DecodedToken } from "../interfaces/token.model";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl: string;
  private http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isloggedIn$ = this.loggedIn.asObservable();

  constructor(private config: GlobalConfigService) {
    this.baseUrl = this.config.baseUrl;
    // console.log(this.baseUrl);
  }
  // Check if token exists initially
  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }
  // login method
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  //sign method for guests
  register(
    full_name: string,
    user_name: string,
    email: string,
    password: string,
    address: string,
    phone_number: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, {
      full_name,
      user_name,
      email,
      password,
      address,
      phone_number,
    });
  }

  // registering new users with roles 'admin', 'user', and 'owner'
  registerUser(userData: Partial<User>): Observable<any> {
    const { fullname, username, email, password, address, phone_number, role } =
      userData;

    // Retrieve token from localStorage or another source
    const token = localStorage.getItem("token");

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });
    return this.http.post(
      `${this.baseUrl}/auth/sign-up`,
      {
        full_name: fullname,

        username,
        email,
        password,
        address,
        phone_number,
        role,
      },
      { headers }
    );
  }

  // registering new library for new user
  registerLib(user_email: string, library_name: string): Observable<any> {
    const token = localStorage.getItem("token");

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });

    return this.http.post(
      `${this.baseUrl}/library`,
      { library_name, user_email },
      {
        headers,
      }
    );
  }

  // getting token from localstorage
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // check if user logs in
  isLoggedIn(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // logout functio
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("full_name");
    localStorage.removeItem("roleId");
    localStorage.removeItem("user_email");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");
    this.loggedIn.next(false);
  }

  // getUser's full name and role
  getDecodedToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<any>(token);
    } catch (error) {
      console.error("Failed to decode JWT", error);
      return null;
    }
  }

  // setting user's full name, id and role into localstorage
  setUserDetails() {
    const decoded = this.getDecodedToken();
    const userId = decoded.id;
    const fullname = decoded.fullname;
    const role_id = decoded.role_id;
    const user_email = decoded.email;

    //
    localStorage.setItem("fullname", fullname);
    localStorage.setItem("roleId", role_id);
    localStorage.setItem("userId", userId);
    localStorage.setItem("user_email", user_email);
  }

  // getting user details of all types of users
  getUserDetails(): Observable<any> {
    const token = localStorage.getItem("token");
    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });
    return this.http.get<any>(`${this.baseUrl}/auth/me`, {
      headers,
    });
  }
  //update some of user details and add avatar
  updateUser(userData: any): Observable<any> {
    const token = localStorage.getItem("token");

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });
    return this.http.put<any>(`${this.baseUrl}/auth/update`, userData, {
      headers,
    });
  }
}
