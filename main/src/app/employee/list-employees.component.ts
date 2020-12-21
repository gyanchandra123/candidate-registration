import { Component, OnInit } from '@angular/core';
 
import { EmployeeService } from './employeeService';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees:IEmployee[];

  constructor(private employ_service:EmployeeService , 
              private _router :Router) { }

  EmployeeService 

  ngOnInit() {
    this.employ_service.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err),

    )
  }

  editButtonClick(employeeId :number){
      this._router.navigate(['employees/edit' , employeeId]);
  }

}
