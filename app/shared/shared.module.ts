import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CounterInputComponent }  from './counter-input.component';
import { InputComponent }  from './input.component';
import { MultiInputComponent }  from './multi-input.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ CounterInputComponent, InputComponent, MultiInputComponent ],
  exports:      [ CounterInputComponent, InputComponent, MultiInputComponent ]
})
export class SharedModule { }
