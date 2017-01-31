import {
  Component, OnInit, AfterViewInit, forwardRef, Input, Output, ViewChildren, ElementRef, Renderer,
  HostBinding, HostListener, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import {
  AbstractControl, ControlValueAccessor, Validator,
  NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import {noop, identity, parseNumber, formatPhone, NUMBER_KEYS, filterNumericKeys, KEY_CODE} from './utils';
import {MultiInputPart, MultiInputComponent} from './multi-input.component';

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
  selector: 'my-phone-input',
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
            [type]="p.getInputType(disabled)"
            [(ngModel)]="p.value"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (ngModelChange)="onChange($event)"
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
export class PhoneInputComponent extends MultiInputComponent implements OnChanges {

  _type: string = PhoneNumberType.Home;

  @Input()
  get type() {
    return this._type;
  }
  set type(type: string) {
    this._type = type || PhoneNumberType.Home;
  }

  isOffice(): boolean {
    return this.type === PhoneNumberType.Work;
  }

  constructor(_renderer: Renderer, el: ElementRef) {
    super(_renderer, el);
  }

  //OnChanges
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    let typeChange = changes["type"];
    if(typeChange){
      this.invalidateParts();
      this.commitIfHasChanges();
    }
  }

  map(value: string): MultiInputPart[] {
      let _parts = [new AreaCodeNumber(), new PrefixNumber(), new LineNumber()];
      let isOffice = this.isOffice();
      isOffice && _parts.push(new ExtensionNumber());
      if (value) {
          value = formatPhone(value);
          let parts: string[] = value.replace(/\s/g, "").split("-");
          if (parts.length === 3) {
            _parts[0].value = parts[0];
            _parts[1].value = parts[1];
            let subparts: string[] = parts[2].split("x");
            _parts[2].value = subparts[0];
            if (isOffice && subparts.length === 2) {
              _parts[3].value = subparts[1];
            }
        }
      }
      return _parts;
  }

  reduce(parts: MultiInputPart[]): string {
    if (parts.every(p=>!p.value)) return "";
    let value = `${parts[0].value}-${parts[1].value}-${parts[2].value}`;
    if (this.isOffice() && parts[3].value) {
      return value + `x${parts[3].value}`;
    }
    return value;
  }

}
