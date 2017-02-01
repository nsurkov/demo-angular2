import {
  Directive, Input, ElementRef, Renderer, HostListener
} from '@angular/core';

import {
  MultiInputPart, MultiInputComponent
} from './multi-input.component';

import {
  KEY_CODE
} from './utils';

@Directive({ selector: '[myMultiInputPart]'})
export class MultiInputPartDirective {
  constructor(
    public renderer: Renderer,
    public el: ElementRef,
    protected parent: MultiInputComponent
  ) {
    this.parts = parent.parts;
  }

  parts: MultiInputPart[];

  _index: number;
  @Input("myMultiInputPart")
  get index(){
    return this._index;
  }
  set index( index: number) {
      this._index = index;
      this.parts[index].component = this;
  }

  focus() {
    this.renderer.invokeElementMethod(this.el.nativeElement, "focus");
  }

  setCursorPosition(position: number) {
    this.renderer.setElementProperty(this.el.nativeElement, "selectionStart",position);
    this.renderer.setElementProperty(this.el.nativeElement, "selectionEnd",position);
  }

  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent) {
      let index = this.index;
      let el = <HTMLInputElement>e.target;
      if (el !== e.currentTarget || el.selectionStart !== el.selectionEnd) return;
      let keyCode: number = e.which || e.keyCode;
      let part: MultiInputPart = this.parts[index];
      if (keyCode === KEY_CODE.LEFT_ARROW) {
          if (el.selectionStart === 0 && index > 0) {
              e.preventDefault();
              let previous: MultiInputPart = this.parts[index - 1];
              let cursorPosition: number = previous.value ? previous.value.length : 0;
              previous.setCursorPosition(cursorPosition);
              previous.focus();
          }
      }
      else if (keyCode === KEY_CODE.RIGHT_ARROW) {
          if ((!part.value || el.selectionStart === part.value.length) && index < this.parts.length - 1) {
              e.preventDefault();
              let next: MultiInputPart = this.parts[index + 1];
              next.setCursorPosition(0);
              next.focus();
          }
      }
      else if (keyCode === KEY_CODE.BACKSPACE) {
          if (el.selectionStart === 0 && index > 0) {
              let previous: MultiInputPart = this.parts[index - 1];
              if (previous.value) {
                  previous.value = previous.value.slice(0, -1);
              }
              let cursorPosition: number = previous.value ? previous.value.length : 0;
              previous.setCursorPosition(cursorPosition);
              previous.focus();
              e.preventDefault();
          }
      }
      else if (part.value && part.isSizeValid() && el.selectionStart === part.value.length && index < this.parts.length - 1) {
          let next: MultiInputPart = this.parts[index+1];
          next.setCursorPosition(0);
          next.focus();
      }
  }

}
