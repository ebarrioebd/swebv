var wmin=800,hmin=400 
console.log( window.innerWidth,window.innerHeight); 
  window.addEventListener("resize", function(){
    // tu código aquí
    console.log('La pantalla ha cambiado de tamaño', window.innerWidth,window.innerHeight); 
    if( window.innerWidth<wmin | window.innerHeight<hmin ){
      //document.write("<h1>La herramienta esta disponible para pantallas de laptop o computadoras de escritorio..</h1><h1>" + window.innerWidth+"X"+window.innerHeight+"</h1>")
    }else{
      console.log( window.innerWidth,window.innerHeight); 
    }
});
  if( window.innerWidth<wmin | window.innerHeight<hmin){
    console.log("Pantalla pequena")
    //document.body.innerHTML="<h1>La herramienta esta disponible para pantallas de laptop o computadoras de escritorio..</h1><h1>" + window.innerWidth+"X"+window.innerHeight+"</h1>"
  }