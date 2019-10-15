var winWidth = window.innerWidth
var bodyWidth = $('body').innerWidth()
var rightPadding = winWidth - bodyWidth

$('.modal')
  .on('show.bs.modal', function () {
    $('.header').css('padding-right', rightPadding)
  })
  .on('hidden.bs.modal', function () {
    $('.header').css('padding-right', '')
  })
