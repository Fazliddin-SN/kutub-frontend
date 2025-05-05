import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { SimpleUserService } from "../services/simple-user.service";
import { NotificationsService } from "../services/notifications.service";
import { UserNotification } from "../interfaces/notification.model";

import { BookService } from "../services/book.service";

declare const $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private usersService = inject(SimpleUserService);
  private booksService = inject(BookService);
  private notifService = inject(NotificationsService);

  // libraries
  libraries: any[] = [];
  // for notifications
  userNotifications: UserNotification[] = [];
  // this error handler is for the error of user joined libraries.
  libErrorMessage: string = "";
  // this one is for the notifications error
  notifError: string = "";
  // user role
  userRole = localStorage.getItem("role");

  loading = {
    userNotifications: true,
    userLibraries: true,
  };
  ngOnInit(): void {
    this.loadUserLibraries();
    this.loadUserNotifs();
  }

  // load the libraries data that the user is a member
  loadUserLibraries() {
    this.usersService.getMyLibraries().subscribe({
      next: (res) => {
        if (res.libraries.length === 0) {
          this.libErrorMessage = "Sizda kutubxonalar uchun azolik mavjud emas!";
          return;
        }
        this.libraries = res.libraries;
        this.loading.userLibraries = false;
        // console.log("my libs ", this.libraries);
      },
      error: (err) => {
        this.libErrorMessage = err.error.error;
        this.loading.userLibraries = false;
      },
    });
  }

  // this loads the notifications the user has when he loggs in
  loadUserNotifs() {
    this.notifService.notificationsForUser().subscribe({
      next: (res) => {
        console.log("notifs ", res.notifications);

        if (res.notifications.length === 0) {
          this.notifError = "Siz uchun hech qanday eslatmalar mavjud emas!";
          return;
        }
        this.userNotifications = res.notifications;
        this.loading.userNotifications = false;
      },
      error: (err) => {
        // console.log("error ", err.error.error);
        this.notifError = err.error?.error;
        this.loading.userNotifications = false;
      },
    });
  }

  // this marks the notification as read meaning the user have seen and approved
  markAsRead(n: UserNotification) {
    this.notifService.markRead(n.notification_id).subscribe(() => {
      n.is_read = true;
    });
  }

  // getting library details for library owner. total count of books, members and active rentals

  totalBooksCount: string;
  totalMembersCount: string;
  totalActRentCount: string;
  libraryName: string;
  libDetailsError: string = "";
  getLibDetails() {
    return this.booksService.getLibDetails().subscribe({
      next: (res) => {
        this.totalBooksCount = res.totalBooks;
        this.totalMembersCount = res.totalMembers;
        this.totalActRentCount = res.totalActiveRentals;
        this.libraryName = res.libName;
      },
      error: (err) => (this.libDetailsError = err.error.error),
    });
  }
  ngAfterViewInit(): void {
    this.getLibDetails();
  }
}
