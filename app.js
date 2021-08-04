var axios = require("axios").default;
var inquirer = require("inquirer"); 
const { table } = require('table');
const chalk = require('chalk');
const ora = require('ora');
const CFonts = require('cfonts');

const spinner = ora('Finding the best deals...\n');
  spinner.spinner = {
    frames: [	"_",
    "_",
    "_",
    "-",
    "`",
    "`",
    "'",
    "´",
    "-",
    "_",
    "_",
    "_"]
  }

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
          console.log(chalk.whiteBright.underline.bgGreen("Alert set! You're good to go!"));
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
      CFonts.say('Hope  this|helped you!', {
        font: 'grid',              // define the font face
        align: 'left',              // define text alignment
        colors: ['red'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '6',             // define how many character can be on one line
        gradient: true,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment CFonts is being executed in
      });
    }
  })
        } else {
          console.log(chalk.whiteBright.underline.bgRedBright("Please make sure you inputted your details correctly."));
          alert();
        }
      }).catch(function (error) {
        console.error(chalk.whiteBright.underline.bgRedBright("a fatal error occured."));
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
      console.log("\n-----------------------------------------------------------------------------------------------------");
      spinner.start("finding gameID and information...");
      axios.request(options).then(function (response) {
        console.log(response.data);
        spinner.succeed(chalk.whiteBright.underline.bgGreen("Heres what we found! Remember the gameID, you need it to make an alert!"));        
        alert();
      }).catch(function (error) {
        spinner.fail(chalk.whiteBright.underline.bgRedBright("Sorry, we couldnt find the game you wanted. :("));
        findgameid();
      });
  });
}

function bigquestion() {
  CFonts.say('Video Game|Deal  Finder!', {
    font: 'grid',              // define the font face
    align: 'left',              // define text alignment
    colors: ['red'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 1,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '6',             // define how many character can be on one line
    gradient: true,            // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false,  // define if this is a transition between colors directly
    env: 'node'                 // define the environment CFonts is being executed in
  });
  
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
          'x-rapidapi-key': '4fe7a5e961mshc4441de8ddc7fb9p1aaa13jsn4207ba11ad8a',
          'x-rapidapi-host': 'game-prices.p.rapidapi.com'
        }
      };
      console.log("\n-----------------------------------------------------------------------------------------------------");
      spinner.start(chalk.whiteBright.underline.bgBlueBright('Finding the best deals...\n'));
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
        data.push([chalk.inverse("$") + chalk.inverse(element.price), element.seller, element.url])
        
      }
  
        const config = {
          columnDefault: {
            width: 28,
          },
          header: {
            alignment: 'center',
            content: chalk.red(gameName) + "\n" + chalk.green(gameDev) + "\n" + chalk.blue(release),
          },
        }
        
        console.log(table(data, config));
        spinner.succeed(chalk.whiteBright.underline.bgGreen("Heres what we found!"));

        console.log("the best deal is "+ chalk.underline("$") + chalk.underline(lowestPrice) + " from seller " + chalk.underline(storesArr[0].seller))

        question();
      }).catch(function (error) {
        spinner.fail(chalk.whiteBright.underline.bgRedBright("Sorry, we couldnt find the game you wanted. :("));
        question();
      });
      
    }
    else {
      CFonts.say('Why even tell me| :/', {
        font: 'huge',              // define the font face
        align: 'left',              // define text alignment
        colors: ['red'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: true,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment CFonts is being executed in
      });
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
          'x-rapidapi-key': '4fe7a5e961mshc4441de8ddc7fb9p1aaa13jsn4207ba11ad8a',
          'x-rapidapi-host': 'game-prices.p.rapidapi.com'
        }
      };
      console.log("\n-----------------------------------------------------------------------------------------------------");
      spinner.start(chalk.whiteBright.underline.bgBlueBright('Finding the best deals...\n'));
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
        spinner.succeed(chalk.whiteBright.underline.bgGreen("Heres what we found!"));
        console.log("the best deal is $" + lowestPrice + " from seller " + storesArr[0].seller)
        question();
      }).catch(function (error) {
        spinner.fail(chalk.whiteBright.underline.bgRedBright("Sorry, we couldnt find the game you wanted. :("));
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
    CFonts.say('Hope  this|helped you!', {
      font: 'grid',              // define the font face
      align: 'left',              // define text alignment
      colors: ['red'],         // define all colors
      background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
      letterSpacing: 1,           // define letter spacing
      lineHeight: 1,              // define the line height
      space: true,                // define if the output text should have empty lines on top and on the bottom
      maxLength: '6',             // define how many character can be on one line
      gradient: true,            // define your two gradient colors
      independentGradient: false, // define if you want to recalculate the gradient for each new line
      transitionGradient: false,  // define if this is a transition between colors directly
      env: 'node'                 // define the environment CFonts is being executed in
    });
  }
})
}
})
}

bigquestion();











