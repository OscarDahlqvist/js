onResize();
// Try edit msg
var msg = 'Hello world'
var icon = ' <i class="fa fa-smile-o"></i>'
var sideBarIsOn = true;
//console.log(msg)
//$('#msg').html(msg + icon)

function toggleSidebar() {
  sideBarIsOn = !sideBarIsOn
  var currentSize = getComputedStyle(document.documentElement)
    .getPropertyValue("--sidebar-size");
  console.log(currentSize);
  currentSize = currentSize.substring(0,currentSize.length-2);
  currentSize = 300-currentSize
  
  document.documentElement.style.setProperty('--sidebar-size', currentSize+"px");
  $('.sidebar').toggleClass('sidebar_hidden');
}

function onResize() {
  var zoom = (window.innerWidth<1200)?2:1
  document.documentElement.style.setProperty("--zoom",zoom);
}