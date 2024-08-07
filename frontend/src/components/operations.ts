import {Popup} from "./popup";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../config/config";
import {GetOperationsFilter} from "../utils/getOperationsFilter";
import {OperationsArrayType} from "../types/operations-array.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Operations extends Popup {
  readonly header: HTMLElement | null
  readonly tab: NodeListOf<Element> | null
  readonly tabContent: HTMLElement | null
  readonly inputDataFrom: HTMLInputElement | null
  readonly inputDataTo: HTMLInputElement | null
  readonly inputTypeDate: NodeListOf<Element> | null
  private atrribut: string | null
  public idLocalStorage: string
  readonly userToken: string | null
  private operationsArray: OperationsArrayType[] = []
  public selectTypeElement: HTMLOptionElement | undefined
  public selectTypeValue: string | undefined

  constructor(init: boolean = true) {
    super()
    this.header = document.querySelector('.tabs-header')
    this.tab = document.querySelectorAll('.tabs-header-item')
    this.tabContent = document.getElementById('tabs-content')
    this.inputDataFrom = document.getElementById('dataFrom') as HTMLInputElement
    this.inputDataTo = document.getElementById('dataTo') as HTMLInputElement
    this.inputTypeDate = document.querySelectorAll(".operations-date");
    this.idLocalStorage = 'idIncomeAndExpense'
    this.userToken = localStorage.getItem(Auth.accessToken)
    this.atrribut = null

    this.inputTypeDate?.forEach((item: Element): void => {
      item.addEventListener("focusin", function (): void {
        (item as HTMLInputElement).type = 'date';
      })
    });
    this.inputTypeDate?.forEach((item: Element): void => {
      item.addEventListener("focusout", function (): void {
        (item as HTMLInputElement).type = 'text';
      })
    });

    if (init) {
      this.initTabs()
      this.init()
    }
  }

  private initTabs(): void {
    this.header?.addEventListener('click', (e: MouseEvent): void => {
      const target: Element | null = (e.target as HTMLElement).closest('.tabs-header-item');
      if (!target) return;

      if (this.tab) {
        const index: number = Array.from(this.tab).indexOf(target);
        if (index === -1) return;

        this.tab.forEach((item: Element, idx: number): void => {
          if (this.tabContent) this.tabContent.innerHTML = '';
          item.classList.remove('active');

          if (idx === index) {
            item.classList.add('active');
            this.init()
          }
        });
      }
    });
  }

  private getValueTab(): string | undefined {
    let valueTab
    this.tab?.forEach((item: Element): void => {
      if (item.classList.contains('active')) valueTab = (item as HTMLElement).innerText
    })

    return valueTab
  }

  private async init(): Promise<void> {
    const userInfo: UserInfoType | null = Auth.getUserInfo()
    if (!this.userToken && !userInfo) {
      location.href = '#/login'
      return
    }
    if (this.userToken && userInfo) {
      try {
        setTimeout(async (): Promise<void> => {
          const result: OperationsArrayType[] | DefaultResponseType = await CustomHttp.request(GetOperationsFilter.urlOperationsFilter(this.getValueTab(), this.inputDataFrom?.value, this.inputDataTo?.value))

          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message)
            }

            this.operationsArray = result as OperationsArrayType[]

            this.processTableIncomeAndExpense()
          }
        }, 100);
      } catch (e) {
        throw new Error((e as DefaultResponseType).message);
      }
    }
  }

  private processTableIncomeAndExpense(): void {
    if (this.operationsArray && this.operationsArray.length) {
      const tabsContentItem: HTMLDivElement = document.createElement('div')
      tabsContentItem.classList.add('tabs-content-item')

      const tabsTable: HTMLTableElement = document.createElement('table')
      const tabsThead: HTMLTableSectionElement = document.createElement('thead')
      const tabsTheadTr: HTMLTableRowElement = document.createElement('tr')

      const tabsTheadThOperation: HTMLTableCellElement = document.createElement('th')
      tabsTheadThOperation.innerText = '№ Operation'

      const tabsTheadThType: HTMLTableCellElement = document.createElement('th')
      tabsTheadThType.innerText = 'Type'

      const tabsTheadThCategory: HTMLTableCellElement = document.createElement('th')
      tabsTheadThCategory.innerText = 'Category'

      const tabsTheadThSum: HTMLTableCellElement = document.createElement('th')
      tabsTheadThSum.innerText = 'Sum'

      const tabsTheadThDate: HTMLTableCellElement = document.createElement('th')
      tabsTheadThDate.innerText = 'Date'

      const tabsTheadThComment: HTMLTableCellElement = document.createElement('th')
      tabsTheadThComment.innerText = 'Comment'

      this.operationsArray.forEach(((item: OperationsArrayType, index: number): void => {
        let numberOperations: number = index + 1

        const tabsTbody: HTMLTableSectionElement = document.createElement('tbody')
        tabsTbody.classList.add('tbody')
        tabsTbody.setAttribute("data-id", item.id.toString())

        const tabsTbodyTr: HTMLTableRowElement = document.createElement('tr')
        const tabsTbodyTdOperation: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdOperation.classList.add('number-operation')
        tabsTbodyTdOperation.innerText = numberOperations.toString();
        const tabsTbodyTdType: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdType.classList.add('type')
        item.type === 'income' ? tabsTbodyTdType.style.color = 'green' : tabsTbodyTdType.style.color = 'red'
        tabsTbodyTdType.innerText = item.type
        const tabsTbodyTdCategory: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdCategory.classList.add('category')
        tabsTbodyTdCategory.innerText = item.category
        const tabsTbodyTdAmount: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdAmount.classList.add('suma')
        tabsTbodyTdAmount.innerText = item.amount.toString()
        const tabsTbodyTdDate: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdDate.classList.add('date')
        tabsTbodyTdDate.innerText = GetOperationsFilter.formatDate(item.date)
        const tabsTbodyTdComment: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdComment.classList.add('comment')
        tabsTbodyTdComment.innerText = item.comment
        const tabsTbodyTdButton: HTMLTableCellElement = document.createElement('td')
        tabsTbodyTdButton.classList.add('button-svg')

        const tabsTableButtonClear: HTMLButtonElement = document.createElement('button')
        tabsTableButtonClear.classList.add('clear')
        tabsTableButtonClear.innerHTML = `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black" />
                    <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black" />
                    <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black" />
                  </svg>`

        const tabsTableButtonEdit: HTMLButtonElement = document.createElement('button')
        tabsTableButtonEdit.classList.add('edit')

        tabsTableButtonEdit.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black" />
                </svg>`


        tabsTbodyTdButton.appendChild(tabsTableButtonClear)
        tabsTbodyTdButton.appendChild(tabsTableButtonEdit)

        tabsTable.appendChild(tabsTbody)
        tabsTbody.appendChild(tabsTbodyTr)
        tabsTbodyTr.appendChild(tabsTbodyTdOperation)
        tabsTbodyTr.appendChild(tabsTbodyTdType)
        tabsTbodyTr.appendChild(tabsTbodyTdCategory)
        tabsTbodyTr.appendChild(tabsTbodyTdAmount)
        tabsTbodyTr.appendChild(tabsTbodyTdDate)
        tabsTbodyTr.appendChild(tabsTbodyTdComment)
        tabsTbodyTr.appendChild(tabsTbodyTdButton)
      }))

      this.tabContent?.appendChild(tabsContentItem)
      tabsContentItem.appendChild(tabsTable)

      tabsTable.appendChild(tabsThead)
      tabsThead.appendChild(tabsTheadTr)
      tabsTheadTr.appendChild(tabsTheadThOperation)
      tabsTheadTr.appendChild(tabsTheadThType)
      tabsTheadTr.appendChild(tabsTheadThCategory)
      tabsTheadTr.appendChild(tabsTheadThSum)
      tabsTheadTr.appendChild(tabsTheadThDate)
      tabsTheadTr.appendChild(tabsTheadThComment)

      this.delete()
      this.editing();
    }
  }

 private delete(): void {
    const deleteTable: NodeListOf<Element> = document.querySelectorAll('.clear')
    deleteTable.forEach((buttonClear: Element): void => {
      buttonClear.addEventListener('click', (e: Event): void => {
        let items: Element | null = (e.target as HTMLElement).closest('.tbody');

        if (items) {
          this.atrribut = items.getAttribute('data-id');
          if (this.atrribut) {
            this.popupElement?.classList.remove('hide')
            if (this.popupContent && this.popupTextElement) {
              this.popupContent.style.cssText = `
                        height: 16rem;
                        width: 46rem;
                    `;
              this.popupTextElement.textContent = 'Do you really want to delete?'
              this.popupTextElement.style.color = '#290661'
            }
            const deleteButton: HTMLButtonElement = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.classList.add('button');
            deleteButton.textContent = 'Yes, delete it.'
            deleteButton.style.cssText = `
                        width: 11.1rem;
                        font-size: 14px;
                        background: #198754;
                        font-family: "Roboto-Regular", sans-serif;
                        margin-top: 1rem;
                    `;

            const cancelButton: HTMLButtonElement = document.createElement('button');
            cancelButton.setAttribute('type', 'button');
            cancelButton.classList.add('button');
            cancelButton.textContent = 'Don\'t delete'
            cancelButton.style.cssText = `
                        width: 11.1rem;
                        font-size: 14px;
                        margin-left: 1.2rem;
                        background: #dc3545;
                        font-family: "Roboto-Regular", sans-serif;
                        margin-top: 1 rem;
                    `;

            this.popupButtonElement?.append(deleteButton)
            this.popupButtonElement?.append(cancelButton)

            deleteButton.addEventListener('click', async (): Promise<void> => {
              try {
                const result: DefaultResponseType = await CustomHttp.request(config.host + "/operations/" + this.atrribut, "DELETE")
                if (result) {
                  if ((result as DefaultResponseType).error) {
                    throw new Error((result as DefaultResponseType).message)
                  }

                  this.reset()
                  this.hide()
                  window.location.reload()
                }
              } catch (e) {
                throw new Error((e as DefaultResponseType).message);
              }
            })

            cancelButton.addEventListener('click', () => {
              this.reset()
              this.hide()
            })
          }
        }
      })
    })
  }

  private editing(): void {
    const value: NodeListOf<Element> = document.querySelectorAll('.edit')
    value.forEach((item: Element): void => {
      item.addEventListener('click', (e: Event): void => {

        let item: Element | null = (e.target as HTMLElement).closest('.tbody');
        if (item) {
          this.atrribut = item.getAttribute('data-id');
          if (this.atrribut) localStorage.setItem(this.idLocalStorage, this.atrribut);
          window.location.href = '/#/income-expenses-edit'
        }
      })
    })
  }
}