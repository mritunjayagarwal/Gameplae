
$("#upi").on("change", function() {
    $('#preUpi').toggleClass("checkBox", this.checked);
    $( "#upiHolder" ).toggle();
    $('#upiNum').toggle();
  });

$("#dUpi").on("click", function(){
  $('#newUpi').toggle();
  $('#preUpi').toggle();
  $('#sbtn').toggle();
  $('#dUpi').toggleClass('mb-0');
  $(this).text($('#dUpi').text() == 'Withraw using another UPI' ? 'Use a registered UPI' : 'Withraw using another UPI');
})

  