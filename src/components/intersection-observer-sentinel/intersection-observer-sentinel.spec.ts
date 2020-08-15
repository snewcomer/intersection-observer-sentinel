import { newSpecPage } from '@stencil/core/testing';
import { IntersectionObserverSentinel } from './intersection-observer-sentinel';

describe('intersection-observer-sentinel', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [IntersectionObserverSentinel],
      html: '<intersection-observer-sentinel></intersection-observer-sentinel>',
    });
    expect(root).toEqualHtml(`
      <intersection-observer-sentinel>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </intersection-observer-sentinel>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [IntersectionObserverSentinel],
      html: `<intersection-observer-sentinel first="Stencil" last="'Don't call me a framework' JS"></intersection-observer-sentinel>`,
    });
    expect(root).toEqualHtml(`
      <intersection-observer-sentinel first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </intersection-observer-sentinel>
    `);
  });
});
