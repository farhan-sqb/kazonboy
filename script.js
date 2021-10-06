let visitedtownsArray = [];
let towns = [];

const fetchExternalData = async () => {
    const results = await Promise.all([
        fetch('https://github.com/niborium/testfiles/blob/master/land.json'),
        fetch('https://github.com/niborium/testfiles/blob/master/stad.json')
    ]);
    return await Promise.all(results.map(result => result.json()));
};
  
fetchExternalData()
   .then(result => {
    
    let options = result[0];
    let stader = result[1];

    towns.push(stader);
    //console.log(towns);

    const selectBox = document.getElementById('land');
    const staderheader = document.getElementById('staderheader');
    

    //Skriv ut länder till min selectionbox
    for(let i = 0, l = options.length; i < l; i++){
    let option = options[i];
    selectBox.options.add( new Option(option.countryname, option.id) );
    
    staderheader.insertAdjacentHTML("afterbegin", "<div id='" + options[i].id + "'><h2>Du har valt: " + options[i].countryname + "</h2></div>");

    //Skriv ut en meny med städer (knappar för respektive stad)
    for (x = 0; x < stader.length; x++) {
        if (stader[x].countryid === options[i].id) {
            const getcid = document.getElementById(options[i].id)
            getcid.insertAdjacentHTML("beforeend", '<button onclick="RenderCityInfo(this)">' + stader[x].stadname +
             '</button>' +'<div id='+ "city" +stader[x].id+'>' + 
            "Stad: " + stader[x].stadname +  "<br>"+" Invånare: " + stader[x].population+"<br>"+'<button onclick="saveTown(this)">' + "Jag har besökt denna stad" + '</button>'+'</div>'+"<br>");
        }}   

}})
    .catch(console.error);

  
function toggleCityDivs() {
        //Togglar fram rätt div beroende på vilket land du väljer.
        var fetchland = document.getElementById("land");
        var selectedValue = fetchland.options[fetchland.selectedIndex].value;
        document.getElementById(selectedValue).style.display = 'block';
       // minimerabesoktastader()

}
RenderCityInfo =function(link) {
    //Togglar fram rätt div beroende på vilket stad du väljer.
    var t = link.nextElementSibling //.textContent;
    t.style.display = 'block';
}

function saveTown(element) {
   //När man klickar på knappen så kikar den parentNoden.
    var stad = element.parentNode;
    // Sätter stadsid till localStorage och pushar den till arrayen. 
    localStorage.setItem(stad.id, stad.id)
    visitedtownsArray.push(stad.id)
    RenderVisitedCountries()
    document.querySelectorAll('.visited').forEach(e => e.remove());
    document.querySelectorAll(".visited").forEach(a=>a.style.display = "none");
  }

function togglebesoktastader() {
    document.getElementById('besoktastader').style.display = 'block';
    document.querySelectorAll(".visited").forEach(a=>a.style.display = "initial");


    RenderVisitedCountries()
}

function minimerabesoktastader(){
    document.querySelectorAll('.visited').forEach(e => e.remove());
    document.getElementById('besoktastader').style.display = 'none';
    document.getElementById('buttonBesoktaStader').style.display = 'block';
    //test: document.getElementById('land').style.display = 'block';
}

function RenderVisitedCountries() {
   //test: document.getElementById('land').style.display = 'none';
 
   Object.keys(localStorage).forEach(function(key){

    //Fångar textConent från diven baserat på stadsid (key i localStorage). Trimmar sedan strängen och presenterar på sidan.
    const fetchdiv = document.getElementById(key);
    var value=fetchdiv.textContent;

    //fångar div ID för att sätta detta på mina paragrafer längre ned.
    var getdivid=fetchdiv.id;
  
   //tar bort 'Jag har besökt denna stad' från strängen som läses in även via textContent.
    var finalString=value.replace("Jag har besökt denna stad","");
    //fixar ihop antalet invånare från samma sträng och räknar ihop + skriver ut
    
    var numbers = value.match(/\d+/g).map(Number);
    console.log(numbers);
    

    const besoktastader = document.getElementById("besoktastader");
    besoktastader.insertAdjacentHTML("afterend", "<p class='visited' id="+getdivid+">"+finalString+" <button onclick='removeVisitedTown(this)'>"+"Ta bort besökt stad"+"</button>"+"</p>");
 });
}

function removeVisitedTown(element){
    var closest = element.parentNode;
    closest.remove();
     
    //Hantera borttag localStoage
    var stad = closest.id
    localStorage.removeItem(stad);
}


    //TO-DO (kvar att göra)
    // Räkna ihop alla man potentiellt kan träffat (totala summan invånare från besöka länder)
    // göm knappar (om man redan lagt till den sedan tidigare)
    // om man väljer annat land, göm andra ländernas divar.
