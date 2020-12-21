import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { CustomPreloadingService } from './custom-preloading.service';

//these are the routes
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  /*  { path: "", redirectTo: "/list", pathMatch: "full" }, */
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "employees", data: { preload: true }, loadChildren: "./employee/employee.module#EmployeeModule" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: CustomPreloadingService })],
  
   // its purpose is to make the angular recognise this routes 
  exports: [RouterModule]
})
export class AppRoutingModule { }
