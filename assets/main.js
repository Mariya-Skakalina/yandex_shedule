
import {CreateDomElement, DeleteElement} from './domelement.js';
import { get } from 'http';

require('isomorphic-fetch');

async function addElement(nameTag, idTag, classTag, parentElement, text){
    if(text !== undefined){
        await new CreateDomElement({nameTag: nameTag, idTag: idTag, classTag:classTag, parentElement: parentElement, text: text})
    }else{
        await new CreateDomElement({nameTag: nameTag, idTag: idTag, classTag:classTag, parentElement: parentElement})
    }
}
async function sendApi(st, type, is_search){
    new DeleteElement('content')
    var myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin','*');
    myHeaders.append('Access-Control-Request-Method','GET');
    myHeaders.append("Content-Type","application/json");
    
    let uri = 'http://localhost:3000/?st=' + st +'&type=' + type;
    // Если поиск
    if (is_search){
        //тут type это запрос search
        uri =  'http://localhost:3000/search/?st=' + st +'&search=' + type;
    }
    fetch(uri, {method:'GET',body:null,credentials: "same-origin", headers: myHeaders,  mode: 'cors'})
    .then(res => {
        if(res.status !== 200){
            let poop = document.getElementById('poop')
            poop.style.display = 'block'
        }
        return res.json()
    }).then(async (res) => {
        poop.style.display = 'none';
        for (let j of res.schedule){
            let uid = j.thread.uid
            if(document.getElementById(uid)){}
            else{
                await addElement('div', uid, 'track', 'content')
            }
            let date = '';
            if (j.departure){
                date =new Date(j.departure).toLocaleString()
            } else {
                date = new Date(j.arrival).toLocaleString()
            }
            await addElement('div', 'flight' + uid, 'flight-date', uid, date)
            await addElement('div', 'number' + uid, 'number-flight', uid, j.thread.number)
            await addElement('div', 'path' + uid, 'title-flight', uid, j.thread.title)
            if(j.terminal !== null){
                await addElement('div','terminal' + uid, 'terminal-flight', uid, j.terminal)
            }else{
                await addElement('div','terminal' + uid, 'terminal-flight', uid, 'Информация о терминале пока не доступна')
            }
            await addElement('div', 'carrier' + uid, 'carrier', uid, j.thread.carrier.title)
            await addElement('div', 'vehicle' + uid, 'vehicle', uid, j.thread.vehicle)
        }
    })
}

let air = ''
let airport = document.getElementsByClassName('airport');
for(let i of airport){
    i.addEventListener('click', function(element){
        air = element.target.getAttribute('airport');
        let search = document.getElementById('search')
        search.style.display = 'block'
        let types = document.getElementById('types')
        types.style.display = 'block'
        let track = document.getElementById('track')
        track.style.display = 'grid'
        sendApi(air, 'departure')
       
    })
}

let arrival = document.getElementById('arrival')
arrival.addEventListener('click', function(){
    sendApi(air, 'arrival')
})

let departures = document.getElementById('departures')
departures.addEventListener('click', function(){
    sendApi(air, 'departure')
})

let search_flight = document.getElementById('search-flight');
search_flight.addEventListener('click', function(){
    sendApi(air, document.getElementById('flight').value,true)
})