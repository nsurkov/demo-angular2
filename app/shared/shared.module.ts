import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CounterInputComponent }  from './counter-input.component';
import { MultiInputComponent }  from './multi-input.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ CounterInputComponent, MultiInputComponent ],
  exports:      [ CounterInputComponent, MultiInputComponent ]
})
export class SharedModule { }
