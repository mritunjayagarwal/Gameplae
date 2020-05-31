$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function tournaments(game){
  document.getElementById('iframe1').src = '/tournaments/' + game; 
}

function host(link){
    document.getElementById('iframe1').src = '/' + link; 
}