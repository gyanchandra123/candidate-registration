import { NgModule } from '@angular/core';

import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';

import { EmployeeRoutingModule } from './emplyee-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ListEmployeesComponent
  ],
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ],

  exports: [
    CreateEmployeeComponent,

  ]
})
export class EmployeeModule { }
