
import Papa from 'papaparse';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhqGisHMwTX3N310wCgc743KYt9uf8gbgGEXiNQuV-D43PZnm9CX6nhhPHoxUddbq3WQVTY5WCPK6o/pub?output=csv';

const response = await fetch(url);
const data = await response.text();

Papa.parse(data, {
    header: true,
    complete: (results) => {
        console.log("Headers:", results.meta.fields);
    }
});
