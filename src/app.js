// import { csv } from "d3-fetch";
import * as d3 from "d3";

d3.csv("./data/crashDataSet.csv")
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

  //get the div with class displayed and change it to hidden
  const europe = document.querySelector('.displayed');
  europe.classList.remove('displayed');
  europe.classList.add('hidden');

  //select the div with the id "country" and change it to displayed
  const countryDiv = document.querySelector('#country');
  console.log(countryDiv)
  countryDiv.classList.remove('hidden');
  countryDiv.classList.add('displayed');

  // const svg = object.contentDocument.querySelector('svg');
  // const path = svg.querySelector(`path[name="${country}"]`);
  // console.log('path: ', path)

  const info1 = `
  <h1>${countryName}</h1>
  <svg viewBox="0 0 20 20" width="200" height="200" >
  
  </svg>
  <p>Salut toi 👋, C’est bientôt l’été, les vacances, le temps de prendre l’avion ! Qu’en dis-tu d’en savoir plus sur ces anges de fer qui survolent notre ciel ?
  Savais-tu qu’il  y a eu ${data.length} crash d’avions en ${countryName} depuis 1900. Tu peux voir à gauche le lieu de ces crashs!
  Scroll si tu as le courage d’en découvrir plus sur ces crashs😈</p>`



  //insère le html dans la div country
  countryDiv.innerHTML = info1;


  // partie 2 
  let ampmResult = '';

  let amPmData = [
    {info: 'pourcentage', am: 0, pm: 0}
  ]

  for (let i = 0; i < data.length; i++) {
    if(data[i].Time === '') continue;
    let hour = parseInt(data[i].Time.split(':')[0]);
    if (hour < 12) {
      amPmData[0].am++;
    }
    else {
      amPmData[0].pm++;
    }
  }

  if(amPmData[0].am > amPmData[0].pm){
    ampmResult = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre minuit et midi 😈`
  } else {
    ampmResult = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre midi et minuit 😈`
  }


  // console.log('STACKED BAR : ', createBarplot(amPmData))
  console.log('STACKED BAR ', info2Chart(amPmData))
  
  const info2 = `À gauche, tu peux voir le pourcentage des crash entre minuit et midi (AM) 
  et entre midi et minuit (PM). 
  ${ampmResult} `

  const info2Div = document.querySelector('#info2Chart')
  info2Div.innerHTML = info2;

  console.log(info2)
}

//FONCTION POUR STACKED BAR PRISE DE https://observablehq.com/@eesur/d3-single-stacked-bar
// function createBarplot(data) {
//   const margin = {top: 20, right: 20, bottom: 30, left: 50};
//   const width = 500 - margin.left - margin.right;
//   const height = 100 - margin.top - margin.bottom;

//   // create SVG element
//   const svg = d3.select("body")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//       "translate(" + margin.left + "," + margin.top + ")");

//   // create x and y scales
//   const xScale = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.value)])
//     .range([0, width]);

//   const yScale = d3.scaleBand()
//     .range([height, 0])
//     .domain(data.map(d => d.label))
//     .padding(0.1);

//   // add bars to SVG
//   svg.selectAll(".bar")
//     .data(data)
//     .enter().append("rect")
//     .attr("class", "bar")
//     .attr("x", 0)
//     .attr("y", d => yScale(d.label))
//     .attr("width", d => xScale(d.value))
//     .attr("height", yScale.bandwidth())
//     .style("fill", "steelblue");

//   // add x axis to SVG
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(xScale));

//   // add y axis to SVG
//   svg.append("g")
//     .call(d3.axisLeft(yScale));
// }

const info2Chart = (data) => {
  var chart = d3.select('#testId')
  var margin = {
    top: 50,
    right: 0,
    bottom: 20,
    left: 30,
  };
  var width = chart.attr('width') - margin.left - margin.right;
  var height = chart.attr('height') - margin.top - margin.bottom;
  var innerChart = chart.append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var pFormat = d3.format('.2r');

var total = d3.sum(data, function(d) { return d.am + d.pm; });

data.map(function(d) {
  d.am = d.am / total;
  d.pm = d.pm / total;
});

var x = d3.scaleLinear()
  .domain([0, d3.max([
    d3.max(data, function(d) { return d.am; }),
    d3.max(data, function(d) { return d.pm; })
   ])])
  .rangeRound([0, width / 2]);

  var y = d3.scaleBand()
  .domain(data.map(function(d) { return d.info; }))
  .rangeRound([0, height]);

  var info = innerChart.selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('transform', function(d, i) {
    return 'translate(0, ' + (i * y.bandwidth()) + ')';
  });

  info.append('rect')
  .attr('class', 'bar bar--female')
  .attr('x', function(d) { return (width / 2) - x(d.am); })
  .attr('width', function(d) { return x(d.am); })
  .attr('height', y.bandwidth());

  info.append('text')
  .attr('class', 'label')
  .attr('alignment-baseline', 'middle')
  .attr('x', function(d) { return (width / 2) - x(d.am) + 4; })
  .attr('y', y.bandwidth() / 2)
  .text(function(d) {
    return pFormat(d.am * 100);
  });

  info.append('rect')
  .attr('class', 'bar bar--male')
  .attr('x', width / 2)
  .attr('width', function(d) { return x(d.pm); })
  .attr('height', y.bandwidth());

  info.append('text')
  .attr('class', 'label')
  .attr('alignment-baseline', 'middle')
  .attr('text-anchor', 'end')
  .attr('x', function(d) { return (width / 2) + x(d.pm) - 4; })
  .attr('y', y.bandwidth() / 2)
  .text(function(d) {
    return pFormat(d.pm * 100);
  });

  innerChart.append('g')
  .attr('class', 'axis axis--y')
  .call(d3.axisLeft(y));

  chart.append('text')
  .attr('class', 'axis axis--x')
  .attr('x', width / 4)
  .attr('y', height + margin.top + margin.bottom)
  .attr('text-anchor', 'middle')
  .text('AM');

  chart.append('text')
  .attr('class', 'axis axis--x')
  .attr('x', width * .75)
  .attr('y', height + margin.top + margin.bottom)
  .attr('text-anchor', 'middle')
  .text('PM');
}
