/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  HostBinding,
  OnDestroy,
  inject,
} from '@angular/core';
import { NgModel, NgModelGroup } from '@angular/forms';

import { Subject, mergeWith, of, switchMap, takeUntil } from 'rxjs';

import { FormDirective } from '../form.directive';
import { AbstractControlWarn } from '../types';

/**
 * This components's selector targets any element that has a validation-wrapper property
 * The purpose of this component is to display the errors found when validating the form
 */
@Component({
  imports: [CommonModule],
  selector: '[validation-wrapper]',
  standalone: true,
  styleUrls: ['./validation-wrapper.component.scss'],
  templateUrl: './validation-wrapper.component.html',
})
export class ValidationWrapperComponent implements AfterViewInit, OnDestroy {
  @ContentChild(NgModel) public ngModel?: NgModel; // Optional ngModel
  // Optional ngModelGroup
  public readonly ngModelGroup: NgModelGroup | null = inject(NgModelGroup, {
    optional: true,
    self: true,
  });

  private readonly destroy$ = new Subject<void>();
  private readonly formDirective = inject(FormDirective);
  private readonly cdRef = inject(ChangeDetectorRef);
  // Cache the previous error to avoid 'flickering'
  private previousError?: string[];
  private previousWarning?: string[];

  private get control(): AbstractControlWarn | undefined {
    return this.ngModelGroup
      ? this.ngModelGroup.control
      : this.ngModel?.control;
  }
  // A invalid class will be bound to the host if the NgModel or NgModelGroup directive has errors.
  @HostBinding('class.input-wrapper--invalid')
  public get invalid() {
    return (
      this.control?.status !== 'DISABLED' &&
      this.errors &&
      (this.control?.touched || this.control?.dirty)
    );
  }

  @HostBinding('class.input-wrapper--warning')
  public get warning() {
    if (
      this.control?.status !== 'DISABLED' &&
      this.warnings &&
      (this.control?.touched || this.control?.dirty)
    ) {
      return true;
    }
    return false;
  }

  public get errors(): string[] | undefined {
    if (this.control?.pending) {
      return this.previousError;
    } else {
      this.previousError = this.control?.errors?.['errors'];
    }
    return this.control?.errors?.['errors'];
  }

  public get warnings(): string[] | undefined {
    if (this.control?.pending) {
      return this.previousWarning;
    } else {
      this.previousWarning = this.control?.warnings;
    }

    return this.control?.warnings;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public ngAfterViewInit(): void {
    // Wait until the form is idle
    // Then, listen to all events of the ngModelGroup or ngModel
    // and mark the component and its ancestors as dirty
    // This allows us to use the OnPush ChangeDetection Strategy
    this.formDirective.idle$
      .pipe(
        switchMap(() => this.ngModelGroup?.control?.statusChanges || of(null)),
        mergeWith(this.control?.statusChanges || of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cdRef.markForCheck();
      });
  }
}
