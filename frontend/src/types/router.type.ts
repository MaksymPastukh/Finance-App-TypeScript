export type RouterType = {
  route: string,
  title: string,
  template: string,
  styles: string,
  layout: string | false,
  load(): void
}