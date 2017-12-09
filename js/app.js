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
    };

    this.cover = function() {
        this.isCover = true;
        $(this.cardEle).removeClass("open").removeClass("show");
    };

    this.onMatchFailure = function() {
        $(this.cardEle).addClass("dismatch");
        setTimeout(function() {
            $(this.cardEle).removeClass("dismatch");
            this.cover();
        }.bind(this), 500);

    };

    this.onMatchSuccess = function() {
        $(this.cardEle).addClass("match");
    };

    this.dealClick = function() {
        if (this.isCover) {
            this.flip();
            this.game.judge(this);
        }
    };
}

function GradeModule() {
    let stars = $(".stars .fa");
    let maxGrade = stars.length;
    var starGrade = maxGrade;

    this.setGrade = function(grade) {
        starGrade = grade;
        updateStar.call(this, grade);
    };

    this.getGrade = function() {
        return starGrade;
    }

    function updateStar(grade) {
        $(stars).addClass("fa-star").removeClass("fa-star-o");
        if (maxGrade > grade && grade >= 0) {
            for (let i = maxGrade - 1; i > (grade - 1); i--) {
                let star = stars[i];
                $(stars[i]).addClass("fa-star-o").removeClass("fa-star");
            }
        }

    }
}

;
(function() {
    var gameManager = new GameManager();
    $(".restart").bind("click", function() { gameManager.refresh(); });
    $(".again").bind("click", function() { gameManager.refresh(); });
    gameManager.refresh();
})();

function GameManager() {
    var game;
    var timer = new Timer();
    var gradeModule = new GradeModule();

    this.refresh = function() {
        $(".congratulation").css("display", "none");
        $(".container").css("display", "flex");
        $(".moves").text("" + 0);
        let cardEles = document.getElementsByClassName("card");
        for (let i = 0; i < cardEles.length; i++) {
            let cardEle = cardEles[i];
            $(cardEle).unbind();
            $(cardEle).removeClass().addClass("card");
            $(cardEle).children(".fa").removeClass().addClass("fa");
        }
        gradeModule.setGrade(3);
        startNewGame.call(this);
    };

    function startNewGame() {
        game = new Game(this);
        game.setGradeModule(gradeModule);
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
        timer.start();
    }

    this.onWin = function(step) {
        timer.stop();
        $(".container").css("display", "none");
        $(".congratulation").css("display", "flex");
        $(".con-time").text(timer.getTime());
        $(".con-moves").text(step);
        $(".con-stars").text(gradeModule.getGrade());
    }

}

function Game(manager) {
    var firstCard = null;
    var secendCard = null;
    var isFirst = true;
    var matchedGroup = 0;
    var gradeModule;
    let step = 0;
    var gameManager = manager;

    this.setGradeModule = function(gradem) {
        gradeModule = gradem;
    }

    this.judge = function(card) {
        //console.log(card.getFlag());
        setTimeout(function() {
            if (isFirst) {
                firstCard = card;
                isFirst = false;
            } else {
                secendCard = card;
                isFirst = true;
                matchCard.call(this);
                grade.call(this);
            }
        }.bind(this), 500);

    };

    function matchCard() {
        if (firstCard.getFlag() === secendCard.getFlag()) {
            dealMatchSuccess.call(this);
        } else {
            dealMatchFailure.call(this);
        }
        step++;
        $(".moves").text("" + step);
    }

    function grade() {
        var grade = 0;
        if (step < 16) {
            grade = 3
        } else if (step < 24) {
            grade = 2
        } else if (step < 32) {
            grade = 1
        } else {
            grade = 0;
        }
        if (gradeModule) {
            gradeModule.setGrade(grade);
        }
    }

    function dealMatchSuccess() {
        matchedGroup++;
        firstCard.onMatchSuccess();
        secendCard.onMatchSuccess();
        if (matchedGroup == 8) {
            winGame.call(this);
        }
    }

    function dealMatchFailure() {
        firstCard.onMatchFailure();
        secendCard.onMatchFailure();
        firstCard = null;
        secendCard = null;
    }

    function winGame() {
        gameManager.onWin(step);
    }
}

function Timer(callback) {
    var number = 0;
    var listener = arguments[0];
    var timer;

    this.start = function() {
        number = 0;
        time1.call(this);
    };

    this.stop = function() {
        if (timer) {
            clearTimeout(timer);
        }
    }

    function time1() {
        number++;
        if (listener instanceof Function) {
            listener(number);
        }
        timer = setTimeout(time1.bind(this), 1000);
    }

    this.getTime = function() {
        return number;
    }

}