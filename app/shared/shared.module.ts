import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputLayoutComponent }  from './input-layout.component';
import { CounterInputComponent }  from './counter-input.component';
import { InputComponent }  from './input.component';
import { MultiInputPartDirective } from './multi-input-part.directive';
import { PhoneInputComponent }  from './phone-input.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [
    InputLayoutComponent, CounterInputComponent, InputComponent,
    MultiInputPartDirective, PhoneInputComponent
  ],
  exports:      [ InputLayoutComponent, CounterInputComponent, InputComponent, PhoneInputComponent ]
})
export class SharedModule { }
