var axios = require("axios").default;
var inquirer = require("inquirer");
// including packages for table and styles    
const { table } = require('table');

function bigquestion() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "Hey, what video game that you dont own are you curious about? (if it contains spaces, use dashes instead!)",
      name: "gamename"
    },
    {
      type: "confirm",
      message: "Would you like to find out the best place to buy that game?",
      name: "confirm",
      default: true
    }
  ])
  .then(function(inquirerResponse) {
    if (inquirerResponse.confirm) {
      var options = {
        method: 'GET',
        url: 'https://game-prices.p.rapidapi.com/game/'+inquirerResponse.gamename,
        params: {region: 'us', type: 'game'},
        headers: {
          'x-rapidapi-key': '40db8a69bdmshbf4d7c2d3d7e633p11e2bajsn07e4904114cb',
          'x-rapidapi-host': 'game-prices.p.rapidapi.com'
        }
      };
      console.log("Alright, ill show you!\n");
      axios.request(options).then(function (response) {
        // games we are getting back from api call cheapest is the first on the list
        //console.log(response.data);
        var currency = response.data.currency;
        var lowestPrice = response.data.currentLowestPrice;
        var gameDev = response.data.developer;
        var gameName = response.data.name;
        var release = response.data.releaseDate;
        var storesArr = response.data.stores;


       //creating table to hold info here
       const data = [
        ['Price: ' + currency, 'Seller:', 'URL:'],
      ]
      //data.push([storesArr[0].price, storesArr[0].seller, storesArr[0].url])
      //pushing all store info into our table
      for (let i = 0; i < storesArr.length; i++) {
        var element = storesArr[i];
        data.push(["$" + element.price, element.seller, element.url])
        
      }
  
        const config = {
          columnDefault: {
            width: 28,
          },
          header: {
            alignment: 'center',
            content: gameName + "\n" + gameDev + "\n" + release,
          },
        }
        
        console.log(table(data, config));

        console.log("the best deal is $" + lowestPrice + " from seller " + storesArr[0].seller)

        question();
      }).catch(function (error) {
        console.error(error);
        question();
      });
      
    }
    else {
      console.log("Alright, no worries");
    }
  });
}
function diggquestion() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "Whats it called? (if it contains spaces, use dashes instead!)",
      name: "gamename"
    }
  ])
  .then(function(inquirerResponse) {
      var options = {
        method: 'GET',
        url: 'https://game-prices.p.rapidapi.com/game/'+inquirerResponse.gamename,
        params: {region: 'us', type: 'game'},
        headers: {
          'x-rapidapi-key': '40db8a69bdmshbf4d7c2d3d7e633p11e2bajsn07e4904114cb',
          'x-rapidapi-host': 'game-prices.p.rapidapi.com'
        }
      };
      console.log("Alright, ill show you!\n");
      axios.request(options).then(function (response) {
        //console.log(response.data);
        // games we are getting back from api call cheapest is the first on the list
        //console.log(response.data);
        var currency = response.data.currency;
        var lowestPrice = response.data.currentLowestPrice;
        var gameDev = response.data.developer;
        var gameName = response.data.name;
        var release = response.data.releaseDate;
        var storesArr = response.data.stores;


       //creating table to hold info here
       const data = [
        ['Price: ' + currency, 'Seller:', 'URL:'],
      ]
      //data.push([storesArr[0].price, storesArr[0].seller, storesArr[0].url])
      //pushing all store info into our table
      for (let i = 0; i < storesArr.length; i++) {
        var element = storesArr[i];
        data.push(["$" + element.price, element.seller, element.url])
        
      }
  
        const config = {
          columnDefault: {
            width: 28,
          },
          header: {
            alignment: 'center',
            content: gameName + "\n" + gameDev + "\n" + release,
          },
        }
        
        console.log(table(data, config));

        console.log("the best deal is $" + lowestPrice + " from seller " + storesArr[0].seller)
        question();
      }).catch(function (error) {
        console.error("Sorry, we couldnt find that game. :(");
        question();
      });
    
  });
}
function question() {
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "do you want to find another game?",
      name: "confirm2"
    }
  ])
  .then(function(inquirerResponse) { 
  if (inquirerResponse.confirm2) {
      diggquestion();
  } else {
    console.log("alright, hope that helped");
  }
})
}

bigquestion();






