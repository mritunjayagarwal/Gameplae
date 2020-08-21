$(document).ready(function() {
    var t = $('#display').DataTable({
      "pageLength": 2,
      "responsive": true,
      "fnRowCallback" : function(nRow, aData, iDisplayIndex){
              $("td:first", nRow).html(aData.DT_RowIndex);
              return nRow;
        }
    }).draw();

    t.on( 'order.dt search.dt', function () {
      t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
          cell.innerHTML = i+1;
      } );
    }).draw();
  });