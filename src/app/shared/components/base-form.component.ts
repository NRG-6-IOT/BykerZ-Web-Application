import {FormGroup} from '@angular/forms';

export class BaseFormComponent {
  /**
   * Checks if a control is invalid
   * @param form The form group to check
   * @param controlName The name of the control to check
   * @return True if the control is invalid, false otherwise
   * @protected
   */
  protected isInvalidControl(form: FormGroup, controlName: string) {
    return form.controls[controlName].invalid && form.controls[controlName].touched;
  }

  /**
   * Gets the error messages for a control
   * @param form The form group to check
   * @param controlName The name of the control to check
   * @return The error messages for the control
   * @protected
   */
  protected errorMessagesForControl(form: FormGroup, controlName: string) {
    const control = form.controls[controlName];
    let errorMessages = "";
    let errors = control.errors;
    if (!errors)
      return errorMessages;
    Object.keys(errors).forEach((errorKey) =>
      errorMessages += this.errorMessageForControl(controlName, errorKey)
    );
    return errorMessages;
  }

  /**
   * Gets the error message for a control and error key
   * @param controlName The name of the control
   * @param errorKey The error key
   * @return The error message
   * @private
   */
  private errorMessageForControl(controlName: string, errorKey: string) {
    switch (errorKey) {
      case 'required':
        return `${controlName} is required`;
      default:
        return `${controlName} is invalid`;
    }
  }
}
