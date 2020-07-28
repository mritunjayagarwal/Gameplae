$('#gameSearch').focus(function(){
  $("#gameSearch").removeClass("bg-dark")
});

$('#gameSearch').focusout(function(){
  $("#gameSearch").addClass("bg-dark")
})

$("#upi").on("change", function() {
    $('#preUpi').toggleClass("checkBox", this.checked);
    $("#upiHolder" ).toggle();
    $('#upiNum').toggle();
  });

$("#dUpi").on("click", function(){
  $('#newUpi').toggle();
  $('#newUpi').css('margin-top', '-17px')
  $('#preUpi').toggle();
  $('#rwammount').toggle();
  $('#sbtn').toggle();
  $('#dUpi').toggleClass('mb-0');
  $(this).text($('#dUpi').text() == 'Withraw using another UPI' ? 'Use a registered UPI' : 'Withraw using another UPI');
})

  