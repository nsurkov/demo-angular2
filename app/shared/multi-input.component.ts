import {
  Component, Input, Output, ElementRef, Renderer, EventEmitter
} from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS
} from '@angular/forms';

import {
  noop, onlyDigits
} from './utils';

import {
  MultiInputPartDirective
} from './multi-input-part.directive';

export class MultiInputPart {

    public name: string;
    public value: string;
    public size: number;

    public getInputType(disabled: boolean): string {
        return "text";
    }

    public isSizeValid(): boolean {
        if (!this.value) return false;
        return this.size == null || (this.value && this.value.length === this.size);
    }

    public hasOnlyDigits(): boolean {
        return !this.value || onlyDigits(this.value);
    }

    public component: MultiInputPartDirective;

    public focus() {
        this.component && this.component.focus();
    }

    public setCursorPosition(position: number) {
        this.component && this.component.setCursorPosition(position);
    }
}

export abstract class MultiInputComponent implements ControlValueAccessor, Validator {

  _parts: MultiInputPart[];
  _value: string;
  _errors: string[];
  _focused: boolean;

  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() note: string;
  @Input() name: string;
  @Input() value: string;

  get parts() {
    if(!this._parts) {
      this._parts = this.map(this.value);
    }
    return this._parts;
  }

  invalidateParts() {
    this._parts = null;
  }

  commitIfHasChanges() {
    let value = this.reduce(this.parts);
    if(this.value !== value) {
      this.value = value;
      this.onChangedFn(this.value);
      this.valueChange.emit(this.value);
    }
  }

  abstract map(value: string): MultiInputPart[];

  abstract reduce(parts: MultiInputPart[]): string;

  get focused() {
    return this._focused;
  }
  set focused(focused: boolean) {
    this._focused = focused;
  }

  onClick() {}

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
  @Output() valueChange = new EventEmitter<number | string>(true);
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();

  constructor(protected renderer: Renderer, protected el: ElementRef) { }

  onBlur(e:FocusEvent) {
    if (e.currentTarget === e.relatedTarget) return;
    if (e.relatedTarget && this.el.nativeElement.contains(e.relatedTarget)) return;
    this.focused = false;
    this.onTouchedFn();
    this.blur.emit(e);
  }

  onFocus(event:FocusEvent) {
    this.focused = true;
    this.focus.emit(event);
  }

  onChange(event: Event) {
    this.commitIfHasChanges();
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
