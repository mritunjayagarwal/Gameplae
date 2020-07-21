$(document).ready(function(){
  var $regexname=/^([0-9]{10})$/;
  var $regexholder=/^([a-z]{1-10})$/;
  $('.phVal').on('keypress keydown keyup',function(){
           if (!$(this).val().match($regexname)) {
            // there is a mismatch, hence show the error message
               $('.pVal').removeClass('hidden');
               $('.pVal').show();
           }
         else{
              // else, do not display message
              $('.pVal').addClass('hidden');
             }
       });
  $('.hoVal').on('keypress keydown keyup',function(){
            if (!$(this).val().match(/^([a-zA-Z]{2,100})$/)) {
              // there is a mismatch, hence show the error message
                $('.hVal').removeClass('hidden');
                $('.hVal').show();
            }
          else{
                // else, do not display message
                $('.hVal').addClass('hidden');
              }
          });
});

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

  