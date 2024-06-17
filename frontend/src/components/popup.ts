export class Popup {
  constructor() {
    this.popupElement = document.getElementById('popup');
    this.popupContent = document.getElementById('popup-content');
    this.popupTextElement = document.getElementById('popup-text');
    this.popupButtonElement = document.getElementById('popup-button');
    this.buttonCancel = document.getElementById('button-cancel');
  }

  show() {
    this.popupElement.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.popupElement.classList.add('hide');
    this.popupElement.classList.remove('show');
    document.body.style.overflow = '';
  }

  reset() {
    while (this.popupTextElement.firstChild) {
      this.popupTextElement.removeChild(this.popupTextElement.firstChild);
    }

    while (this.popupButtonElement.firstChild) {
      this.popupButtonElement.removeChild(this.popupButtonElement.firstChild);
    }

    this.popupContent.style = '';
    let childElements = this.popupContent.children;
    for (let i = 0; i < childElements.length; i++) {
      childElements[i].style = '';
    }
  }

  targetCloseModal() {
    this.popupElement.addEventListener('click', (e) => {
      if (e.target === this.popupElement) {
        this.reset()
        this.hide()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.popupElement.classList.contains('show')) {
        this.reset()
        this.hide()
      }
    })

    this.buttonCancel.addEventListener('click', () => {
      this.reset()
      this.hide()
    })
  }

}