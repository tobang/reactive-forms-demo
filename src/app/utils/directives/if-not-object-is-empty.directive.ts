import { NgIf } from '@angular/common';
import { Directive, inject, Input, OnInit } from '@angular/core';
import { isObjectEmpty } from '../general/is-object-empty';
import { notNullOrUndefined } from '../general/not-null-undefined';

@Directive({
  selector: '[ifNotObjectEmpty]',
  hostDirectives: [
    {
      directive: NgIf,
      inputs: ['ngIfElse: ifNotObjectEmptyElse'],
    },
  ],
  standalone: true,
})
export class IfNotObjectEmptyDirective {
  private ngIfDirective = inject(NgIf);

  @Input('ifNotObjectEmpty') set ifNotObjectEmpty(ifObject: any) {
    this.ngIfDirective.ngIf =
      !isObjectEmpty(ifObject) && notNullOrUndefined(ifObject);
  }
}
