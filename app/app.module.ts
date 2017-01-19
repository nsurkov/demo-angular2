import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';
//import { SharedModule }  from './shared/shared.module';

import { CounterComponent }  from './shared/counter.component';
@NgModule({
  imports:      [ BrowserModule,  CommonModule, FormsModule, ReactiveFormsModule /*, SharedModule*/ ],
  declarations: [ AppComponent, CounterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
