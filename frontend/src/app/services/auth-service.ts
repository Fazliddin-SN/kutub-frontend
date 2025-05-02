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
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
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

  // getting user role from decoded token
  getUserRole(): "user" | "admin" | "owner" | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // console.log(decoded.role);
      return decoded.role;
    } catch (error) {
      return null;
    }
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
    localStorage.removeItem("role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("userId");
    this.loggedIn.next(false);
  }

  // getUser's full name and role
  getDecodedToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Failed to decode JWT", error);
      return null;
    }
  }

  // setting user's full name, id and role into localstorage
  setUserDetails() {
    const decoded = this.getDecodedToken();
    const userId = decoded.id;
    const full_name = decoded.full_name;
    const role = decoded.role;
    const user_email = decoded.email;

    //
    localStorage.setItem("full_name", full_name);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("user_email", user_email);
  }
}
