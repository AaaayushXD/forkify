import View from './view.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was Successfullly uploaded. 🎉🎉';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  
    constructor() {
        super();
        this._addHandlerShow();
        this._addHandlerHide();
    }

    toggleWindow() {
         this._overlay.classList.toggle('hidden');
         this._window.classList.toggle('hidden');
    }

    _addHandlerShow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    _addHandlerHide() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));

    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        })
    }

  _generateMarkup() {}
}

export default new AddRecipeView();
