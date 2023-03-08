// Crée un local storage ci celui-ci n'existe pas
if(localStorage.getItem('positions')===null)
{
  localStorage.setItem('positions', "[]");
}

// Crée la session si celle-ci n'existe pas
if(sessionStorage.getItem('time')===null)
{
  sessionStorage.setItem('time',"20");
  sessionStorage.setItem('bool',"true");
}

// Récupère la position GPS au démarage de l'application. Puis toutes les 20 secondes 
setInterval(function GeoLocation()
{
  // Compteur inversé qui récupère la valeur du session storage 'time'
  let cpt = parseInt(sessionStorage.getItem('time'));

  // Message d'information
  document.getElementById('info-message').innerHTML = "Votre position va être actualisé dans "+ sessionStorage.getItem('time') + " seconde(s)."

  cpt--;
  sessionStorage.setItem('time', cpt.toString()); // Stock la nouvelle valeur dans la session

  // Si le compte à rebours arrive à 0 ou que c'est la première fois (démarage de l'application)
  if (sessionStorage.getItem('time') == "0" || sessionStorage.getItem("bool") == "true")
  {
    // Récupère les cordonnées (longitude et latitude)
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 5000,});

    sessionStorage.setItem('time',"20");
    sessionStorage.setItem('bool',"false");
  }
}, 1000); // Met à jour toutes les secondes

// Récupère les informations de l'API puis les affiches dans l'application
function CallWS(lat, lon)
{
  let positions = JSON.parse(localStorage.getItem("positions"));
  let positionsUnique = new Set(positions.map(JSON.stringify));
  let positionsUnique2 = Array.from(positionsUnique).map(JSON.parse);
  let unePosition = "";

  // Parcourir tout les points pour les afficher dans la carte
  for (let index = 0; index < positionsUnique2.length; index++)
  {
    if(index == positionsUnique2.length - 1){
      unePosition += "locations="+ positionsUnique2[index]["latitude"] + "," + positionsUnique2[index]["longitude"];
    }
    else{
      unePosition += "locations="+ positionsUnique2[index]["latitude"] + "," + positionsUnique2[index]["longitude"] + "||";
    }
  }
  
  // Appel l'API
  const URL = "https://www.mapquestapi.com/staticmap/v5/map?key=IAeHUtV9ENZYSGcCXdPgXm5hqGheiidL&" + unePosition + "&zoom=15&size=@2x&scalebar=true&defaultMarker=via-FF0000&type=dark";
  // console.log(positions);
  console.log(positions);
  // console.log(unePosition); 

  // Tableau qui contient toutes les positions
  positions.push({ "latitude" : lat, "longitude" : lon});        // Ajoute une nouvelle position
  localStorage.setItem("positions", JSON.stringify(positions));  // Stock l'ensemble des positions
  
  document.getElementById('osm-map').innerHTML = '<img id="map" src="' + URL + '"">'; // Affiche la map
  vibration();
}

// Affiche les cordonnée GPS et appel l'API
function onSuccess(position)
{
  document.getElementById("map-error").innerHTML = "";
  let cordonnee = document.getElementById("showGeolocation");

  // Afficher les cordonnées GPS (longitude et latitude)
  cordonnee.innerHTML = "<p id='longitude' class='text-light my-1'> Long : " + position.coords.longitude + "<p/>" +
    "<p id='latitude' class='text-light my-1'> Lat : " + position.coords.latitude + "</p>";

  CallWS(position.coords.latitude, position.coords.longitude);
}

// Affiche un message d'erreur
function onError(error)
{
  document.getElementById("map-error").innerHTML = "<p>Veuillez activé le GPS pour charger la carte.</p>";
}

// Effacer tout les points stocker
function ResetPoints()
{
  localStorage.setItem('positions', "[{}]");
  sessionStorage.setItem('bool',"true");
  sessionStorage.setItem('time',"20");
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 5000,});
}

//console.log(JSON.parse(localStorage.getItem('positions')));

// Permet de faire vibrer le téléphone
function vibration()
{
  let time = 500;
  navigator.vibrate(time);
}