import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  /*
  FormGroup & FormControl tracks the value and state of the all and the individual controls.
  AbstractControl:
  setValidators()
  clearValidators()
  updateValueAndValidity()

  setValue()
  patchValue(): to update a sub-set of form controls.
  reset()
  */

  /*
  FormBuilder class has 3 nethods: FormControl is not required import
  control()
  group()
  array()
 */
  employeeForm: FormGroup;
  fullNameLength = 0;
  validateBtnIsClicked = false;

  // This object contains all the validation messages for this form
  validationMessages = {
    'fullname': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be prgaimtech.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.',
    },
    'emailGroup':
    {
      'emailMismatch': 'Email and Confirms Email do not match'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'skillname': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
    'contactPreference': {
      'required': 'Contact Preference is required.',
    },
  };

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'fullname': '',
    'email': '',
    'emailGroup':'',
    'confirmEmail': '',
    'phone': '',
    'skillname': '',
    'experienceInYears': '',
    'proficiency': '',
    'contactPreference': ''
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    /*
    this.employeeForm = new FormGroup({
      fullname: new FormControl(''),
      email: new FormControl(''),
      skills: new FormGroup({
        skillname: new FormControl(''),
        experienceInYears: new FormControl(''),
        proficiency: new FormControl(''),
      }),
    });
    */

    this.employeeForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: CustomValidators.matchEmails }),
      phone: [''],
      skills: this.fb.group({
        skillname: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      }),
    });

    /*
      valueChanges Method():
      Subscribing to valueChanges Observable.
      this.employeeForm.controls.fullname.valueChanges...

      // Only one property
      this.employeeForm.get('fullname').valueChanges.subscribe((value: string) => {
        this.fullNameLength = value.length;
      });
      // All Form:
      this.employeeForm.valueChanges.subscribe((value: any) => {
        console.log(JSON.stringify(value));
      });
      // FormGroup skills:
      this.employeeForm.get('skills').valueChanges.subscribe((value: string) => {
        this.fullNameLength = value.length;
      });
    */

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefernceChange(data);
    });

  }

  onSubmit() {
    console.log(this.employeeForm.value);
    /*
      { fullname: 'Joshua', email: 'joshua@gmail.com' }
     */
    console.log(this.employeeForm.controls.fullname.value);
    /*
      Joshua
      this.employee.get('fullname');
     */
    console.log('Proficiency:', this.employeeForm.controls.skills.controls.proficiency.value);
    /*
      Validate:
     */
    console.log('fullname is valid? ', this.employeeForm.controls.fullname.valid);
  }

  /*
  Method setValue()
  */
  onLoadData(): void {
    this.employeeForm.setValue({
      fullname: 'Joshua',
      email: 'joshua@gmail.com',
      skills: {
        skillname: 'developmen',
        experienceInYears: 5,
        proficiency: 'beginner',
      },
    });
  }

  logKeyValuePairs(group: FormGroup): void {
    // group.controls = {fullname: FormControl, email: FormControl, skills: FormGroup}
    // Object.keys(group.controls) = {"fullname": "email", "skills"}

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key); // return AbstractControl
      if (abstractControl instanceof FormGroup) { // maybe FormControl or FormGroup
        this.logKeyValuePairs(abstractControl);
        // abstractControl.disable();
      } else { // Is FormControl
        console.log('Key: ' + key + ', Value: ' + abstractControl.value);
        abstractControl.disable();
      }
    });

  }

  onLoopForm() {
    this.logKeyValuePairs(this.employeeForm);
  }
  // By default FormGroup = this.employeeForm because (blur)="logValidationErrors()
  logValidationErrorsV1(group: FormGroup = this.employeeForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);
      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorsV1(abstractControl);
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty) || this.validateBtnIsClicked) {
          // for each iteration get a object x.e key = fullname:
          // {required: "Full Name is required.",
          //  minlength: "Full Name must be greater than 2 characters.",
          //  maxlength: "Full Name must be less than 10 characters."}
          const messages = this.validationMessages[key];
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the

          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) { // abstractControl.errors null is there are no error
            if (errorKey) { // errorKey: required || minlength || maxlength || null
              this.formErrors[key] += messages[errorKey] + ' '; //
            }
          }
        }
      }// else
    });
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      // Loop through nested form groups and form controls to check
      // for validation errors. For the form groups and form controls
      // that have failed validation, retrieve the corresponding
      // validation message from validationMessages object and store
      // it in the formErrors object. The UI binds to the formErrors
      // object properties to display the validation errors.
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  onValidateForm(): void {
    this.validateBtnIsClicked = true;
    this.logValidationErrors(this.employeeForm);
  }

  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

}

