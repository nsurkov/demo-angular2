import {
  Component, OnInit, forwardRef, Input, Output, ViewChild, ElementRef, Renderer,
  HostBinding, HostListener, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {noop, identity, parseNumber, NUMBER_KEYS, filterNumericKeys} from './utils';

@Component({
  selector: 'my-input',
  template: `
    <my-input-layout [label]="label" [errors]="errors" [note]="note" [disabled]="disabled">
        <input *ngIf="type !== 'textarea'"
          #input
          [attr.max]="max"
          [attr.maxlength]="maxlength"
          [attr.min]="min"
          [attr.minlength]="minlength"
          [attr.name]="name"
          [readonly]="readonly"
          [required]="required"
          [disabled]="disabled"
          [type]="type"
          [(ngModel)]="valueView"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (change)="onChange($event)">
        <textarea *ngIf="type === 'textarea'"
            #input
            [attr.max]="max"
            [attr.maxlength]="maxlength"
            [attr.min]="min"
            [attr.minlength]="minlength"
            [attr.name]="name"
            [readonly]="readonly"
            [required]="required"
            [disabled]="disabled"
            [(ngModel)]="valueView"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (change)="onChange($event)"></textarea>
    </my-input-layout>
  `,
  host: {'[class.my-focused]': 'focused', '(click)': 'onClick()'},
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputComponent), multi: true }
  ]
})
export class InputComponent implements ControlValueAccessor, Validator, OnChanges {

  parseValueFn = identity;
  filterKeysFn = identity;
  _type: string;
  _value: string | number;
  _errors: string[];
  _focused: boolean;

  @ViewChild('input') _inputEl: ElementRef;

  @Input() max: string | number;
  @Input() min: string | number;
  @Input() maxlength: string | number;
  @Input() minlength: string | number;
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() note: string;
  @Input() name: string;

  @Input()
  get type() {
    return this._type;
  }
  set type(type: string) {
    this._type = type;
    if(type === 'number') {
      this.parseValueFn = parseNumber;
      this.filterKeysFn = filterNumericKeys;
    }
    else {
      this.parseValueFn = identity;
      this.filterKeysFn = identity;
    }
  }

  @Input()
  get value() {
    return this._value;
  }
  set value(value: string | number) {
    this._value = this.parseValueFn(value);
  }
  get valueView() {
    return this._value;
  }
  set valueView(value: string | number) {
    this.value = value;
    this.onChangedFn(this.value);
    this.valueChange.emit(this.value);
  }

  get focused() {
    return this._focused;
  }
  set focused(focused: boolean) {
    this._focused = focused;
  }

  onClick() {
    this._renderer.invokeElementMethod(this._inputEl.nativeElement, 'focus');
  }

  @Input()
  get errors() {
    return this._errors;
  }
  set errors(errors: string[]) {
    if(errors !== this._errors) {
      this._errors = errors || [];
      this.errorsChange.emit(this.errors);
    }
  }
  @Output() errorsChange = new EventEmitter<string[]>(true);
  @Output() valueChange = new EventEmitter<number | string>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();

  constructor(protected _renderer: Renderer) { }

  onBlur(event:FocusEvent) {
    this.focused = false;
    this.onTouchedFn();
    this.blur.emit(event);
  }

  onFocus(event:FocusEvent) {
    this.focused = true;
    this.focus.emit(event);
  }

  onChange(event: Event) {}

  @HostListener('keypress', ['$event'])
  keypress(event: KeyboardEvent) {
    event && this.filterKeysFn(event);
  }

  //OnChanges
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
  }

  //Validator
  validateFn: Function = noop;
  validate(ctrl: AbstractControl) : {[key: string]: any} {
    return this.validateFn(ctrl);
  }

  onValidatorChangeFn: Function = noop;
  registerOnValidatorChange(fn: () => void) : void {
    this.onValidatorChangeFn = fn;
  }

  //ControlValueAccessor
  onChangedFn: Function = noop;
  onTouchedFn: Function = noop;
  writeValue(value: any) : void {
      this.value = value;
  }
  registerOnChange(fn: (_: any) => void) : void {
    this.onChangedFn = fn;
  }
  registerOnTouched(fn: () => void) : void {
    this.onTouchedFn = fn;
  }
  setDisabledState(isDisabled: boolean) : void {
    this.disabled = isDisabled;
  }
}
