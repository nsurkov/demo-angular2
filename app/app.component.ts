import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'my-app',
  template: `

  <h2>Parameters</h2>
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

  <h2>Inside Form</h2>
  <form [formGroup]="form">
    <div>
      <label>Tune value:</label>
      <counter-input
        formControlName="counter"
        [max]="maxValue"
        [min]="minValue"
      ></counter-input>
    </div>
    <div>
      <p *ngIf="!form.valid">Form invalid value</p>
      <p *ngIf="form.valid">Form valid value</p>
      <pre>{{ form.value | json }}</pre>
    </div>
  </form>

  <h2>Standalone</h2>
  <div>
    <label>Tune value:</label>
    <counter-input
      [max]="maxValue"
      [min]="minValue"
      [(value)]="counterValue"
    ></counter-input>
  </div>
  <div>
    <p>{{ counterValue }}</p>
  </div>
  `
})
export class AppComponent  implements OnInit {
  form:FormGroup;
  counterValue: number = 10;
  minValue: number = 0;
  maxValue:number = 12;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      counter: this.counterValue
    });
  }

}
