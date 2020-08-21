import { Component, Element, Event, Prop, State, h } from '@stencil/core';
import { ObserverAdmin } from '../../utils/observer-admin';
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

  @Prop() once: boolean;
  @Prop() block: boolean;
  @Prop() sentinelId: string;
  @Prop() sentinelClass: string;
  @Prop() configOptions: object = {
    viewportTolerance: {},
  };
  @Event() enter: EventEmitter;
  @Event() exit: EventEmitter;

  private observerAdmin: ObserverAdmin = null;

  private registry = new WeakMap();
  private hasBeenCalled = false;

  componentDidLoad() {
    this.observerAdmin = new ObserverAdmin();
    const observerOptions = this.buildObserverOptions(this.configOptions);
    const element = this.el.firstElementChild as HTMLElement; // not XML

    this.setupIntersectionObserver(element, observerOptions, this.enterCallback, this.exitCallback);
  }

  enterCallback = (data?: any) => {
    this.isVisible = true;
    if (this.hasBeenCalled && this.once) {
      return;
    }

    this.enter.emit(data);
  };

  exitCallback = (data?: any) => {
    this.exit.emit(data);
  };

  disconnectedCallback() {
    this.registry = null;
    if (this.observerAdmin) {
      this.observerAdmin.destroy();
      this.observerAdmin = null;
    }
  }

  private setupIntersectionObserver(element: HTMLElement, observerOptions: object, enterCallback: Function, exitCallback: Function): void {
    this.addToRegistry(element, observerOptions);

    this.observerAdmin.add(element, observerOptions, enterCallback, exitCallback);
  }

  private buildObserverOptions(options): object {
    const domScrollableArea =
      typeof options.scrollableArea === 'string'
        ? document.querySelector(options.scrollableArea)
        : options.scrollableArea instanceof HTMLElement
        ? options.scrollableArea
        : undefined;

    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0 } = options.viewportTolerance;
    return {
      root: domScrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: options.threshold,
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
