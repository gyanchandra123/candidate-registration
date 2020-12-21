import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray
} from "@angular/forms";
import { Key } from "protractor";
import { CustomValidators } from '../shared/custom.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employeeService';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"]
})

export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup; // declare the formGroup

  employee: IEmployee;

  name: any;


  public pageTitle: string;

  public fullNameLength = 0;

  public validationMessage = {

    'fullName': {
      'required': "FullName is required",
      "minlength ": "Full name must be greater than 2 character",
      'maxlength': "Full name must be less than 10 characters"
    },
    'email': {
      'required': "email is required",
      'emailDomain': 'email domain should be @dell.com'
    },

    'confirmEmail': {
      'required': "confirm email is required",
    },

    'emailGroup': {
      'emailMisMatch': "email and confirm email do not match"
    },


    'phone': {
      'required': "phone number is required"
    },

  };

  public formsError = {
    'fullName': '',
    'email': '',
    'emailGroup': '',
    'confirmEmail': '',
    'phone': ''

  };

  constructor(private fb: FormBuilder,
    private _activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit() {
    /* 1st approach */
    /* this.employeeForm = new FormGroup({
      fullName: new FormControl(),
      email: new FormControl(),
      skill: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()
      })
    }); */


    /*  creating form using formBuilder */
    this.employeeForm = this.fb.group({
      
      fullName: [ "",[Validators.required, Validators.minLength(2), Validators.maxLength(10)]],

      contactPreference: ['email'],

      emailGroup: this.fb.group({
        email: ["", [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ["", [Validators.required]],
      }, { validators: matchEmail }),
      
      phone: ["",],

      skills: this.fb.array([
        this.addSkillFormGroup()
      ])

    });


    /* detecting changes in the contactPreference through valueChanges: */
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPerferenceChange(data);
    });


    /* deteriming changes in the form using valueChanges */
    this.employeeForm.valueChanges.subscribe(data => {

      /* TRACKING CHANGES IN THE FORM-GROUP */
      console.log("COMPLETE FORM VALUE CHANGES TRACK : ", data);

      this.logValidationErrors(this.employeeForm);
    });



    /* fetching value from service after clicking edit button */    
    this._activateRoute.paramMap.subscribe((params) => {

        const empId = +params.get("id");

        if (empId) {
          this.pageTitle = "Edit employee"
          this.getEmployee(empId);
        }
        else {
          this.pageTitle = "Create employee"
          this.employee = {
            id: null,
            fullName: '',
            contactPreference: '',
            email: '',
            phone: null,
            skills: [],
          }
        }
      }
    )

   

  }

  // note : this method is used for adding and removing errors  to the form controls
  logValidationErrors(group: FormGroup = this.employeeForm): void {

    Object.keys(group.controls).forEach((formControlsOrFormGroupKey: string) => {

      const abstractControl = group.get(formControlsOrFormGroupKey);

      this.formsError[formControlsOrFormGroupKey] = "";

      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty) 
      || abstractControl.value != '') {

        const errorMessage = this.validationMessage[formControlsOrFormGroupKey];

        for (const errorKey in abstractControl.errors) { 

          if (errorKey) {
            this.formsError[formControlsOrFormGroupKey] += 
              errorMessage[errorKey] + " ";
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      
    }
    );
     /* JUST FOR DEBUGGING */    
     (<any>window).CustomNumber =this.employeeForm;
    
  }

/* detecting changes in the contactPreference through valueChanges: */
  onContactPerferenceChange(selectedRadioValue: string) {

    const phoneControl = this.employeeForm.get('phone');

    if (selectedRadioValue === 'phone') {
      phoneControl.setValidators([Validators.required]);
    }
    else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity(); // to immediately set and update the validatoion to the template
  }



  //setValue()
  loadData() {

    const formArray1 = new FormArray([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),

    ]);

    formArray1.push(new FormControl('Mark', Validators.required));
    console.log(formArray1.at(3).value);

    console.log(formArray1.value); // use to get the value of the form array control's 
    //value in the form of array 

    console.log(formArray1.valid); // applying more properties //false
    console.log(formArray1.invalid);  //true

    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),

    ]);

    // to see the differences :
    // console.log(formArray1);
    //console.log(formGroup);



    /* SETTING DEFAULT VALUES FOR THE FORM-FILLS :- */
    this.employeeForm.patchValue({

      fullName: "gyannnn",

      emailGroup: {
        email: "gy@gmail.com",
        confirmEmail: "gy@gmail.com",

      },
      phone: 983121210,

      skills: [{
        skillName: "java+angular",
        experienceInYears: "2",
        proficiency: "intermediate"
      }]
    })

  }

  //  creating a method for skill with the formGroup and the controls
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ["", [Validators.required]],
      experienceInYears: ["", [Validators.required]],
      proficiency: ["", [Validators.required]]
    })
  }

 
  AddSkills(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup())
    console.log(this.employeeForm.get('skills'));
    console.log(this.employeeForm);

  }


  removeSkillButton(skillGroupIndex: number): void {
    const skillFormArray = <FormArray>this.employeeForm.get('skills');
    skillFormArray.removeAt(skillGroupIndex);
    skillFormArray.markAsDirty();
    skillFormArray.markAsTouched();
    console.log("TOUCHED" + this.employeeForm.touched);
    console.log("DIRTY" + this.employeeForm.dirty);

    // storing modified data to the model class object, so that we can sent only modified data to the service:
    this.mapFormsValueToEmployeeModel(); 

    this.employeeService.updateEmployee(this.employee).subscribe(      
      (err: any) => console.log(err)
    );
  }

  //27.getting employee details from service based on the route ID after clicking the edit 
  getEmployee(id: number) {

    this.employeeService.getEmployee(id).subscribe( (employee: IEmployee) => {
    
        console.log('EDIT EMPLOYEE ID DATA :',employee);

        this.editEmployee(employee),
          (err: any) => console.log(err),
            this.employee = employee // to hold the employee server's retrieve data for updating after editing=done. 

      }
    )

  }

  mapFormsValueToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  /* updating non-formArray's form-controls fills after the edit button click: */
  editEmployee(employee: IEmployee) {

    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone,
    })

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills))
  }

  
  /* updating formArray fills containing collection of form-group object */
  setExistingSkills(skillSets: ISkill[]): FormArray {

    const formArray = new FormArray([]);

    skillSets.forEach(s => {      
       formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }))
    })
    return formArray;
  }

  submit() {
   
    this.mapFormsValueToEmployeeModel(); // storing data to the model class object.

    // passiing the model object data  to the service.
    
    if (this.employee.id) {   // if the employee id is truthy, we are editing existing one.
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
    else {   // else we are creating new employee, so call addEmployee()method of the service

      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
  }




}



function matchEmail(group: AbstractControl): { [Key: string]: any } | null {

  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value ||
    (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  }
  else {
    return { 'emailMisMatch': true };
  }
}



