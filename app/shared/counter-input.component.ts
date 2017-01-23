import { Component, OnInit, forwardRef, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import {noop} from './utils';

@Component({
  selector: 'my-counter-input',
  template: `<button (click)="inc()">+</button>{{counter}}<button (click)="dec()">-</button>`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CounterInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CounterInputComponent), multi: true }
  ]
})
export class CounterInputComponent implements ControlValueAccessor, Validator, OnChanges {

  counter: number = 0;
  @Input() max: number | string;
  @Input() min: number | string;
  @Input() disabled: boolean;
  @Input()
  get value() {
    return this.counter;
  }
  set value(value: number | any) {
    this.counter = value || 0;
  }

  @Output() valueChange = new EventEmitter<number>();

  private emitValueChange() {
    this.onChanged(this.value);
    this.valueChange.emit(this.value);
  }

  inc(): void {
    this.counter++;
    this.emitValueChange();
  }

  dec(): void {
    this.counter--;
    this.emitValueChange();
  }

  //OnChanges
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if(changes["max"] != null || changes["min"] != null) {
      this.validateFn = (ctrl: AbstractControl) => {
        let errors = {};
        let given = ctrl.value;
        let max = +this.max;
        let min = +this.min;
        if((max != null && given > max) || (min != null && given < min)) {
          errors["range"] = {
            given: given,
            max: max,
            min: min
          };
          return errors;
        }
        return undefined;
      };
      this.onValidatorChange();
    }
  }

  //Validator
  validateFn: Function = noop;

  validate(ctrl: AbstractControl) : {[key: string]: any} {
    return this.validateFn(ctrl);
  }

  onValidatorChange: Function = noop;

  registerOnValidatorChange(fn: () => void) : void {
    this.onValidatorChange = fn;
  }

  //ControlValueAccessor
  onChanged: Function = noop;
  onTouched: Function = noop;
  writeValue(value: any) : void {
      this.value = value;
  }
  registerOnChange(fn: (_: any) => void) : void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: () => void) : void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean) : void {
    this.disabled = isDisabled;
  }
}
