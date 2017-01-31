import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, NgModel, FormGroup } from '@angular/forms';

@Component({
  selector: 'my-app',
  template: `
<div>
  <h2>Input control</h2>
  <div>
    <h3>As phone</h3>
    <my-phone-input name="text-input"
      [(ngModel)]="phoneInputValue"
      type="text"
      #phone_ctrl="ngModel"
      required
      [label]="'Text input'"
      ></my-phone-input>
    <p>{{ phoneInputValue }}</p>
    <p>Is valid? {{ phone_ctrl.valid }}</p>
  </div>

  <div>
    <h3>As number</h3>
    <my-input name="number-input"
      [(ngModel)]="numberInputValue"
      type="number"
      #num_ctrl="ngModel"
      required
      [label]="'Number input'"
      [errors]="displayErrors(num_ctrl)"
      note="hello"
      ></my-input>
    <p>{{ numberInputValue }}</p>
    <p>Is valid? {{ num_ctrl.valid }}</p>
    <pre>{{ err | json }}</pre>
  </div>
  <div>
    <h3>As text</h3>
    <my-input name="text-input"
      [(ngModel)]="textInputValue"
      type="text"
      #text_ctrl="ngModel"
      required
      [label]="'Text input'"
      ></my-input>
    <p>{{ textInputValue }}</p>
    <p>Is valid? {{ text_ctrl.valid }}</p>
  </div>
  <div>
    <h3>As text area</h3>
    <my-input name="text-area"
      [(ngModel)]="textAInputValue"
      type="textarea"
      #textA_ctrl="ngModel"
      required
      [label]="'Text area input'"
      ></my-input>
    <p>{{ textAInputValue }}</p>
    <p>Is valid? {{ textA_ctrl.valid }}</p>
  </div>
  </div>
<div>
  <h2>Counter input control</h2>
  <h3>Parameters</h3>
  <div>
  <div>
    <label>Min value:</label>
    <input [(ngModel)]="minValue">
  </div>
  <div>
    <label>Max value:</label>
    <input [(ngModel)]="maxValue">
  </div>
  </div>

  <h3>Inside Form</h3>
  <form [formGroup]="form">
    <div>
      <label>Tune value:</label>
      <my-counter-input
        formControlName="counter"
        [max]="maxValue"
        [min]="minValue"
      ></my-counter-input>
    </div>
    <div>
      <p *ngIf="!form.valid">Form invalid value</p>
      <p *ngIf="form.valid">Form valid value</p>
      <pre>{{ form.value | json }}</pre>
    </div>
  </form>

  <h3>Standalone</h3>
  <div>
    <label>Tune value:</label>
    <my-counter-input
      [max]="maxValue"
      [min]="minValue"
      [(value)]="counterValue"
    ></my-counter-input>
  </div>
  <div>
    <p>{{ counterValue }}</p>
  </div>
  </div>
  `
})
export class AppComponent  implements OnInit, AfterViewInit {
  form:FormGroup;
  counterValue: number = 10;
  minValue: number = 0;
  maxValue:number = 12;
  textInputValue: string ="";
  textAInputValue: string ="";
  phoneInputValue: string = "";
  numberInputValue: number;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}
  displayErrors(ngModel: NgModel): string[] {
    let errors: string[] = [];
    errors = ngModel.valid ? ["Valid"]:["Invalid"];
    return errors;
  }
  ngOnInit() {
    this.form = this.fb.group({
      counter: this.counterValue
    });
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

}
