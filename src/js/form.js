var emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

window.addEventListener('load', (e) => {
  var form = document.getElementById('demo-form')
  var submitBtn = document.getElementById('demo-submit')
  var modal = document.getElementById('demo-modal')
  var modalBody = document.getElementsByClassName('modal-body')[0]
  var emailInput = document.getElementById('email')
  var heroModalBtn = document.getElementsByClassName('hero__btn')[0]
  var heroEmailInput = document.getElementById('hero-email')

  function turnOnLoadingMode() {
    submitBtn.classList.add('loading')
    form.classList.add('disabled')
  }

  function turnOffLoadingMode() {
    submitBtn.classList.remove('loading')
    form.classList.remove('disabled')
  }

  function clearForm() {
    form.reset()
    modalBody.classList.remove('modal-body--submitted')
    emailInput.classList.remove('invalid')
  }

  function submitForm() {
    turnOnLoadingMode()

    $.ajax({
      type: 'POST',
      url: 'https://app.reviewpilot.net/leads.js',
      data: $(form).serialize(),
      dataType: 'json',
      success: function(data) {
        modalBody.classList.add('modal-body--submitted')
        turnOffLoadingMode()
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("ERROR: " + textStatus + ", " + errorThrown)
        console.log(jqXHR)
        turnOffLoadingMode()
      }
    })
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    var email = emailInput.value.trim()

    if (emailRegexp.test(email)) {
      emailInput.classList.remove('invalid')
      submitForm()
    } else {
      emailInput.classList.add('invalid')
    }
  })

  heroModalBtn.addEventListener('click', (event) => {
    var heroEmail = heroEmailInput.value

    if (heroEmail) {
      emailInput.value = heroEmail
    }
  })

  $(modal).on('hidden.bs.modal', clearForm)
})
