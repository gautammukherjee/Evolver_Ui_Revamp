import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickDirective]'
})
export class ClickDirectiveDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') OnMouseEnter() {
    this.renderer.addClass(this.element.nativeElement, 'highlight-test');
    // this.renderer.setStyle(this.element.nativeElement, 'padding', '2px 12px');
    // this.renderer.setStyle(this.element.nativeElement, 'transition', '0.2s');

  }

  @HostListener('mouseout') onMouseOut() {
    this.renderer.removeClass(this.element.nativeElement, 'highlight-test');
    // this.renderer.setStyle(this.element.nativeElement, 'padding', '0px 10px');
    // this.renderer.setStyle(this.element.nativeElement, 'transition', '0.2s');

  }

}
