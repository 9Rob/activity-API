var axios = require("axios").default;
var inquirer = require("inquirer");

function alert() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "what price are you wishing for? (must be a decimal, no dollar or similar signs)",
      name: "price"
    },
    {
      type: "input",
      message: "what's the email that you want to be notified on?",
      name: "email"
    },
    {
      type: "input",
      message: "whats the id of the game you wanted?",
      name: "gameid"
    }
  ])
  .then(function(inquirerResponse) {
      var options = {
        method: 'GET',
        url: 'https://cheapshark-game-deals.p.rapidapi.com/alerts',
        params: {action: 'set', email: inquirerResponse.email, gameID: inquirerResponse.gameid, price: inquirerResponse.price},
        headers: {
          'x-rapidapi-key': '40db8a69bdmshbf4d7c2d3d7e633p11e2bajsn07e4904114cb',
          'x-rapidapi-host': 'cheapshark-game-deals.p.rapidapi.com'
        }
      };
      axios.request(options).then(function (response) {
        console.log(response.data);
        if (response.data === true) {
          console.log("Alert set");
          inquirer
        .prompt([
    {
      type: "confirm",
      message: "do you want to make another alert?",
      name: "confirm4"
    }
  ])
  .then(function(inquirerResponse) { 
    if (inquirerResponse.confirm4) {
    findgameid();
    } else {
      console.log("alright, hope this app helped you in any way, shape, or form");
    }
  })
        } else {
          console.log("Please make sure you inputted your details correctly.");
          alert();
        }
      }).catch(function (error) {
        console.error("something went wrong, please make sure you inputted everything correctly");
        alert();
      });

  });
}

function findgameid() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "whats the name of the game? You will need to get the ID of this game in order to make the alert.",
      name: "game"
    }
  ])
  .then(function(inquirerResponse) {
      var options = {
        method: 'GET',
        url: 'https://cheapshark-game-deals.p.rapidapi.com/games',
        params: {title: inquirerResponse.game, exact: '0', limit: '60'},
        headers: {
          'x-rapidapi-key': '40db8a69bdmshbf4d7c2d3d7e633p11e2bajsn07e4904114cb',
          'x-rapidapi-host': 'cheapshark-game-deals.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
        console.log("remember this number, youll need it for your alert!");
        alert();
      }).catch(function (error) {
        console.error("sorry, something went wrong, make sure you typed everything correctly.");
        findgameid();
      });
  });
}

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
        console.log(response.data);
        question();
      }).catch(function (error) {
        console.error("Sorry, we couldn't find that game. :(");
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
        console.log(response.data);
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
    inquirer
  .prompt([
    {
      type: "confirm",
      message: "do you want to make an alert for a game you found to see if it lowers in price even more?",
      name: "confirm3"
    }
  ])
  .then(function(inquirerResponse) { 
  if (inquirerResponse.confirm3) {
  findgameid();
  } else {
    console.log("alright, hope this app helped you in any way, shape, or form");
  }
})
}
})
}

bigquestion();






