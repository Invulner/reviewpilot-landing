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
  localStorage.setItem('currentLang', 'ru')
  const dropdownBtn = document.querySelector('.header__lang-link')
  const dropdown = document.querySelector('.header__dropdown')
  const body = document.querySelector('body')

  const toggleDropdown = () => {
    dropdownBtn.classList.toggle('header__lang-link--active')
    dropdown.classList.toggle('header__dropdown--active')
  }

  toggleHeader()

  body.addEventListener('click', (e) => {
    const targetElement = e.target
    const isClickOutside = !dropdownBtn.contains(targetElement)
    const isDropdownOpen = dropdown.classList.contains('header__dropdown--active')

    if(isClickOutside && isDropdownOpen) {
      toggleDropdown()
    }
  })

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleDropdown()
  })

  document.querySelectorAll('.anchor-link').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      scrollTo(anchor.getAttribute('href'))
    })
  })

  //Detect active language
  const languages = [
    {
      key: 'en',
      val: 'En'
    },
    {
      key: 'ua',
      val: 'Укр'
    }
  ]
  const defaultLanguage = {
    key: 'ru',
    val: 'Рус'
  }

  const currentLang = languages.find(lang => window.location.href.includes(lang.key)) || defaultLanguage

  document.querySelectorAll('.footer__lang-list-link').forEach(link => {

    if (link.dataset.lang == currentLang.key) {
      link.classList.add('footer__lang-list-link--active')
    }
  })

  document.querySelectorAll('.header__dropdown-link').forEach(link => {
    if (link.href.includes(currentLang.key)) {
      link.classList.add('header__dropdown-link--active')
      dropdownBtn.childNodes[0].nodeValue = currentLang.val
    }
  })
})

const scrollTo = (hash) => {
  $('html, body').animate({
    scrollTop: $(hash).offset().top - $('.header').height()
  }, 400)
}
