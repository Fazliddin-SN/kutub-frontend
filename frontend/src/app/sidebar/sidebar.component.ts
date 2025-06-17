import { Component, inject, OnInit } from "@angular/core";

import PerfectScrollbar from "perfect-scrollbar";
import { AuthService } from "../services/auth-service";

declare const $: any;

//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}
// // my route items
export const ownerROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/owner-panel/library",
    title: "Mening Kitoblarim",
    type: "sub",
    icontype: "books",
    collapse: "library",
    children: [
      { path: "books", title: "Kitoblar Ro'yxati", ab: "KR" },
      { path: "new-book", title: "Yangi Kitob Qo'shish", ab: "YK" },
      // we don’t put edit/:bookId here—those links live in the list view
    ],
  },
  {
    path: "/owner/library/members",
    title: "Foydalanuvchilarim",
    type: "sub",
    icontype: "group",
    collapse: "members",
    children: [
      { path: "list", title: "Foydalanuvchilar Ro'yxati", ab: "FR" },
      { path: "add-member", title: "Yangi Foydalanuvchi Qo'shish", ab: "YF" },
      // we don’t put edit/:bookId here—those links live in the list view
    ],
  },
  {
    path: "/owner/library/rentals",
    title: "Ijaralar",
    type: "sub",
    icontype: "menu_book",
    collapse: "rentals",
    children: [
      { path: "list", title: "Ijaralar Ro'yxati", ab: "IR" },
      { path: "add-rental", title: "Yangi Ijara", ab: "YI" },
      { path: "history", title: "Ijaralar Tarixi", ab: "IT" },
      { path: "requests", title: "So'rovlar", ab: "IS" },
      // we don’t put edit/:bookId here—those links live in the list view
    ],
  },
  {
    path: "/tables",
    title: "Tables",
    type: "sub",
    icontype: "grid_on",
    collapse: "tables",
    children: [
      { path: "regular", title: "Regular Tables", ab: "RT" },
      { path: "extended", title: "Extended Tables", ab: "ET" },
      { path: "datatables.net", title: "Datatables.net", ab: "DT" },
    ],
  },
];

// for admin routes
export const adminROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/admin-panel",
    title: "Admin Amallari",
    type: "sub",
    icontype: "admin_panel_settings",
    collapse: "admin-rules",
    children: [
      { path: "add-user", title: "Yangi Azo Qo'shish", ab: "KR" },
      { path: "add-lib", title: "Yangi Kutubxona Yaratish", ab: "YK" },
      // we don’t put edit/:bookId here—those links live in the list view
    ],
  },
];

// For Simple Users Routes
export const userROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/user-panel",
    title: "Mening Amallarim",
    type: "sub",
    icontype: "library_books",
    collapse: "user-rules",
    children: [
      { path: "available-books", title: "Ijarlar va Kitoblar", ab: "IK" },
    ],
  },
];

//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/components",
    title: "Components",
    type: "sub",
    icontype: "apps",
    collapse: "components",
    children: [
      { path: "buttons", title: "Buttons", ab: "B" },
      { path: "grid", title: "Grid System", ab: "GS" },
      { path: "panels", title: "Panels", ab: "P" },
      { path: "sweet-alert", title: "Sweet Alert", ab: "SA" },
      { path: "notifications", title: "Notifications", ab: "N" },
      { path: "icons", title: "Icons", ab: "I" },
      { path: "typography", title: "Typography", ab: "T" },
    ],
  },

  {
    path: "/user-panel",
    title: "Mening Amallarim",
    type: "sub",
    icontype: "library_books",
    collapse: "user-rules",
    children: [
      { path: "available-books", title: "Ijarlar va Kitoblar", ab: "IK" },
    ],
  },
  {
    path: "/forms",
    title: "Forms",
    type: "sub",
    icontype: "content_paste",
    collapse: "forms",
    children: [
      { path: "regular", title: "Regular Forms", ab: "RF" },
      { path: "extended", title: "Extended Forms", ab: "EF" },
      { path: "validation", title: "Validation Forms", ab: "VF" },
      { path: "wizard", title: "Wizard", ab: "W" },
    ],
  },
  {
    path: "/tables",
    title: "Tables",
    type: "sub",
    icontype: "grid_on",
    collapse: "tables",
    children: [
      { path: "regular", title: "Regular Tables", ab: "RT" },
      { path: "extended", title: "Extended Tables", ab: "ET" },
      { path: "datatables.net", title: "Datatables.net", ab: "DT" },
    ],
  },
  {
    path: "/maps",
    title: "Maps",
    type: "sub",
    icontype: "place",
    collapse: "maps",
    children: [
      { path: "google", title: "Google Maps", ab: "GM" },
      { path: "fullscreen", title: "Full Screen Map", ab: "FSM" },
      { path: "vector", title: "Vector Map", ab: "VM" },
    ],
  },
  {
    path: "/widgets",
    title: "Widgets",
    type: "link",
    icontype: "widgets",
  },
  {
    path: "/charts",
    title: "Charts",
    type: "link",
    icontype: "timeline",
  },
  {
    path: "/calendar",
    title: "Calendar",
    type: "link",
    icontype: "date_range",
  },
  {
    path: "/pages",
    title: "Pages",
    type: "sub",
    icontype: "image",
    collapse: "pages",
    children: [
      { path: "pricing", title: "Pricing", ab: "P" },
      { path: "timeline", title: "Timeline Page", ab: "TP" },
      { path: "login", title: "Login Page", ab: "LP" },
      { path: "register", title: "Register Page", ab: "RP" },
      { path: "lock", title: "Lock Screen Page", ab: "LSP" },
      { path: "user", title: "User Page", ab: "UP" },
    ],
  },
];
@Component({
  selector: "app-sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  authService = inject(AuthService);
  userRole = localStorage.getItem("role");
  fullName: string = "";
  ps: any;
  userAvatar: string = "";
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.userAvatar = localStorage.getItem("avatar");
    if (this.userRole === "1") {
      this.menuItems = adminROUTES.filter((menuItem) => menuItem);
    } else if (this.userRole === "2") {
      this.menuItems = ownerROUTES.filter((menuItem) => menuItem);
    } else if (this.userRole === "3") {
      this.menuItems = userROUTES.filter((menuItem) => menuItem);
    } else {
    }
    this.fullName = localStorage.getItem("fullname");

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      this.ps = new PerfectScrollbar(elemSidebar);
    }
  }
  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
  expandOrCollapseMenu(id) {
    let parent = document.getElementById(id + "-p");
    let child = document.getElementById(id);
    parent.ariaExpanded = parent.ariaExpanded === "true" ? "false" : "true";
    child.style.height =
      child.style.height === "0px" || child.style.height === "" ? "100%" : "0";
  }
}
