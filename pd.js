
var csvData = `52,Bart Janssen,	Conclusion Confidential
33,Sander Rosenhart,	Conclusion Enablement
53,Robbert Waijenberg & Jos Smits,	Virtual Sciences 
59,Roel Gloudemans, Jakob Hofland & Ard van der Lee	,Services
37,Ann Ouvry,D&A
3,Michiel Kroeks,	Conclusion Experience 
51,Mark Leck	,Yellowtail
35,Marc de Beer,	Conclusion Mission Critical
47,Michiel Croon,Conclusion	Consulting
44,Robert Schras,Conclusion ForeyeT	
42,Rene Altena,Conclusion MBS
38,Jeroen Oudenaarden,	Future Facts Conclusion
36,Bas Wencker,Furore
34,Mark Elstgeest, Morgens
43,Simon Lambermon,myBrand
40,Corniels van Winkelen,First8
46,Sebastiaan Leeuwenkamp,	Conclusion AFAS Solutions
31,Ernout Douqué,Hot ITem
1,Anthony Dickinson,Conlusion Low Code Company
41,Jitse Klomp,Xforce
39,Timothy	Pranger,Mediaan Conclusion
30,Erick Schabracq,AMIS`;

var lines = csvData.split('\n');

var result = [];

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  var values = line.split(',');
  result.push({
    "organizationId": values[0],
    "author": values[1],
    "notes": values[2]
  });
}

var jsonData = JSON.stringify(result);
console.log(jsonData);
