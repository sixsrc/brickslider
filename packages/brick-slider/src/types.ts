type Directions = "right" | "left"

export type DirectionType = Partial<
  Record<Directions, boolean | undefined>
> | null

export type TupleIndexesType = [number, number, number, number]
