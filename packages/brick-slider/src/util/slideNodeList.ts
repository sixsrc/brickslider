import { getAllElements, getChildren } from "@/dom"
import { childrenSelector } from "./constants"

export const slideNodeList = ($root: string) =>
  Array.from(
    getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren($root))
  )
