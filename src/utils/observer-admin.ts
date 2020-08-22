import IntersectionObserverAdmin, { IOptions } from 'intersection-observer-admin';

/**
 * Static administrator to ensure use one IntersectionObserver per combination of root + observerOptions
 * Use `root` (viewport) as lookup property and weakly referenced
 * `root` will have many keys with each value being and object containing one IntersectionObserver instance and all the elements to observe
 * Provided callbacks will ensure consumer of this service is able to react to enter or exit of intersection observer
 * This provides important optimizations since we are not instantiating a new IntersectionObserver instance for every element and
 * instead reusing the instance.
 *
 * @class ObserverAdmin
 */
class ObserverAdmin {
  instance: IntersectionObserverAdmin;

  constructor() {
    this.instance = new IntersectionObserverAdmin();
  }

  /**
   * @method observe
   * @param HTMLElement element
   * @param Object observerOptions
   * @param Function enterCallback
   * @param Function exitCallback
   * @void
   */
  observe(element: HTMLElement, observerOptions: object, enterCallback: (data?: any) => void, exitCallback: (data?: any) => void): void {
    if (enterCallback) {
      this.addEnterCallback(element, enterCallback);
    }
    if (exitCallback) {
      this.addExitCallback(element, exitCallback);
    }

    return this.instance.observe(element, observerOptions);
  }

  addEnterCallback(element: HTMLElement, enterCallback: (data?: any) => void) {
    this.instance.addEnterCallback(element, enterCallback);
  }

  addExitCallback(element: HTMLElement, exitCallback: (data?: any) => void) {
    this.instance.addExitCallback(element, exitCallback);
  }

  /**
   * This method takes a target element, observerOptions and a the scrollable area.
   * The latter two act as unique identifiers to figure out which intersection observer instance
   * needs to be used to call `unobserve`
   *
   * @method unobserve
   * @param HTMLElement target
   * @param Object observerOptions
   * @void
   */
  unobserve(target: HTMLElement, options: IOptions) {
    this.instance.unobserve(target, options);
  }

  destroy() {
    this.instance.destroy();
  }
}

const observerAdmin = new ObserverAdmin();
export { observerAdmin };
