import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListEmployeesComponent } from "./list-employees.component";
import { CreateEmployeeComponent } from "./create-employee.component";


//these are the routes
const appRoutes: Routes = [
    { path: "", component: ListEmployeesComponent },
    { path: "create", component: CreateEmployeeComponent },
    { path: "edit/:id", component: CreateEmployeeComponent },

];

@NgModule({
    /* imports: [RouterModule.forRoot(appRoutes)], */ // its purpose is to make the angular recognise this routes 
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }
