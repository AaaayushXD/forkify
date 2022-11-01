import * as model from './model.js';
import recipeview from './views/recipe.js';
import SearchView from './views/search.js';
import resultsView from './views/results.js';
import bookmarkView from './views/bookmark.js';
import paginationView from './views/pagination.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //loading spinner
    recipeview.renderSpinner();

    // updating book mark
    bookmarkView.update(model.state.bookmarks);
    
    //0 update result to mark selected
    resultsView.update(model.getResultPage());
    
    ///1 loading receipe
    await model.loadRecipe(id);
    
    ///2. rendering receipe
    recipeview.render(model.state.recipe);

  } catch (err) {
    alert(err);
    recipeview.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    //load spinner
    resultsView.renderSpinner();

    //1 get query from search
    const query = SearchView.getQuery();
    if (!query) return;

    //2 load search result
    await model.loadSearchResult(query);

    //3 render result
    resultsView.render(model.getResultPage());

    //4 render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlServing = function (newServings) {
  //update the receipe
  model.updateServing(newServings);

  //update the recipe view
  // recipeview.render(model.state.recipe); this will update whole view
  recipeview.update(model.state.recipe); //to update particular part only
};

const controlPagination = function (goto) {
  //render new result
  resultsView.render(model.getResultPage(goto));
  //render new pagination
  paginationView.render(model.state.search);
};

const controlBookmarks = function () {

  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeview.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const renderStoredBookmarks = function () {
  bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe data
    recipeview.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    ///render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //chnage id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000) 
  } catch (err) {
    console.error(`${err} ❌❌`);
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  bookmarkView.addHandlerRender(renderStoredBookmarks);
  recipeview.addHandlerRender(controlRecipe);
  recipeview.addHandlerUpdateServing(controlServing);
  recipeview.addHandlerBookmark(controlBookmarks);
  SearchView.addSearchHandler(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
