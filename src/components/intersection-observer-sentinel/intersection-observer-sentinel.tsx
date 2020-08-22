import { Component, Element, Event, Prop, State, h } from '@stencil/core';
import { observerAdmin } from '../../utils/observer-admin';
import { EventEmitter } from 'events';

// Note - cannot use Host b/c Stencil components only define an HTMLElement interface but are not HTMLElements themselves.
@Component({
  tag: 'intersection-observer-sentinel',
  styleUrl: 'intersection-observer-sentinel.css',
  shadow: false,
})
export class IntersectionObserverSentinel {
  @Element() el: HTMLElement;

  @State() isVisible: boolean;

  @Event() enter: EventEmitter;
  @Event() exit: EventEmitter;

  @Prop() once: boolean;
  @Prop() block: boolean;
  @Prop() sentinelId: string;
  @Prop() sentinelClass: string;
  @Prop() bottom?: number;
  @Prop() left?: number;
  @Prop() right?: number;
  @Prop() top?: number;
  @Prop() scrollableArea?: string | HTMLElement;
  @Prop() threshold?: number;

  private registry = new WeakMap();
  private hasBeenCalled = false;

  private get _scrollableArea(): string | HTMLElement | undefined {
    const { scrollableArea } = this;

    if (typeof scrollableArea === 'string') {
      return document.querySelector(scrollableArea) as HTMLElement;
    }

    if (scrollableArea instanceof HTMLElement) {
      return scrollableArea;
    }
  }

  componentDidLoad() {
    const observerOptions = this.buildObserverOptions();
    const element = this.el.firstElementChild as HTMLElement; // not XML

    this.setupIntersectionObserver(element, observerOptions, this.enterCallback, this.exitCallback);
  }

  enterCallback = (data?: any) => {
    this.isVisible = true;
    if (this.hasBeenCalled && this.once) {
      // TODO: consider removing
      this.unobserveIntersectionObserver(data.target);
      return;
    }

    this.enter.emit(data);
    this.hasBeenCalled = true;
  };

  exitCallback = (data?: any) => {
    // be careful with exit callbacks. They are ran when inserted (but are out of viewport)
    this.exit.emit(data);
  };

  componentDidUnload() {
    this.registry = null;
  }

  private setupIntersectionObserver(element: HTMLElement, observerOptions: object, enterCallback: (data?: any) => void, exitCallback: (data?: any) => void): void {
    this.addToRegistry(element, observerOptions);

    observerAdmin.observe(element, observerOptions, enterCallback, exitCallback);
  }

  private buildObserverOptions(): object {
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0, threshold = 0, _scrollableArea } = this;
    return {
      root: _scrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: threshold,
    };
  }

  /**
   * In order to track elements and the state that comes with them, we need to keep track
   * of elements in order to get at them at a later time, specifically to unobserve
   *
   * @method addToRegistry
   * @void
   */
  private addToRegistry(element: HTMLElement, observerOptions: object): void {
    if (this.registry) {
      this.registry.set(element, { observerOptions });
    }
  }

  private unobserveIntersectionObserver(target): void {
    if (target) {
      const registeredTarget = this.registry.get(target as HTMLElement);
      if (typeof registeredTarget === 'object') {
        observerAdmin.unobserve(
          target,
          registeredTarget.observerOptions
        );
      }
    }
  }

  render() {
    let content;
    if (this.block) {
      if (this.isVisible) {
        content = <slot></slot>;
      }
    } else {
      let id = '';
      if (this.sentinelId) {
        id += ` ${this.sentinelId}`;
      }

      let klass = 'intersection-observer-sentinel';
      if (this.sentinelClass) {
        klass += ` ${this.sentinelClass}`;
      }

      content = (
        <div id={id} class={klass}>
          <slot></slot>
        </div>
      );
    }

    return content;
  }
}
