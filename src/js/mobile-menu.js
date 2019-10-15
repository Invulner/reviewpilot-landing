//= require jquery/dist/jquery.js

$(document).on('click', '.header__toggle-btn', function() {
  $('body').addClass('no-scroll')
  $('.header').addClass('header--open')
})

$(document).on('click', '.header__link', closeMenu)
$(document).on('click', '.header__overlay', closeMenu)

function closeMenu() {
  $('body').removeClass('no-scroll')
  $('.header').removeClass('header--open')
}
