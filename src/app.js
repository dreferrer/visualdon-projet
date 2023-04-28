import { csv } from "d3-fetch";

csv("./data/crashDataSet.csv").then(function(data) {
  console.log('data 1', data);

  data.forEach(function(d) {
    console.log('les colonnes :  ', d); // Affiche les valeurs de chaque ligne
  });
}).catch(function(error) {
  console.log('il y a une erreur : ', error);
});
