import { csv } from "d3-fetch";

csv("./data/crashDataSet.csv")
  .then(function (data) {
    console.log("data 1", data);

    // data.forEach(function (d) {
    //   console.log("le pays :  ", d.Location.split(' ').pop()); // Affiche les valeurs de chaque ligne
    // });
    const countryData = data.filter(d => d.Location.split(' ').pop() === 'Switzerland');
    console.log("country data", countryData)
    displayCountryData('Switzerland', countryData)
  })
  .catch(function (error) {
    console.log("il y a une erreur : ", error);
  }); 

// Sélectionne l'élément object contenant le SVG
const object = document.querySelector('#map object');

// Attend que le chargement du SVG soit terminé
object.addEventListener('load', function() {
  // Récupère l'élément SVG contenu dans l'élément object
  const svg = object.contentDocument.querySelector('svg');

  // Cible tous les éléments path correspondant à des pays
  const countries = svg.querySelectorAll('path[id]');

  // Boucle à travers les pays et ajoute un événement de clic à chacun
  countries.forEach(function(country) {
    // Récupère l'ID du pays dans l'attribut "id" de l'élément path
    const countryId = country.getAttribute("name");

    // Ajoute un événement de clic à l'élément path du pays
    country.addEventListener("click", function() {
      // Affiche l'ID du pays dans la console
      console.log(countryId);
    });
  });
});

const displayCountryData = (countryName, data) => {
  //faire que la section de l'europe disparaisse

  const country = countryName;
  //get the div with class displayed and change it to hidden
  const europe = document.querySelector('.displayed');
  europe.classList.remove('displayed');
  europe.classList.add('hidden');

  //select the div with the id "country" and change it to displayed
  const countryDiv = document.querySelector('#country');
  countryDiv.classList.remove('hidden');
  countryDiv.classList.add('displayed');

  const svg = object.contentDocument.querySelector('svg');
  const path = svg.querySelector(`path[name="${country}"]`);
  console.log('path: ', path)

  const html = `
  <h1>${countryName}</h1>
  <svg viewBox="0 0 20 20" width="200" height="200" >
  ${path}
  </svg>
  <p>Salut toi 👋, C’est bientôt l’été, les vacances, le temps de prendre l’avion ! Qu’en dis-tu d’en savoir plus sur ces anges de fer qui survolent notre ciel ?
  Savais-tu qu’il  y a eu ${data.length} crash d’avions en ${countryName} depuis 1900. Tu peux voir à gauche le lieu de ces crashs!
  Scroll si tu as le courage d’en découvrir plus sur ces crashs😈</p>`
  //insert path in the svg with id countryOutline



  //insère le html dans la div country
  countryDiv.innerHTML = html;

}