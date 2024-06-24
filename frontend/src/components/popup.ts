export class Popup {
  readonly popupElement: HTMLElement | null
  readonly popupContent: HTMLElement | null
  readonly popupTextElement: HTMLElement | null
  readonly popupButtonElement: HTMLElement | null
  readonly buttonCancel: HTMLElement | null

  constructor() {
    this.popupElement = document.getElementById('popup');
    this.popupContent = document.getElementById('popup-content');
    this.popupTextElement = document.getElementById('popup-text');
    this.popupButtonElement = document.getElementById('popup-button');
    this.buttonCancel = document.getElementById('button-cancel');
  }

  public show(): void {
    if (this.popupElement) {
      this.popupElement.classList.remove('hide');
      document.body.style.overflow = 'hidden';
    }
  }

  public hide(): void {
    if (this.popupElement) {
      this.popupElement.classList.add('hide');
      this.popupElement.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  public reset(): void {
    if (this.popupTextElement)
      while (this.popupTextElement.firstChild) {
        this.popupTextElement.removeChild(this.popupTextElement.firstChild);
      }

    if (this.popupButtonElement)
      while (this.popupButtonElement.firstChild) {
        this.popupButtonElement.removeChild(this.popupButtonElement.firstChild);
      }

    if (this.popupContent) {
      this.popupContent.style.cssText = '';
      let childElements: HTMLCollection = this.popupContent.children;
      for (let i: number = 0; i < childElements.length; i++) {
        const childElement: HTMLElement | null = childElements[i] as HTMLElement
        childElement.style.cssText = '';
      }
    }
  }

  public targetCloseModal(): void {
    if (this.popupElement) {
      this.popupElement.addEventListener('click', (e) => {
        if (e.target === this.popupElement) {
          this.reset()
          this.hide()
        }
      })
    }

    document.addEventListener('keydown', (e) => {
      if (this.popupElement) {
        if (e.code === 'Escape' && this.popupElement.classList.contains('show')) {
          this.reset()
          this.hide()
        }
      }
    })

    if (this.buttonCancel) {
      this.buttonCancel.addEventListener('click', () => {
        this.reset()
        this.hide()
      })
    }
  }
}