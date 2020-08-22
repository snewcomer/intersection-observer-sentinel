![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

[IntersectionObservers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) will observe elements off the main thread.  Versus Events that reacts synchronously to every occurance of the Event, Observers behave asynchronously.

Depends on [intersection-observer-admin](https://github.com/snewcomer/intersection-observer-admin) for reusing the same IntersectionObserver.

## Polyfill

For IE and older versions of Safari, you can include this polyfill in your script tags.

<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>

## Usage

1. Lazy loading lists of items
2. Lazy loading artwork. However, use [`laoding="lazy"`](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) for images when possible.
3. Metrics and observing DOM elements needed for background jobs

### Lazy loading large lists

Often when loading large lists of items, we want to lazy load more items when we reach the bottom of the list.

```html
<ul>
 ...
</ul>
<intersection-observer-sentinel id="load-more">
  <div>
    <h4>Loading</h4>
  </div>
</intersection-observer-sentinel>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    let endSentinel = document.querySelector('intersection-observer-sentinel[id="load-more"]');
    endSentinel.addEventListener('enter', () => {
      loadMore();
    });
  });
</script>
```

### Block form

Images are a common way to save Time to First Paint. When this web component comes into view, it will render the inner contents to the page.

```html
<intersection-observer-sentinel block="true">
  <img src="https://url" />
</intersection-observer-sentinel>
```

This has one drawback - it loads the image, thus adding a new container with width/height to your page, potentially thrashing your layout.

### Lazy Loading Images

  - API -
    - configOptions: { scrollableArea?: string, threshold?: number, viewportTolerance?: object }
    - enterCallback: Function
    - exitCallback: Function

Unlike the last example, we render the `<img>` element to avoid layout thrashing.

```html
<intersection-observer-sentinel class="artwork">
  <img data-src="https://url" style="background-color: gray;" height="200" width="200" />
</intersection-observer-sentinel>
<intersection-observer-sentinel class="artwork">
  <img data-src="https://url" style="background-color: gray;" height="200" width="200" />
</intersection-observer-sentinel>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    let webComponents = Array.from(document.querySelectorAll('intersection-observer-sentinel'));
    webComponents.forEach((component) => {
      // attach enterCallback
      component.bottom = 100;
      artwork.addEventListener('enter', ({ detail: { target } }) => {
        target.src = target.getAttribute('data-src');
      });
      artwork.addEventListener('exit', ({ detail: { target } }) => {
        target.src = target.getAttribute('data-src');
      });
    })
  });
</script>
```

## Getting Started

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```


## Using this component

There are three strategies we recommend for using web components built with Stencil.

The first step for all three of these strategies is to [publish to NPM](https://docs.npmjs.com/getting-started/publishing-npm-packages).

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/intersection-observer-sentinel@0.0.1/dist/intersection-observer-sentinel.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install intersection-observer-sentinel --save`
- Put a script tag similar to this `<script src='node_modules/intersection-observer-sentinel/dist/intersection-observer-sentinel.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

## [**IntersectionObserver**'s Browser Support](https://platform-status.mozilla.org/)

### Out of the box

<table>
    <tr>
        <td>Chrome</td>
        <td>51 <sup>[1]</sup></td>
    </tr>
    <tr>
        <td>Firefox (Gecko)</td>
        <td>55 <sup>[2]</sup></td>
    </tr>
    <tr>
        <td>MS Edge</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Internet Explorer</td>
        <td>Not supported</td>
    </tr>
    <tr>
        <td>Opera <sup>[1]</sup></td>
        <td>38</td>
    </tr>
    <tr>
        <td>Safari</td>
        <td>Safari Technology Preview</td>
    </tr>
    <tr>
        <td>Chrome for Android</td>
        <td>59</td>
    </tr>
    <tr>
        <td>Android Browser</td>
        <td>56</td>
    </tr>
    <tr>
        <td>Opera Mobile</td>
        <td>37</td>
    </tr>
</table>

* [1] [Reportedly available](https://www.chromestatus.com/features/5695342691483648), it didn't trigger the events on initial load and lacks `isIntersecting` until later versions.
* [2] This feature was implemented in Gecko 53.0 (Firefox 53.0 / Thunderbird 53.0 / SeaMonkey 2.50) behind the preference `dom.IntersectionObserver.enabled`.

