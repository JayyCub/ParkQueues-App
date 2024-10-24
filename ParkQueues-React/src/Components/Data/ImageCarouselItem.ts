import type React from 'react'

export class ImageCarouselItem {
  id: any
  title: any
  view: React.JSX.Element | undefined | null

  constructor (id: any, title: any, view: React.JSX.Element | undefined | null) {
    this.id = id
    this.title = title
    this.view = view
  }
}
