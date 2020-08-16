import { Component, Element, Prop, State, h } from '@stencil/core';
import { ObserverAdmin } from '../../utils/observer-admin';

// Note - cannot use Host b/c Stencil components only define an HTMLElement interface but are not HTMLElements themselves.
@Component({
  tag: 'intersection-observer-sentinel',
  styleUrl: 'intersection-observer-sentinel.css',
  shadow: false,
})
export class IntersectionObserverSentinel {
  @Element() el: HTMLElement;

  @State() isVisible: boolean;

  @Prop() block: boolean;
  @Prop() sentinelId: string;
  @Prop() sentinelClass: string;
  @Prop() configOptions: object = {
    viewportTolerance: {}
  };
  @Prop() enterCallback: Function = () => {};
  @Prop() exitCallback: Function = () => {};

  private observerAdmin: ObserverAdmin = null;

  private registry = new WeakMap();

  componentDidLoad() {
    this.observerAdmin = new ObserverAdmin();
    const observerOptions = this.buildObserverOptions(this.configOptions);
    const element = this.el.firstElementChild as HTMLElement; // not XML

    const enterCallback = (...args) => {
      this.isVisible = true;
      this.enterCallback(...args);
    }

    this.setupIntersectionObserver(element, observerOptions, enterCallback, this.exitCallback);
  }

  disconnectedCallback() {
    this.registry = null;
    if (this.observerAdmin) {
      this.observerAdmin.destroy();
      this.observerAdmin = null;
    }
  }

  private setupIntersectionObserver(element: HTMLElement, observerOptions: object, enterCallback: Function, exitCallback: Function): void {
    this.addToRegistry(element, observerOptions);

    this.observerAdmin.add(
      element,
      observerOptions,
      enterCallback,
      exitCallback
    );
  }

  private buildObserverOptions(options): object {
    const domScrollableArea =
      typeof options.scrollableArea === 'string' ? document.querySelector(options.scrollableArea)
      : options.scrollableArea instanceof HTMLElement ? options.scrollableArea
      : undefined;

    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    // IntersectionObserver takes either a Document Element or null for `root`
    const { top = 0, left = 0, bottom = 0, right = 0 } = options.viewportTolerance;
    return {
      root: domScrollableArea,
      rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
      threshold: options.threshold
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
        content = <slot name="inner-content"></slot>;
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

      content = <div id={id} class={klass}><slot name="inner-content"></slot></div>;
    }

    return content
  }
}
