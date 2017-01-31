import {
  Component, OnInit, AfterViewInit, forwardRef, Input, Output, ViewChildren, ElementRef, Renderer,
  HostBinding, HostListener, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {noop, identity, parseNumber, NUMBER_KEYS, filterNumericKeys, KEY_CODE} from './utils';

/*
@Directive({ selector: '[my-multi-input-part]'})
export class MultiInputPartDirective { }
export class MultiInputPart {

    public name: string;
    public value: string;
    public size: number;

    public getInputType(disabled: boolean): string {
        return "text";
    }

    public isSizeValid(): boolean {
        if (!this.value) return false;
        return angular.isUndefined(this.size) || (this.value && this.value.length === this.size);
    }

    public hasOnlyDigits(): boolean {
        return !this.value;// || validateOnlyDigits(this.value);
    }

    public querySelector: () => HTMLInputElement;

    public getEl(): HTMLInputElement {
      return this.querySelector && this.querySelector();
    }

    public focus() {
        let el: HTMLInputElement = this.getEl();
        el && el.focus();
    }

    public setCursorPosition(position: number) {
        let el: HTMLInputElement = this.getEl();
        if (el) {
            el.selectionStart = position;
            el.selectionEnd = position;
        }
    }
}

export abstract class MultiInputComponent implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  _parts: MultiInputPart[];
  _value: string;
  _errors: string[];
  _focused: boolean;

  @ViewChildren(MultiInputPartDirective) partCtrls: QueryList<MultiInputPartDirective>;
  ngAfterViewInit() {
    this.parts.forEach((part: MultiInputPart, index: number) => {
      part.querySelector = () => <HTMLInputElement>this.partCtrls[index];
    });
  }

  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() note: string;
  @Input() name: string;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this._parts = this.map(value);
  }
  get parts() {
    return this._parts;
  }
  set parts(parts: MultiInputPart[]) {
    this._value = this.reduce(parts);
    this.onChangedFn(this.value);
    this.valueChange.emit(this.value);
  }

  public abstract map(value: string): MultiInputPart[];

  public abstract reduce(parts: MultiInputPart[]): string;

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
  @Output() valueChange = new EventEmitter<number | string>();
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
    if (e.relatedTarget && this.el.has(e.relatedTarget).length > 0) return;
    this.focused = false;
    this.onTouchedFn();
    this.blur.emit(e);
  }

  onFocus(event:FocusEvent) {
    this.focused = true;
    this.focus.emit(event);
  }

  onChange(event: Event) {}

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

//phone input
export class AreaCodeNumber extends MultiInputPart {
    public name = "areaCode";
    public size = 3;
}

export class PrefixNumber extends MultiInputPart {
    public name = "prefix";
    public size = 3;
}

export class LineNumber extends MultiInputPart {
    public name = "lineNumber";
    public size = 4;
}

export class ExtensionNumber extends MultiInputPart {
    public name = "extension";
    public size = 6;
    public isSizeValid(): boolean {
        // can't exceed the max length, but can be any length up to maxlength (including null)
        return this.size === undefined || !this.value || this.value.length <= this.size;
    }
}
const PhoneNumberType = {
  Home:"home",
  Work:"Work"
}

@Component({
  selector: 'my-multi-input',
  template: `
    <my-input-layout [label]="label" [errors]="errors" [note]="note" [disabled]="disabled">
      <div>
        <template ngFor let-p [ngForOf]="parts" let-idx="index">
          <input my-multi-input-part
            [attr.maxlength]="p.size"
            [attr.name]="p.name"
            [readonly]="readonly"
            [required]="required"
            [disabled]="disabled"
            [type]="{{p.getInputType(d.disabled)}}"
            [(ngModel)]="p.value"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (change)="onChange($event)"
            (keydown)="onKey($event, idx)">
          <span></span>
        </template>
      </div>
    </my-input-layout>
  `,
  host: {'[class.my-focused]': 'focused', '(click)': 'onClick()'},
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PhoneInputComponent), multi: true }
  ]
})
export class PhoneInputComponent extends MultiInputComponent {
  _type: string;
  @Input()
  get type() {
    return this._type;
  }
  set type(type: string) {
    this._type = type || PhoneNumberType.Home;
    if (this.isOffice()) {
        if (this.parts.length === 3) {
            let part = new ExtensionNumber();
            this.preparePart(part);
            this.parts.push(part);
        }
        else if (this.parts.length !== 4) {
            throw "Unexpected phone parts count";
        }
    }
    else if (this.parts.length === 4) {
        this.parts.splice(3, 1);
    }
    else if (this.parts.length !== 3) {
        throw "Unexpected phone parts count";
    }
  }
  constructor(_renderer: Renderer, el: ElementRef) {
        super(_renderer, el);
        this._parts = [new AreaCodeNumber(), new PrefixNumber(), new LineNumber()];
  }

    public format(modelValue: string): IMapStringTo<string> {
        if (modelValue) {
            if (ClnUtils.isString(modelValue)) modelValue = formatPhone(modelValue);
            let parts: string[] = modelValue.replace(/\s/g, "").split("-");
            if (parts.length === 3) {
                let subparts: string[] = parts[2].split("x");
                if (subparts.length === 2) {
                    return {
                        "areaCode": parts[0],
                        "prefix": parts[1],
                        "lineNumber": subparts[0],
                        "extension": subparts[1]
                    }
                }
                else if (subparts.length === 1) {
                    return {
                        "areaCode": parts[0],
                        "prefix": parts[1],
                        "lineNumber": parts[2],
                        "extension": ""
                    }
                }
            }

        }
        return {
            "areaCode": "",
            "prefix": "",
            "lineNumber": "",
            "extension": ""
        };
    }
    public parse(viewValue: IMapStringTo<string>): string {
        if (this.isEmpty(viewValue)) {
            return "";
        }
        let phoneNumber: string = `${str(viewValue["areaCode"])}-${str(viewValue["prefix"])}-${str(viewValue["lineNumber"])}`;
        if (this.isOffice() && viewValue["extension"]) {
            return phoneNumber + `x${str(viewValue["extension"])}`;
        }
        return phoneNumber;
    }
    public isOffice(): boolean {
        return this.phoneType === PhoneNumberType.Work;
    }
    public setPhoneType(phoneType: string, silent: boolean = false): void {
        this.phoneType = phoneType;


    }
}
*/
