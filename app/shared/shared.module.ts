import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputLayoutComponent }  from './input-layout.component';
import { CounterInputComponent }  from './counter-input.component';
import { InputComponent }  from './input.component';
import { MultiInputPartDirective }  from './multi-input.component';
import { PhoneInputComponent }  from './phone-input.component';
@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ InputLayoutComponent, CounterInputComponent, InputComponent, PhoneInputComponent, MultiInputPartDirective ],
  exports:      [ InputLayoutComponent, CounterInputComponent, InputComponent, PhoneInputComponent, MultiInputPartDirective ]
})
export class SharedModule { }
