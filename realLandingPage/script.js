// import { localStorage } from '../../storage';

var startPoint = null;

function debounce(func, delay = 700) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const categories = [
    { value: "natural", label: "Natural" },
    { value: "cultural", label: "Cultural" }, // religion + cultural
    { value: "historic", label: "Historical" },
    { value: "religion", label: "Religious" },
    { value: "architecture", label: "Architecture" },
    { value: "industrial_facilities", label: "Industrial Facilities" },
    { value: "amusements", label: "Amusements" },
    { value: "sports", label: "Sports" },
    { value: "others", label: "Other Interesting Places" },
  ];

function autocomplete(inp) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", debounce(async function(e) {
      // console.log(countries);
      var val = inp.value;
      var a, b, i;

      if (!val) { return false;}
      currentFocus = -1;
      closeAllLists();
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", inp.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      inp.parentNode.appendChild(a);

      b = document.createElement("DIV");
      b.innerHTML = "Searching...";
      b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = "";
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
      });
      a.appendChild(b);

      countries = await searchPlace(val);
      // closeAllLists();

      // add a loader if countries length is 0
      if(countries.length == 0) {
        // b = document.createElement("DIV");
        b.innerHTML = "No such place found...";  
        a.appendChild(b);   
      }
      else {
        a.removeChild(b);
      }

      /*for each item in the array...*/
      for (i = 0; i < countries.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
      //   if (countries[i].name.includes(val)) {
          /*create a DIV element for each matching element:*/
          var desc = countries[i].kind;
          for (var cI of categories) {
              if (countries[i].kind.includes(cI.value)) {
                  desc = cI.label;
                  break;
              }
          };

          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + countries[i].name.substr(0, val.length) + "</strong>";
          b.innerHTML += countries[i].name.substr(val.length);
          b.innerHTML += "<br><font size=2.5>" + desc + "</font>";
          /*insert a input field that will hold the current countriesay item's value:*/
          b.innerHTML += "<input type='hidden' value='" + countries[i].name + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;

              var selected = countries.find(function(x) { return x.name == inp.value });

              startPoint = selected;
              window.localStorage.setItem('start-point', JSON.stringify(startPoint));
              // window.sessionStorage.setItem('startPoint', startPoint);

              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
      //   }
      }
  }));

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", async function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

async function searchPlace(name) {

      // const jwt = await AsyncStorage.getItem('jwt');

      const body = {
          'name': name.trim()
      };

      try {
          const result = await fetch("https://api.tripyojan.com/searchPlace/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(body),
          });

          return await result.json();
      }
      catch (e) {
          return {
              'error': e
          };
      }
  }

/*An array containing all the country names in the world:*/
var countries = [];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);

function gotoPlanningPage() {

  // localStorage.setItem('yo', 'lowde');

  // check if a starting point is selected
  // var sp = window.localStorage.getItem('startPoint');
  if(startPoint) {

    // maybe window.parent will be null if we load it initially
    // later loads will have it as an iframe (assets will be loaded only scripts, I'll just use local versions)
    // save trip 
    // save waypoints
    if(window.self == window.top) {

      // const waypoints = [startPoint];

      // const trip = {
      //     // tripId and userId will be set when it is saved for the first time
      //     name: 'Untitled',
      //     description: 'Just a nice nice trip...',
      //     waypoints: waypoints,
      //     totalDistance: 0,
      //     totalTime: 0
      // }

      // const tripStore = {
      //   trip: trip,
      //   waypoints: waypoints,
      //   prevWaypoints: [],
      //   loadTrip: false
      // }

      window.localStorage.setItem('start-point', JSON.stringify(startPoint));
      return true;
    }

    return gotoMap();

  }
  // show warning toast
  else {
    var x = document.getElementById("snackbar");
    x.innerHTML = "Please select a starting point from dropdown!";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

    return false;
  }

  // return false;

}

function gotoMap() {
  // goto planning page
  const message = {
    type: 'goto map',
    startPoint: startPoint
  }

  window.parent.postMessage(JSON.stringify(message));
  return false;
}

function gotoPrivacyPolicy() {

  if(window.self == window.top) {
    return true;
  }

  const message = {
    type: 'gotoPrivacyPolicy'
  };

  window.parent.postMessage(JSON.stringify(message));
  return false;
}

function gotoTermsOfService() {

  if(window.self == window.top) {
    return true;
  }

  const message = {
    type: 'gotoTermsOfService'
  };
  
  window.parent.postMessage(JSON.stringify(message));
  return false;
}

function gotoContactUs() {

  if(window.self == window.top) {
    return true;
  }

  const message = {
    type: 'gotoContactUs'
  };
  
  window.parent.postMessage(JSON.stringify(message));
  return false;
}

function gotoTripHistory() {

  if(window.self == window.top) {
    return true;
  }

  const message = {
    type: 'gotoTripHistory'
  };
  
  window.parent.postMessage(JSON.stringify(message));
  return false;
}