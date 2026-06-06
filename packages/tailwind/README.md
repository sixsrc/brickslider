# `@sixsrc/brickslider-tailwind`

Plugin estrutural do BrickSlider para Tailwind CSS.

Ele abstrai as classes base de layout do slider sem impor tema visual.
Ou seja: o plugin resolve a estrutura e o usuário estiliza o visual final.

## Instalação

```bash
pnpm add @sixsrc/brickslider @sixsrc/brickslider-tailwind tailwindcss
```

## Uso com Tailwind v4

```css
@import "tailwindcss";
@import "@sixsrc/brickslider-tailwind/preset.css";
@plugin "@sixsrc/brickslider-tailwind";
```

O `preset.css` faz parte da integração do pacote em ambiente Tailwind.
Ele ajuda a expor as classes do BrickSlider no fluxo de desenvolvimento e o
plugin continua sendo o responsável pelas regras estruturais do slider.

## Classes disponibilizadas

- `bs-root`
- `bs-track`
- `bs-container`
- `bs-slide`
- `bs-dots`
- `bs-dot`
- `bs-arrow`
- `bs-prev`
- `bs-next`
- `bs-hidden`
- `bs-peek`
- `bs-peek-sm`
- `bs-peek-lg`

As classes `bs-peek`, `bs-peek-sm` e `bs-peek-lg` são opcionais e devem ser aplicadas no elemento `bs-track`.

- `bs-peek-sm` = `48px` por lado
- `bs-peek` = `80px` por lado
- `bs-peek-lg` = `120px` por lado

## Exemplo de active state

```css
.active > .bs-content {
  @apply border border-violet-800 rounded-lg;
}

.bs-dot--active {
  @apply bg-violet-800 border border-violet-800;
}
```

## Navegação por arrows

Use `bs-arrow` como classe base e adicione:

- `bs-prev` para o botão anterior
- `bs-next` para o botão próximo

## `slideSizes` no responsivo

O `slideSizes` global funciona como fallback.

Prioridade:

- `responsive[breakpoint].useSlideSizes === false` → ignora todo `slideSizes`
- `responsive[breakpoint].slideSizes` → sobrescreve o global
- `slideSizes` global → fallback

Exemplo:

```ts
{
  slideSizes: {
    0: 70,
    1: 15,
    2: 15
  },
  responsive: {
    xs: {
      slidesPerView: 1,
      slidesPerPage: 1,
      useSlideSizes: false
    },
    lg: {
      slidesPerView: 4,
      slidesPerPage: 4
    }
  }
}
```

`useSlideSizes: true` é desnecessário, porque `slideSizes` já é implicitamente ativo.

## Sem Tailwind

Se o usuário não quiser Tailwind, ele pode usar o mesmo markup `bs-*`
e importar a versão CSS pura disponível no pacote de slider:

- `packages/slider/examples/css/brick-slider.css`

## Desenvolvimento no monorepo

No demo local deste repositório, o plugin é carregado assim:

```css
@import "../../../tailwind/src/preset.css";
@plugin "../../../tailwind/src/index.ts";
```
