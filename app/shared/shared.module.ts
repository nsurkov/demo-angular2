import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CounterComponent }  from './counter.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ CounterComponent ]
})
export class SharedModule { }
