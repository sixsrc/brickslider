# Methods

## Initialization

### `init()`

Mounts the slider and initializes all interactive features.

```ts
slider.init()
```

## Navigation

### `next()` / `prev()`

Moves to the next or previous page.

```ts
slider.next()
slider.prev()
```

### `goTo(index)`

Moves to a specific page index.

```ts
slider.goTo(2)
```

## Lifecycle

### `destroy()`

Restores the original markup snapshot.

```ts
slider.destroy()
```

### `use(plugin)`

Attaches a plugin instance to the slider.

```ts
slider.use(new AccessibilityPlugin({ useKeyboardNavigation: true }))
```

## Events

### `mounted`

Fired when the slider DOM and layout are ready.

**Payload:** `{ rootSelector }`

```ts
slider.on("mounted", (rootSelector) => {
  console.log("Slider mounted:", rootSelector)
})
```

### `slideChange`

Fired whenever the active page changes.

**Payload:** `{ rootSelector, slideIndex, activePage }`

```ts
slider.on("slideChange", (payload) => {
  console.log(payload.slideIndex, payload.activePage)
})
```

### `destroyed`

Fired after the slider is torn down.

**Payload:** `{ rootSelector }`

```ts
slider.on("destroyed", (rootSelector) => {
  console.log("Slider destroyed:", rootSelector)
})
```

### Stories Events

When using the Stories plugin:

```ts
slider.on("storiesOpened", (rootSelector) => { ... })
slider.on("storiesMounted", (rootSelector) => { ... })
slider.on("storiesClosed", (rootSelector) => { ... })
```