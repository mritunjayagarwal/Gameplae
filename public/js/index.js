$("#upi").on("change", function() {
    $('#preUpi').toggleClass("checkBox", this.checked);
    $( "#upiHolder" ).toggle();
    $('#upiNum').toggle();
  });

  