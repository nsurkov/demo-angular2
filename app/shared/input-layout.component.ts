import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-input-layout',
  template: `
    <label>{{label}}</label>
    <div class="layout-row">
      <div class="input-wrapper">
        <ng-content></ng-content>
        <div *ngFor="let error of errors" class="error">{{error}}</div>
      </div>
      <p>{{note}}</p>
    </div>
  `
})
export class InputLayoutComponent {
  @Input() errors: string[];
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() note: string;
  @Input() name: string;
}
