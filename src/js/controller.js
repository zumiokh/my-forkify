// controller.js

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // for polyfilling
import 'regenerator-runtime/runtime'; // for polyfilling

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    // add | get hash id
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update result view to mark sel;ected search result
    resultsView.update(model.getSearchResultPage());
    // Update bookmarksView
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);

    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search result
    await model.loadSearchResults(query);

    // render result
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (gotoPage) {
  // render NEW result
  resultsView.render(model.getSearchResultPage(gotoPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update serving (in state)
  model.updateServing(newServing);
  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add & remove bookmark
  if (!model.state.recipe.isBookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // update recipeView
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {

    // render spinner 
    addRecipeView.renderSpinner();

    // code for upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // (Re)render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (error) {
    console.error('💥', error);
    addRecipeView.renderError(error.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the app!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
