// import { csv } from "d3-fetch";
import * as d3 from "d3";

d3.csv("./data/crashDataSet.csv")
  .then(function (data) {
    console.log("data 1", data);

    // data.forEach(function (d) {
    //   console.log("le pays :  ", d.Location.split(' ').pop()); // Affiche les valeurs de chaque ligne
    // });
    const countryData = data.filter(d => d.Location.split(' ').pop() === 'Germany');
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

  // PARTE 4 
  console.log('data', data)
  let operatorData = []
  let mostCrashes = ''
  data.forEach(function (d) {
    //if the operator is not in the array, add it like this : {operator: 'operatorName', count: 1}
    //if the operator is already in the array, increment the count by 1
    let operator = d.Operator;
    let operatorIndex = operatorData.findIndex(function (element) {
      return element.operator === operator;
    }
    )
    if (operatorIndex === -1) {
      operatorData.push({ operator: operator, count: 1 })
    }
    else {
      operatorData[operatorIndex].count++;
    }
  })

  //get the operator with the highest count
  let highestCount = 0;
  operatorData.forEach(function (d) {
    if (d.count > highestCount) {
      highestCount = d.count;
      mostCrashes = d.operator;
    }
  })
  console.log('operatorData', operatorData)
  console.log('mostCrashes', mostCrashes)

  const info4 = `En ${countryName}, Si tu veux avoir le moins de chance de crasher, évite de prendre la compagnie ${mostCrashes}, pas besoin de nous remercier 😘😈`

  createBarChart(operatorData);

}

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


function createBarChart(data) {
  const svg = d3.select("#info4Svg")

  const margin = {top: 20, right: 20, bottom: 30, left: 50};
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // sort the data in descending order based on count
  data.sort((a, b) => b.count - a.count);

  // select only the first 5 elements of the sorted data
  data = data.slice(0, 5);

  x.domain(data.map(d => d.operator));
  y.domain([0, d3.max(data, d => d.count)]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Count");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.operator))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", "green"); // set the fill color to green

}

createBarChart(data);

