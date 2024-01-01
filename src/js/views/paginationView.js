// paginationView.js

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // at Page 1 and there are more pages
    if (currentPage === 1 && numPages > 1)
      return this._generatedMarkupBtn('next', currentPage);

    // at Last Page
    if (currentPage === numPages && numPages > 1)
      return this._generatedMarkupBtn('prev', currentPage);

    // other pages (in-between pages)
    if (currentPage < numPages)
      return (
        this._generatedMarkupBtn('prev', currentPage) +
        this._generatedMarkupBtn('next', currentPage)
      );

    // at Page 1 and there is no more pages (there is only 1 page)
    return '';
  }

  _generatedMarkupBtn(buttonType, currentPage) {
    const sidePage = buttonType === 'prev' ? currentPage - 1 : currentPage + 1;
    let markup = `
    <button data-goto="${sidePage}" class="btn--inline pagination__btn--${buttonType}">
    `;

    if (buttonType === 'prev')
      markup += `
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${sidePage}</span>
        `;
    if (buttonType === 'next')
      markup += `
        <span>Page ${sidePage}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        `;

    markup += `</button>`;
    return markup;
  }
}

export default new PaginationView();
