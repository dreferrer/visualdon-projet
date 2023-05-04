import { csv } from "d3-fetch";

/* csv("./data/crashDataSet.csv")
  .then(function (data) {
    console.log("data 1", data);

    data.forEach(function (d) {
      console.log("les colonnes :  ", d); // Affiche les valeurs de chaque ligne
    });
  })
  .catch(function (error) {
    console.log("il y a une erreur : ", error);
  }); */

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
    const countryId = country.getAttribute("id");

    // Ajoute un événement de clic à l'élément path du pays
    country.addEventListener("click", function() {
      // Affiche l'ID du pays dans la console
      console.log(countryId);
    });
  });
});
