import { AbstractControl } from '@angular/forms';

export class CustomValidators {
    //custom validator without hardcoding // here we are using the closure function concept.
    static emailDomain(domainName: string) {

        return (control: AbstractControl): { [key: string]: any } | null => {

            const email = control.value;
            
            const domain = email.substring(email.lastIndexOf('@') + 1);

            /* email === '' || : "{ 'emailDomain': true }"  ===> should display only when form-control is
             not required*/
            if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
                return null;
            }
            else {
                return { 'emailDomain': true };
            }
        }
    }
}