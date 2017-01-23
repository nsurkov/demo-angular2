import {
  Component, OnInit, forwardRef, Input, Output, ViewChild, ElementRef, Renderer,
  HostBinding, HostListener, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {noop, indent, parseNumber} from './utils';

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "+", "-"];

function filterNumericKeys(event: KeyboardEvent) {
  if (NUMBER_KEYS.indexOf(event.key) === -1) {
    event.preventDefault();
    event.stopPropagation();
  }
}

@Component({
  selector: 'my-input',
  template: `
    <div class="input-container">
      <label class="no-float">{{label}}</label>
      <div class="layout-row">
        <div class="input-wrapper">
        <input *ngIf="type !== 'textarea'"
          [attr.max]="max"
          [attr.maxlength]="maxlength"
          [attr.min]="min"
          [attr.minlength]="minlength"
          [attr.name]="name"
          [readonly]="readonly"
          [required]="required"
          [disabled]="disabled"
          [ngClass]="inputClass"
          [type]="type"
          [(ngModel)]="valueView"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
          (change)="onChange($event)">
        <textarea *ngIf="type === 'textarea'"
            [attr.max]="max"
            [attr.maxlength]="maxlength"
            [attr.min]="min"
            [attr.minlength]="minlength"
            [attr.name]="name"
            [readonly]="readonly"
            [required]="required"
            [disabled]="disabled"
            [ngClass]="inputClass"
            [(ngModel)]="valueView"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (change)="onChange($event)"></textarea>
        <div *ngFor="let error of errors" class="error">{{error}}</div>
        </div>
      </div>
    </div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputComponent), multi: true }
  ]
})
export class InputComponent implements ControlValueAccessor, Validator, OnChanges {

  parseValueFn = indent;
  filterKeysFn = indent;
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
  @Input() inputClass: string;
  @Input() inputNote: string;
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
      this.parseValueFn = indent;
      this.filterKeysFn = indent;
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

  @HostListener('click')
  setFocus() {
    //this._renderer.invokeElementMethod(this._inputEl.nativeElement, 'focus');
  }
  hasFocus(): boolean {
    return this._focused;
  }

  @Input()
  get errors() {
    return this._errors;
  }
  set errors(errors: string[]) {
    this._errors = errors || [];
  }
  //@Output() errorsChange = new EventEmitter<string[]>();
  @Output() valueChange = new EventEmitter<number | string>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();

  constructor(private _renderer: Renderer) { }

  onBlur(event:FocusEvent) {
    this._focused = false;
    this.onTouchedFn();
    this.blur.emit(event);
  }

  onFocus(event:FocusEvent) {
    this._focused = true;
    this.focus.emit(event);
  }

  onChange(event: Event) {
  //
  }

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
