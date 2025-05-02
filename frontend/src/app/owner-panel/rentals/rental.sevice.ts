import { inject, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError, of, Subject } from "rxjs";
import { BookService } from "src/app/services/book.service";
import { LibraryUserService } from "src/app/services/library-user.service";
import { Book } from "src/interfaces/book.model";
import { LibraryUser } from "src/interfaces/libraryuser.model";

@Injectable({
  providedIn: "root",
})
export class rentalService {
  private membersService = inject(LibraryUserService);
  private booksService = inject(BookService);
  //
  private _members$ = new BehaviorSubject<LibraryUser[]>([]);
  private _books$ = new BehaviorSubject<Book[]>([]);

  // 2) public, readonly Observables
  readonly members$ = this._members$.asObservable();
  readonly books$ = this._books$.asObservable();

  // Error subject
  private _error$ = new Subject<string>();
  public error$ = this._error$.asObservable();
  constructor() {
    this.loadBooks();
    this.loadMembers();
  }

  private loadMembers() {
    this.membersService
      .getMembers()
      .pipe(
        catchError((err) => {
          const msg = err.error?.error;
          this._error$.next(msg);
          return of({ members: [] as LibraryUser[] });
        })
      )
      .subscribe((res) => this._members$.next(res.members));
  }

  private loadBooks() {
    this.booksService
      .getBooks()
      .pipe(
        catchError((err) => {
          const msg = err.error?.error;
          this._error$.next(msg);
          return of({ books: [] as Book[] });
        })
      )
      .subscribe((res) => {
        // console.log("res books ", res.books);

        this._books$.next(res.books);
      });
  }
}
