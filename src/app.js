import * as d3 from "d3";
import * as cloud from 'd3-cloud';

//📄🟦 Récupère les donnée de crash
d3.csv("./data/crashDataSet.csv")
  .then(function (data) {
    console.log("data 1", data);

    // data.forEach(function (d) {
    //   console.log("le pays :  ", d.Location.split(' ').pop()); // Affiche les valeurs de chaque ligne
    // });
    const countryData = data.filter(d => d.Location.split(' ').pop() === 'Switzerland');
    console.log("country data", countryData)
    displayOneCountry('Switzerland', countryData)
  })
  .catch(function (error) {
    console.log("il y a une erreur : ", error);
  }); 

//📄🟦 Récupère les donnée de dernière parole
d3.csv("./data/lastWords.csv")
  .then(function (data) {
    info3Stuff(data);
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


//📄🟦 La fonction displayOneCountry s'occupe d'ajouter la class 
//displayed à la div oneCountry
const displayOneCountry = (countryName, countryData) => {
  //faire que la section de l'europe disparaisse

  //get the div with class displayed and change it to hidden
  const europe = document.querySelector('.displayed');
  europe.classList.remove('displayed');
  europe.classList.add('hidden');
  //select the div with the id "country" and change it to displayed
  const countryDiv = document.querySelector('#oneCountry');
  countryDiv.classList.remove('hidden');
  countryDiv.classList.add('displayed');

  //display call displayCountryData
  displayCountryData(countryName, countryData);
}

//📄🟦 La fonction displayCountryData s'occupe d'afficher les données en 4 parties
// Chaque partie est divisée en plusieurs parties : 
  //info1Text : le texte de la partie 1
  //info1Chart : le graphique de la partie 1
//elles sont ensuite insérées dans le div avec l'id "info1Div"
const displayCountryData = (countryName, data) => {
  //TECHNICAL SECTION : LES LIGNES DE CODES SUIVANTES S'OCCUPE DE RECUPERER LES DIVS DE CHAQUE PARTIE
  const countryNameH1 = document.querySelector('#countryName');
  const info1Div = document.querySelector('#info1Div');
  const info2Div = document.querySelector('#info2Div');
  const info3Div = document.querySelector('#info3Div');
  const info4Div = document.querySelector('#info4Div');

  //📄🟦 PARTIE 1
  function info1Stuff() {
    countryNameH1.innerHTML = countryName;
    const info1Text = `
    <svg viewBox="0 0 20 20" width="200" height="200" >
    
    </svg>
    <p class="infoText1">Salut toi 👋, C’est bientôt l’été, les vacances, le temps de prendre l’avion ! Qu’en dis-tu d’en savoir plus sur ces anges de fer qui survolent notre ciel ?
    Savais-tu qu’il  y a eu ${data.length} crash d’avions en ${countryName} depuis 1900. Tu peux voir à gauche le lieu de ces crashs!
    Scroll si tu as le courage d’en découvrir plus sur ces crashs😈</p>`
  
    //TODO: info1Chart
    //ajout du texte dans le div using insertAdjacentHTML
    info1Div.insertAdjacentHTML('beforeend', info1Text);
  }
  info1Stuff();


  //📄🟦 PARTIE 2 
  function info2Stuff() {
    let info2Text = '';
    let amPmData = [
      {info: '%', am: 0, pm: 0}
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
      info2Text = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre minuit et midi 😈`
    } else {
      info2Text = `Comme tu peux le voir en ${countryName}, tu ferais mieux de voyager entre midi et minuit 😈`
    }
  
    info2ChartFunction(amPmData);
    
    const info2 = `
    <p class="infoText2">  À gauche, tu peux voir le pourcentage des crash entre minuit et midi (AM) 
    et entre midi et minuit (PM). 
    ${info2Text}</p> `
  
    info2Div.insertAdjacentHTML('beforeend', info2);
  }
  info2Stuff();



  //📄🟦 PARTIE 4 
  function info4Stuff() {
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
  
    const info4Text = `<p class="infoText1">En ${countryName}, Si tu veux avoir le moins de chance de crasher, évite de prendre la compagnie ${mostCrashes}, pas besoin de nous remercier 😘😈 </p>`
    createBarChart(operatorData);
  
    info4Div.insertAdjacentHTML('beforeend', info4Text);
  }
  info4Stuff();

}

//📄🟦 PARTIE 3
//étant donnée que la partie 3 est la même pour tous les pays, elle n'est pas dans la fonction displayCountryData
function info3Stuff(lastWordsData) {
  console.log('last words', lastWordsData)
  //make every word lowercase and remove the ,
  lastWordsData.forEach(function (d) {
    d.Last_words = d.Last_words.toLowerCase();
    d.Last_words = d.Last_words.replace(',', '');
  })


  const lastWordsDataClean = [];

  //go trough the lastWordsData array, foreach Last_words[i] seperate every word and add it to the lastWordsDataClean array like this : {word: 'word', count: 1}
  //if the word is already in the array, increment the count by 1, if the word is smaller than 3 characters, don't add it
  lastWordsData.forEach(function (d) {
    let words = d.Last_words.split(' ');
    words.forEach(function (word) {
      if (word.length < 5) return;
      let wordIndex = lastWordsDataClean.findIndex(function (element) {
        return element.word === word;
      })
      if (wordIndex === -1) {
        lastWordsDataClean.push({ word: word, size: 1 })
      }
      else {
        lastWordsDataClean[wordIndex].size++;
      }
    })
  }
  )
  //now make an array with ony the 7 most used words
  let lastWordsDataCleanTop7 = lastWordsDataClean.sort(function (a, b) {
    return b.size - a.size;
  }
  ).slice(0, 7);

  console.log('last words clean', lastWordsDataCleanTop7)
  wordCloudChart(lastWordsDataCleanTop7);
}





  //FONCTIONS DE CREATION DES CHARTS 
const info2ChartFunction = (data) => {
  var chart = d3.select('#info2Svg')
  var margin = {
    top: 50,
    right: 0,
    bottom: 20,
    left: 30,
  };

  var width = chart.attr('width') - margin.left - margin.right;
  var height = 100;
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
  .style('fill', '#B3FFFA')  // Set text color to white
  .style('font-weight', 'bold')  // Make text bold
  .style('font-size', '25px')  // Increase text size
  .text(function(d) {
    return pFormat(d.am * 100);
  });

  info.append('rect')
  .attr('class', 'bar bar--male')
  .attr('x', width / 2)
  .attr('width', function(d) { return x(d.pm); })
  .attr('height', y.bandwidth())

  info.append('text')
  .attr('class', 'label')
  .attr('alignment-baseline', 'middle')
  .attr('text-anchor', 'end')
  .attr('x', function(d) { return (width / 2) + x(d.pm) - 4; })
  .attr('y', y.bandwidth() / 2)
  .style('fill', '#FFE1B5')  // Set text color to white
  .style('font-weight', 'bold')  // Make text bold
  .style('font-size', '25px')  // Increase text size
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
  const svg = d3.select("#info4Svg");

  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // sort the data in descending order based on count
  data.sort((a, b) => b.count - a.count);

  // select only the first 5 elements of the sorted data
  data = data.slice(0, 5);

  x.domain(data.map((d) => d.operator));
  y.domain([0, d3.max(data, (d) => d.count)]);

  g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

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
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.operator))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.count))
    .attr("rx", 10) // Set the horizontal corner radius
    .attr("ry", 10); // Set the vertical corner radius
}

// var data = [{word: "Running", size: "10"}, {word: "Shit", size: "30"},{word: "AAAAH", size: "7"},]
function wordCloudChart(data) {
  // set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 450 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#info3Svg").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = cloud()
.size([width, height])
.words(data.map(function(d) { return {text: d.word, size:d.size}; }))
.padding(5)        //space between words
.rotate(function() { return ~~0})
.fontSize(function(d) { return d.size * 5; })      // font size of words
.on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
svg
.append("g")
  .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
  .selectAll("text")
    .data(words)
  .enter().append("text")
    .style("font-size", function(d) { return d.size; })
    .style("fill", "#ffffff")
    .attr("text-anchor", "middle")
    .style("font-family", "Impact")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}

}


//🌅GRADIENTS : 
// Define the gradient
const svg = d3.select("#info4Svg")
const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "bar-gradient")
  .attr("gradientTransform", "rotate(90)");

// Add color stops to the gradient
gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#000000");

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#548800");


  //dégradé orange
  const svg2 = d3.select("#info2Svg")
  const gradient2 = svg2.append("defs")
    .append("linearGradient")
    .attr("id", "orange-gradient")
    .attr("gradientTransform", "rotate(120)");
  
  // Add color stops to the gradient
  gradient2.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FF990070");
  
  gradient2.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FF990000");
  
  //dégradé bleu
  const svg3 = d3.select("#info2Svg")
  const gradient3 = svg3.append("defs")
    .append("linearGradient")
    .attr("id", "blue-gradient")
    .attr("gradientTransform", "rotate(33)");
  
  // Add color stops to the gradient
  gradient3.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#0CFFF0");
  
  gradient3.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0CFFF000");