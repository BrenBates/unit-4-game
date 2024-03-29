///////////////////////////
//Create fighter objects //
///////////////////////////

$(document).ready(function() {


function initCharacters() { 

    Luke = {
    "Name" : "Luke Skywalker",
    "atkPower" : 18,
    "counterAtk" : 10, 
    "hitPoints" : 100,
    "Picture" : "assets/images/lukeskywalker.jpeg"
};


    Obi= {
    "Name" : "Obi Wan Kenobi",
    "atkPower" : 12,
    "counterAtk" : 5, 
    "hitPoints" : 120,
    "Picture" : "assets/images/obiwan.jpeg"
};


    Maul= {
    "Name" : "Darth Maul",
    "atkPower" : 3,
    "counterAtk" : 17, 
    "hitPoints" : 180,
    "Picture" : "assets/images/darthmaul.jpg"
};

    Sidious= {
    "Name" : "Darth Sidious",
    "atkPower" : 5,
    "counterAtk" : 15, 
    "hitPoints" : 150,
    "Picture" : "assets/images/darthsidious.png"
};



};

////////////////////
//global variables//
////////////////////
let Obi = {};
let Luke = {};
let Maul = {};
let Sidious = {};

let baseAtk = 0;    
let yourCharacter;
let defender;
let fighterSelected = false;
let defenderSelected = false;
let gameOver = false;
let restartAvailable = false;




//Put all the fighter objects into an array.

//////////////////////////
/// Main Game Process  ///
//////////////////////////



//Build the character cards at the top of the screen for character selection.
initCharacters();
Fighters = [Obi, Luke, Sidious, Maul];

fighterList('characterList');
$('#msg').append('No enemy here');

runGame();

//If a fighter has yet to be selected, when the player clicks their character's image, move it to the Your Character section.  Then, remove that character from the Fighters array.

function runGame() { 

$(document).on("click","img", function () {

    if(fighterSelected === false) {

        for(var j=0; j < Fighters.length; j++) {
            if(this.id === Fighters[j].Name) {
                buildCharCard('playerCharacter',Fighters[j]);
                yourCharacter = Fighters[j];
                removeCharacter(yourCharacter);
                fighterSelected = true;
                //Remove the remaining characters from the top of the screen and turn then into enemies!  Gotta slay them all.
                $('#characterList').children().remove();
                fighterList('enemyList');
                baseAtk = yourCharacter.atkPower;
                //return the base attack power of your character to be used later in the fight sequence.
                return baseAtk;
            }
        }
    }

//Next we need to pick an enemy to fight, move them to the defender section and rebuild the Fighters array and enemies available section. 

    if(fighterSelected === true && defenderSelected === false && this.id !== yourCharacter.Name) { 
        for(var j=0; j < Fighters.length; j++) {
            if(this.id === Fighters[j].Name) {
                defender = Fighters[j];
                buildCharCard('defender', defender);
                removeCharacter(defender);
                $('#enemyList').children().remove();
                fighterList('enemyList');
                defenderSelected = true;
                $('#msg').empty().append('A wild ' + defender.Name + ' appears!');
            }
        }
    }

});

//For the fight sequence, need to make an on click for the button and adjust stats for the objects based on the battle mechanics.

$(document).on("click","#attackButton", function () {

    if (gameOver === false && defenderSelected === false) {
        $('#msg').empty().append('No enemy here');
    }

    if (gameOver === false && defenderSelected === true) {

        var damageDealt = yourCharacter.atkPower;
        defender.hitPoints -= damageDealt;
        yourCharacter.hitPoints -= defender.counterAtk;
        yourCharacter.atkPower += baseAtk;
        //refresh char cards with updated hit points.
        $('#defender').children().remove();
        $('#playerCharacter').children().remove();
        buildCharCard('defender', defender);
        buildCharCard('playerCharacter',yourCharacter);
        $('#msg').empty().append('You attacked ' + defender.Name + 'and did ' + damageDealt + ' damage.' + ' It is super effective!' );
        $('#msg').append('<br>' + defender.Name + ' attacked you back for ' + defender.counterAtk + ' damage.');
    
        if(defender.hitPoints <= 0) {
            $('#msg').empty().append('You have defeated ' + defender.Name + '!');
            $('#defender').children().remove();
            removeCharacter(defender);
            defenderSelected = false;
        }
    
        if(Fighters.length === 0 && defenderSelected === false) {
            $('#msg').empty().append('Congratulations, you have won the game!');
            gameOver = true;
        }
    
        if(yourCharacter.hitPoints <= 0) {
            $('#msg').empty().append('You have been defeated, game over!')
            gameOver = true;
        }

    }

    if (gameOver === true && restartAvailable === false) {
        restartButton = $('<button>');
        restartButton.append('Restart');
        restartButton.attr('id','restartButton');
        $('#restart').append(restartButton);
        restartAvailable = true;
    }
  
});

};


$(document).on("click","#restartButton", function () {
    //Reset game
    restartGame();
    });



 ////////////////////
///   Functions   ///
////////////////////

//Define a function to build a fighter list, since this is done a lot.

function fighterList(aDiv) { 
    for(var i=0; i < Fighters.length; i++) { 
        buildCharCard(aDiv,Fighters[i]);
    }
}


//Define a function that will build a character card given the Div where to build it and the fighter object.

function buildCharCard(aDiv, aFighter) {
    newDiv = $('<div>');
    newParagraph = $('<p>');
    newImage = $('<img>');
    imageID = aFighter.Name;
    newImage.attr('id',imageID);
    hpParagraph = $('<p>').append(aFighter.hitPoints);
    $(newImage).attr("src",aFighter.Picture);
    $(newParagraph).append(aFighter.Name);
    //add character class, so I can do the base styling for each character card.
    $(newDiv).addClass("character");
    //Adding an additional class that's equal to the div name, this allows me to style the background color of the Your Character, Enemies Available and Defender sections
    //differently.
    $(newDiv).addClass(aDiv);
    $(newDiv).append(newParagraph);
    $(newDiv).append(newImage);
    $(newDiv).append(hpParagraph);
    $('#'+ aDiv).append(newDiv);
}

//Define a function that will remove a character from the Fighters array. 

function removeCharacter(aFighter) {

    for (var k = 0; k < Fighters.length; k++) {
        if ( Fighters[k] === aFighter) {
            Fighters.splice(k,1);
        }
    }
}

function restartGame() { 

    //empty all divs
    $('#msg').empty();
    $('#playerCharacter').empty();
    $('#defender').empty();
    $('#enemyList').empty();
    $('#characterList').empty();
    $('#restart').empty();
    
    //reset all variables and player characters
        baseAtk = 0;    
        yourCharacter = { };
        defender = { };
        fighterSelected = false;
        defenderSelected = false;
        gameOver = false;
        restartAvailable = false;
    //reinitialize characters and build them into the characterList.
    initCharacters();
    Fighters = [Obi, Luke, Sidious, Maul];

    //rebuild character list for player to choose from, populate that there's no enemy present.
    fighterList('characterList');
    $('#msg').append('No enemy here');
    
    
    };


});

