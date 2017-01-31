import {
  Component, Directive, OnInit, AfterViewChecked, forwardRef, Input, Output, ViewChildren, ElementRef, Renderer,
  HostBinding, HostListener, EventEmitter, OnChanges, SimpleChange, QueryList } from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {noop, identity, parseNumber, onlyDigits, NUMBER_KEYS, filterNumericKeys, KEY_CODE} from './utils';


@Directive({ selector: '[my-multi-input-part]'})
export class MultiInputPartDirective {
  constructor(public renderer: Renderer, public el: ElementRef) {

  }

  focus() {
    this.renderer.invokeElementMethod(this.el.nativeElement, "focus");
  }

  setCursorPosition(position: number) {
    this.renderer.setElementProperty(this.el.nativeElement, "selectionStart",position);
    this.renderer.setElementProperty(this.el.nativeElement, "selectionEnd",position);
  }

}

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

    public getEl(): MultiInputPartDirective {
      return this.component;
    }

    public focus() {
        let el = this.getEl();
        el && el.focus();
    }

    public setCursorPosition(position: number) {
        let el = this.getEl();
        el && el.setCursorPosition(position);
    }
}

export abstract class MultiInputComponent implements ControlValueAccessor, Validator, AfterViewChecked {

  _parts: MultiInputPart[];
  _value: string;
  _errors: string[];
  _focused: boolean;

  @ViewChildren(MultiInputPartDirective) partCtrls: QueryList<MultiInputPartDirective>;
  ngAfterViewChecked() {
    let partCtrls = this.partCtrls.toArray();
    this.parts.forEach((part: MultiInputPart, index: number) => part.component = partCtrls[index]);
  }

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

  constructor(protected _renderer: Renderer, protected el: ElementRef) { }

  onKey(e: KeyboardEvent, index: number) {
      let el = <HTMLInputElement>e.target;
      if (el !== e.currentTarget || el.selectionStart !== el.selectionEnd) return;
      let keyCode: number = e.which || e.keyCode;
      let part: MultiInputPart = this.parts[index];
      if (keyCode === KEY_CODE.LEFT_ARROW) {
          if (el.selectionStart === 0 && index > 0) {
              e.preventDefault();
              let previous: MultiInputPart = this.parts[index - 1];
              let cursorPosition: number = previous.value ? previous.value.length : 0;
              previous.setCursorPosition(cursorPosition);
              previous.focus();
          }
      }
      else if (keyCode === KEY_CODE.RIGHT_ARROW) {
          if ((!part.value || el.selectionStart === part.value.length) && index < this.parts.length - 1) {
              e.preventDefault();
              let next: MultiInputPart = this.parts[index + 1];
              next.setCursorPosition(0);
              next.focus();
          }
      }
      else if (keyCode === KEY_CODE.BACKSPACE) {
          if (el.selectionStart === 0 && index > 0) {
              let previous: MultiInputPart = this.parts[index - 1];
              if (previous.value) {
                  previous.value = previous.value.slice(0, -1);
              }
              let cursorPosition: number = previous.value ? previous.value.length : 0;
              previous.setCursorPosition(cursorPosition);
              previous.focus();
              e.preventDefault();
          }
      }
      else if (part.value && part.isSizeValid() && el.selectionStart === part.value.length && index < this.parts.length - 1) {
          let next: MultiInputPart = this.parts[index+1];
          next.setCursorPosition(0);
          next.focus();
      }
  }

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
