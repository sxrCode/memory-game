/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function Card() {
    this.isCover = true;
    this.game = null;
    this.cardEle = null;
    let flag = -1;
    this.iconClass = "";

    this.getFlag = function() {
        return flag;
    };
    this.setFlag = function(f) {
        flag = f;
    }

    this.flip = function() {
        this.isCover = false;
        $(this.cardEle).addClass("open").addClass("show");
        console.log('card flag: ' + flag);
    };

    this.cover = function() {
        this.isCover = true;
        $(this.cardEle).removeClass("open").removeClass("show");
    };

    this.onMatchFailure = function() {
        $(this.cardEle).addClass('dismatch');
        setTimeout(function() {
            $(this.cardEle).removeClass('dismatch');
            this.cover();
        }.bind(this), 500);

    };

    this.onMatchSuccess = function() {
        $(this.cardEle).addClass("match");
        console.log('flag ' + flag + ' match success!');
    };

    this.dealClick = function() {
        console.log("this.isCover: " + this.isCover);
        if (this.isCover) {
            this.flip();
            this.game.judge(this);
        }

    };
}

function GradeModule() {
    let stars = $(".stars .fa");
    let maxGrade = stars.length;
    this.grade = maxGrade;
    this.step = 0;

    this.setGrade = function(grade) {
        this.grade = grade;

    };

    function updateStar(grade) {
        let ne = maxGrade - grade
        if (ne > 0) {

        }

    }
}

function Game() {
    this.firstCard = null;
    this.secendCard = null;
    this.isFirst = true;
    this.matchedGroup = 0;
    let step = 0;

    this.judge = function(card) {

        setTimeout(function() {
            if (this.isFirst) {
                this.firstCard = card;
                this.isFirst = false;
            } else {
                this.secendCard = card;
                this.isFirst = true;
                matchCard.call(this);
                grade.call(this);
            }
        }.bind(this), 500);

    };

    function matchCard() {
        if (this.firstCard.getFlag() === this.secendCard.getFlag()) {
            dealMatchSuccess.call(this);
        } else {
            dealMatchFailure.call(this);
        }
        step++;
    }

    function grade() {
        if (step < 16) {
            console.log("3 star");
        } else if (step < 24) {
            console.log("2 star")
        } else {
            console.log('1 star');
        }
    }

    function dealMatchSuccess() {
        this.matchedGroup++;
        this.firstCard.onMatchSuccess();
        this.secendCard.onMatchSuccess();
        if (this.matchedGroup == 8) {
            winGame.call(this);
        }
    }

    function dealMatchFailure() {
        this.firstCard.onMatchFailure();
        this.secendCard.onMatchFailure();
        this.firstCard = null;
        this.secendCard = null;
    }

    function winGame() {
        console.log('you are winner!');
    }
}

;
(function() {
    $('.restart').bind("click", function() { refresh(); });
    refresh();
})();

function startNewGame() {
    let game = new Game();
    let icons = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

    let cards = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 2; j++) {
            let card = new Card();
            card.setFlag(i);
            card.iconClass = icons[i];
            cards.push(card);
        }
    }
    cards = shuffle(cards);

    let cardEles = document.getElementsByClassName("card");
    for (let i = 0; i < cardEles.length; i++) {
        let cardEle = cardEles[i];
        let card = cards[i];
        $(cardEle).bind("click", function() { card.dealClick(); });
        $(cardEle).children(".fa").addClass(card.iconClass);
        card.cardEle = cardEle;
        card.game = game;
    }
}

function refresh() {
    let cardEles = document.getElementsByClassName("card");
    for (let i = 0; i < cardEles.length; i++) {
        let cardEle = cardEles[i];
        $(cardEle).unbind();
        $(cardEle).removeClass().addClass('card');
        $(cardEle).children(".fa").removeClass().addClass('fa');
    }
    startNewGame();
}