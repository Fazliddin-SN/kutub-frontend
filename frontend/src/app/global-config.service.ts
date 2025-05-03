import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, shareReplay } from "rxjs";
import { Category } from "./interfaces/category.model";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./interfaces/token.model";
@Injectable({
  providedIn: "root",
})
export class GlobalConfigService {
  // readonly baseUrl = "http://185.196.213.248:3017";
  readonly baseUrl = "http://localhost:3017";
  private http = inject(HttpClient);

  // BehaviorSubject holds the “current” list of categories
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public readonly categories$ = this.categoriesSubject.asObservable();

  // Optionally expose a cached HTTP call for late subscribers
  private fetch$: Observable<Category[]> | null = null;

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    const token = localStorage.getItem("token");

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // // If we already started a fetch, reuse it
    if (!this.fetch$) {
      this.fetch$ = this.http
        .get<{ categories: Category[] }>(`${this.baseUrl}/categories`, {
          headers,
        })
        .pipe(
          map((res) => {
            // console.log(res.categories);
            return res.categories;
          }),
          shareReplay(1) // cache the result for any future subscribers
        );
    }
    this.fetch$.subscribe({
      next: (cats) => {
        // console.log(cats);
        this.categoriesSubject.next(cats);
      },
      error: (err) => {
        console.error("Failed to load categories", err);
        // you might want to push an empty array or some flag:
        this.categoriesSubject.next([]);
      },
    });
  }
}
