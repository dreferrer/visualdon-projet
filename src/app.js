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
    {label: 'AM', value: 0},
    {label: 'PM', value: 0}
  ]

  for (let i = 0; i < data.length; i++) {
    if(data[i].Time === '') continue;
    let hour = parseInt(data[i].Time.split(':')[0]);
    if (hour < 12) {
      amPmData[0].value++;
    }
    else {
      amPmData[1].value++;
    }
  }

  if(amPmData[0].value > amPmData[1].value){
    ampmResult = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre minuit et midi 😈`
  } else {
    ampmResult = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre midi et minuit 😈`
  }


  console.log('STACKED BAR : ', stackedBar(amPmData, {
    colors: ['#ff616b', '#fa9442', '#bf36e0']
  }))
  
  const info2 = `À gauche, tu peux voir le pourcentage des crash entre minuit et midi (AM) 
  et entre midi et minuit (PM). 
  ${ampmResult} `

  const info2Div = document.querySelector('#info2')
  info2Div.innerHTML = info2;

  console.log(info2)
}

//FONCTION POUR STACKED BAR PRISE DE https://observablehq.com/@eesur/d3-single-stacked-bar
function stackedBar (data, {
  height = 200,
  width = 1000,
  barHeight = 100,
  halfBarHeight = barHeight / 2,
  f = d3.format('.1f'),
  margin = {top: 20, right: 10, bottom: 20, left: 10},
  w = width - margin.left - margin.right,
  h = height * 0.66,
  colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"]
} = {}) {

  // Have a total of values for reference from the data:
  const total = d3.sum(data, d => d.value);
  console.info('total', total);

  // Format the data (instead of using d3.stack()) and filter out 0 values:
  function groupDataFunc(data) {
    // use a scale to get percentage values
    const percent = d3.scaleLinear()
      .domain([0, total])
      .range([0, 100])
    // filter out data that has zero values
    // also get mapping for next placement
    // (save having to format data for d3 stack)
    let cumulative = 0
    const _data = data.map(d => {
      cumulative += d.value
      return {
        value: d.value,
        // want the cumulative to prior value (start of rect)
        cumulative: cumulative - d.value,
        label: d.label,
        percent: percent(d.value)
      }
    }).filter(d => d.value > 0)
    return _data
  };

  const groupData = groupDataFunc(data);
  console.info('groupData', groupData);

  //FIXME:

  const svg = DOM.svg(width, height);
  const sel = d3.select(svg);
  
  // set up scales for horizontal placement
  const xScale = d3.scaleLinear()
    .domain([0, total])
    .range([0, w]);

  const join = sel.selectAll('g')
    .data(groupData)
    .join('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // stack rect for each data value
  join.append('rect')
    .attr('class', 'rect-stacked')
    .attr('x', d => xScale(d.cumulative))
    .attr('y', h / 2 - halfBarHeight)
    .attr('height', barHeight)
    .attr('width', d => xScale(d.value))
    .style('fill', (d, i) => colors[i]);

  // add values on bar
  join.append('text')
    .attr('class', 'text-value')
    .attr('text-anchor', 'middle')
    .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
    .attr('y', (h / 2) + 5)
    .text(d => d.value);

  // add some labels for percentages
  join.append('text')
    .attr('class', 'text-percent')
    .attr('text-anchor', 'middle')
    .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
    .attr('y', (h / 2) - (halfBarHeight * 1.1))
    .text(d => f(d.percent) + ' %');

  // add the labels
  join.append('text')
    .attr('class', 'text-label')
    .attr('text-anchor', 'middle')
    .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
    .attr('y', (h / 2) + (halfBarHeight * 1.1) + 20)
    .style('fill', (d, i) => colors[i])
    .text(d => d.label);
  
  return svg;
}