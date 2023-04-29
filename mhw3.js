function onJson(json) {
    console.log('JSON ricevuto');
    console.log(json);
    const covers = document.querySelector('#covers');
    covers.innerHTML = '';
  // resultCount vedo dal json che è il numero di risultati trovati
  let num_results = json.resultCount;

  if(num_results > 5)
    num_results = 5;

    if(num_results === 0){
      const err = document.createElement('p');
      err.textContent= 'Spiacente, la ricerca non è andata a buon fine';
      covers.appendChild(err);

    }else{
  
    for(let i=0; i<num_results; i++)
    {
      const doc = json.results[i]
     
      const albumName = doc.trackName;
      const albumCover = doc.artworkUrl100;
      
      
      const info = document.createElement('div');
      const img = document.createElement('img');
      img.src = albumCover;
      const nameAlbum = document.createElement('span');
      nameAlbum.textContent = albumName;
      const artist = document.createElement('p');
      artist.textContent= doc.artistName

      const audio = document.createElement('audio');
      audio.controls=true;

      const audioSource = document.createElement('source')
      audioSource.src=doc.previewUrl;
    

      info.classList.add('info');
      info.appendChild(img);
      info.appendChild(artist);
      info.appendChild(nameAlbum);
      info.appendChild(audio);
      audio.appendChild(audioSource);

      covers.appendChild(info);
    }
  }
}
function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}
function onTokenJson(json){
  token = json.access_token;
}



function onJson2(json){
  console.log(json);
  const results = json.artists.items;
  const id = results[0].id;
  
  const cont = document.querySelector('#cont');
  cont.innerHTML = '';
  const txt = document.createElement('h1');
  txt.textContent = 'Cerco artisti simili a '+ results[0].name;
  cont.appendChild(txt);

  fetch('https://api.spotify.com/v1/artists/' + id + '/related-artists',
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse).then(onJson3); 
}

function onJson3(json){
   console.log(json);
   const artisti = document.querySelector('#artistiSimili');
   artisti.innerHTML = '';


   const results = json.artists;
   let length = results.length;
   
   if (length >5){
     length=5;
   }
   
   for(let i=0; i<length; i++){
    const ris = results[i];
    const name = ris.name;
    const image = ris.images[0].url;
    
    const artista = document.createElement('div');
    artista.classList.add('info');
    const img = document.createElement('img');
    img.src = image;
    const nome = document.createElement('span');
    nome.textContent = name;

    artista.appendChild(img);
    artista.appendChild(nome);
    artisti.appendChild(artista);
   }

}


function search(event){
    event.preventDefault();
  
    const song_input = document.querySelector('#song');
    const song_value = encodeURIComponent(song_input.value);
    console.log('Eseguo ricerca: ' + song_value);
    
  url = 'https://itunes.apple.com/search?media=music&term=' + song_value;
  console.log('URL: ' + url);
  fetch(url).then(onResponse).then(onJson);
}

function cercaSpotify(event){

  event.preventDefault();
  const name_input = document.querySelector('#testi');
  const name_value = encodeURIComponent(name_input.value);
  console.log('Eseguo ricerca: ' + name_value);

  fetch('https://api.spotify.com/v1/search?type=artist&q=' + name_value + '&limit=5',
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse).then(onJson2); 
  
}



const client_id = '7c31d32aa0144423b7552e6dcc1ae6b9';
const client_secret = '766243bc9e784813bea9698ac8959dfe';

let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onResponse).then(onTokenJson);

const form = document.querySelector('#form1');
form.addEventListener('submit', search)

const form2 = document.querySelector('#form2');
form2.addEventListener('submit', cercaSpotify);