import { Routes } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "pages/login",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "components",
        loadChildren: () =>
          import("./components/components.module").then(
            (m) => m.ComponentsModule
          ),
      },
      {
        path: "forms",
        loadChildren: () => import("./forms/forms.module").then((m) => m.Forms),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./tables/tables.module").then((m) => m.TablesModule),
      },
      {
        path: "maps",
        loadChildren: () =>
          import("./maps/maps.module").then((m) => m.MapsModule),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./widgets/widgets.module").then((m) => m.WidgetsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./charts/charts.module").then((m) => m.ChartsModule),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("./calendar/calendar.module").then((m) => m.CalendarModule),
      },
      {
        path: "",
        loadChildren: () =>
          import("./userpage/user.module").then((m) => m.UserModule),
      },
      {
        path: "",
        loadChildren: () =>
          import("./timeline/timeline.module").then((m) => m.TimelineModule),
      },
      {
        path: "owner-panel",
        loadChildren: () =>
          import("./owner-panel/owner-panel.module").then(
            (m) => m.OwnerPanelModule
          ),
      },
      {
        path: "owner",
        loadChildren: () =>
          import("./owner-panel/members/lib-members.module").then(
            (m) => m.LibMembersModule
          ),
      },

      {
        path: "owner",
        loadChildren: () =>
          import("./owner-panel/rentals/rentals.module").then(
            (m) => m.RentalsModule
          ),
      },
      {
        path: "admin-panel",
        loadChildren: () =>
          import("./admin-panel/admin.module").then((m) => m.AdminPanelModule),
      },
      {
        path: "user-panel",
        loadChildren: () =>
          import("./user-panel/user-panel.module").then(
            (m) => m.userPanelModule
          ),
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "pages",
        loadChildren: () =>
          import("./pages/pages.module").then((m) => m.PagesModule),
      },
    ],
  },
];
