const urlAPI = "https://api.giphy.com"
const apiKey = "BlNqSAzxL1RHj9SezjRl5okpHpm1hS7Y"

let giphs = []
let pivot = 0
let totalCount = 0
let pageCount = 16
let pages = 0
let countPages = 0

window.addEventListener('scroll',()=>{
	const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
	if( scrollTop+clientHeight > scrollHeight - 10 && scrollTop+clientHeight < scrollHeight){
		setTimeout(displayGiphs,3000);
	}
});

/* Busquédas */
const getBusquedas = () => {
    if ( localStorage.getItem('busquedas') ){
        let busquedas = getBusquedasLocal()
        let contentBusquedas = document.getElementById('contentBusquedasRecientes')
        contentBusquedas.innerHTML = ""
        busquedas.forEach( element => {
            let a = document.createElement('a')
            a.onclick = function(){
                return rebuscar(element)
            }
            a.href = '#'
            a.text = element
            contentBusquedas.appendChild(a)
        })
    }
}
const getBusquedasLocal = () => {
    if ( localStorage.getItem('busquedas') ){
        let busquedas = localStorage.getItem('busquedas')
        return JSON.parse(busquedas)
    }else{
        return []
    }
}
getBusquedas()


/** Obtener giphys */
const getGiphsTrending = () => {
    fetch(urlAPI+"/v1/gifs/trending?api_key="+apiKey+"&limit=120",{
        method: "GET",
    })
    .then( response => response.json() )
    .then( result => {
        giphs = result.data
        totalCount = result.data.length /* result.pagination.total_count -> Para apy_key free es 50 */
        pages = parseInt(totalCount/pageCount)
        countPages++
        displayGiphs()
    })
    .catch( error => console.log('error',error));
}
getGiphsTrending()

const buscarGiphs = (buscado) => {
    fetch(urlAPI+"/v1/gifs/search?api_key="+apiKey+"&q="+buscado+"&limit=12",{
        method: "GET",
    })
    .then( response => response.json() )
    .then( result => {
        document.getElementById('container-elem').innerHTML = "";
        if( result.pagination.total_count > 0 ){
            giphs = result.data
            totalCount = result.data.length /* result.pagination.total_count -> Para apy_key free es 50 */
            pages = parseInt(totalCount/pageCount)
            countPages = 1
            displayGiphs()
        }else{
            let p = document.createElement('p')
            let t = document.createTextNode('No se encontraron resultados')
            p.className = 'p-info'
            p.appendChild(t)
            document.getElementById('container-elem').appendChild(p)
        }
    })
    .catch( error => console.log('error',error));
}

const displayGiphs = () => {
    let top = pivot + pageCount
    if( top > totalCount){
        pivot = 0
        top = pivot + pageCount
        if( top > totalCount ){
            top = totalCount
        }
    }
    for(i=pivot; i<top; i++){
        let div = document.createElement('div')
        div.className = 'container-img'
        let img = document.createElement('img')
        img.src = giphs[i].images.original.url
        div.appendChild(img)
        document.getElementById('container-elem').appendChild(div)
    }
    countPages++
    pivot = pivot + pageCount

    if( countPages >= pages )
        pivot = 0
}

function rebuscar(elem_value){
    let b = document.getElementById('busqueda')
    b.value = elem_value
    buscar()
}

function buscar(){
    document.getElementById('container-elem').innerHTML = "";
    let b = document.getElementById('busqueda').value
    setTimeout(limpiarCampo,1000);
    if ( b != "" ){
        let busquedas = (getBusquedasLocal())
        let findB = busquedas.find( elem => elem === b )
        if( !findB ){
            if( busquedas.length > 2){
                busquedas.shift()
            }
            busquedas.push(b)
            localStorage.setItem('busquedas',JSON.stringify(busquedas))
            getBusquedas()
        }
        buscarGiphs(b)
    }
}

function limpiarCampo(){
    let b = document.getElementById('busqueda')
    b.value = ""
}

