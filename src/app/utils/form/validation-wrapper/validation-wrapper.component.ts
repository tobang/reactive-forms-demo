import { Component, ContentChild, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel, NgModelGroup } from '@angular/forms';

@Component({
  selector: '[validation-wrapper]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-wrapper.component.html',
  styleUrls: ['./validation-wrapper.component.scss'],
})
// This components's selector targets any element that has a validation-wrapper property
// The purpose of this component is to display the errors found when validating the form
export class ValidationWrapperComponent {
  // As the validation wrapper, wraps the NgModel directive, we can access the directive via ContentChild
  @ContentChild(NgModel) public ngModel?: NgModel;
  // We can get access to the optional NgModelGroup through dependency injection
  // It is optional and only use the injector of this class
  public readonly ngModelGroup: NgModelGroup | null = inject(NgModelGroup, {
    optional: true,
    self: true,
  });

  // A invalid class will be bound to the host if the NgModel or NgModelGroup directive has errors.
  @HostBinding('class.input-wrapper--invalid')
  public get invalid() {
    if (
      (!this.ngModelGroup &&
        this.ngModel?.control?.errors &&
        (this.ngModel?.touched || this.ngModel?.dirty)) ||
      (this.ngModelGroup?.control?.errors &&
        (this.ngModelGroup.touched || this.ngModelGroup?.dirty))
    ) {
      return true;
    }
    return false;
  }
}
