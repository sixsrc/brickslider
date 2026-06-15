# Events

## Core Events

### `mounted`

Fired when the slider DOM and layout are ready.

**Payload:** `{ rootSelector }`

```ts
slider.on("mounted", rootSelector => {
  console.log("Slider mounted:", rootSelector)
})
```

### `slideChange`

Fired whenever the active page changes.

**Payload:** `{ rootSelector, slideIndex, activePage }`

```ts
slider.on("slideChange", payload => {
  console.log(payload.slideIndex, payload.activePage)
})
```

### `destroyed`

Fired after the slider is torn down.

**Payload:** `{ rootSelector }`

```ts
slider.on("destroyed", rootSelector => {
  console.log("Slider destroyed:", rootSelector)
})
```

## Stories Events

When using the Stories plugin:

### `storiesOpened`

```ts
slider.on("storiesOpened", rootSelector => {
  console.log("Stories opened:", rootSelector)
})
```

### `storiesMounted`

```ts
slider.on("storiesMounted", rootSelector => {
  console.log("Stories mounted:", rootSelector)
})
```

### `storiesClosed`

```ts
slider.on("storiesClosed", rootSelector => {
  console.log("Stories closed:", rootSelector)
})
```
