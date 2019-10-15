//= require ./vendor/jquery.js
//= require bootstrap/js/dist/util.js
//= require bootstrap/js/dist/modal.js
//= require ./modal-shift-fix.js
//= require ./mobile-menu.js
//= require ./form.js

function toggleHeader() {
  const header = document.querySelector('.header')

  header.classList.toggle('header--fixed', pageYOffset > 1)
}

window.addEventListener('scroll', toggleHeader)

window.addEventListener('load', (e) => {
  const dropdownBtn = document.querySelector('.header__lang-link')

  toggleHeader()

  dropdownBtn.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.header__dropdown')
    e.preventDefault()

    dropdownBtn.classList.toggle('header__lang-link--active')
    dropdown.classList.toggle('header__dropdown--active')
  })

  document.querySelectorAll('.anchor-link').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      scrollTo(anchor.getAttribute('href'))
    })
  })
})

const scrollTo = (hash) => {
  $('html, body').animate({
    scrollTop: $(hash).offset().top - $('.header').height()
  }, 400)
}
