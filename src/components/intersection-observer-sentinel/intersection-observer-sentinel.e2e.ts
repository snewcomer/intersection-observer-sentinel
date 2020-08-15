import { newE2EPage } from '@stencil/core/testing';

describe('intersection-observer-sentinel', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<intersection-observer-sentinel></intersection-observer-sentinel>');
    const element = await page.find('intersection-observer-sentinel');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<intersection-observer-sentinel></intersection-observer-sentinel>');
    const component = await page.find('intersection-observer-sentinel');
    const element = await page.find('intersection-observer-sentinel >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
