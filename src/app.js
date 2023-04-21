import { select } from 'd3-selection';
import { csv} from 'd3-fetch';

const dataCrash = csv('../data/crashDataSet.csv');
const dataLastWords = csv('../data/lastWords.csv');

console.log(dataCrash);  
console.log(dataLastWords);