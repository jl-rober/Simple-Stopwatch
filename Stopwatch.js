class Stopwatch {
    constructor(reference) {
        //Reference to a specific stopwatch
        this.reference = reference;
        this.running = false;
        this.timeModifier = 0;

        //Create analog stopwatch elements
        let analog = document.createElement('div');
        analog.className = 'analog-cnt';
        let stopwatchImage = document.createElement('img');
        stopwatchImage.src = "https://www.vectordiary.com/isd_tutorials/058-stopwatch/27.gif";
        let hand = document.createElement('div');
        hand.className = 'analog-hand seconds';
        analog.append(stopwatchImage);
        analog.append(hand);

        //Create digital stopwatch elements
        let digital = document.createElement('div');
        digital.className = 'digital-cnt';
        let span = document.createElement('span');
        span.innerText = "00:00:00";
        digital.append(span);

        //Create buttons
        let btnCnt = document.createElement('div');
        btnCnt.className = 'btn-cnt';
        btnCnt.append(this.createButton('Start', this.start, this));
        btnCnt.append(this.createButton('Stop', this.stop, this));
        btnCnt.append(this.createButton('Reset', this.reset, this));

        //Append everything to the root stopwatch element
        this.reference.append(analog);
        this.reference.append(digital);
        this.reference.append(btnCnt);
    }

    //Function to avoid repeating same code
    createButton(text, onclick) {
        let btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'btn ' + text.toLowerCase();
        btn.onclick = () => { onclick.call(this) };
        return btn;
    }

    //Start stopwatch
    start() {
        if(this.running === false) {
            this.running = true;
            this.startTime = Date.now();
            this.tickTock();
        }
    }

    //Save current time to timeModifier so it can be resumed
    stop() {
        if(this.running === true) {
            this.timeModifier = Date.now() - this.startTime + this.timeModifier;
            this.running = false;
            clearInterval(this.ticker);
        }
    }

    //Clear everything
    reset() {
        this.timeModifier = 0;
        this.startTime = Date.now();
        this.reference.querySelector('.analog-hand.seconds').style.transform = 'rotateZ(0deg)';
        this.reference.querySelector('.digital-cnt span').innerText = "00:00:00";
    }

    /*
    * Interval that increments both stopwatches.
    * Since setInterval isn't always accurate, I have it comparing current time to
    * the time it was started, and rounding that and multiplying by 6 degrees (rotation per second)
    * Could easily make the setInterval occur more frequently and add on the milliseconds if needed.
    * Digital part is pretty straightforward, after you figure out how much time has elapsed,
    * break that down into hours, minutes, and seconds, and update the text displaying it
    */
    tickTock() {
        this.ticker = setInterval(() => {
            let secondsHand = this.reference.querySelector('.analog-hand.seconds');
            let digital = this.reference.querySelector('.digital-cnt span');

            //Update analog clock
            let currentTime = Date.now();
            let elapsedTime = currentTime - this.startTime + this.timeModifier;
            let rotation = (Math.floor(elapsedTime / 10)) * 0.06;
            secondsHand.style.transform = 'rotateZ(' + rotation + 'deg)';

            //Update digital clock
            let currentSeconds = (Math.floor(elapsedTime / 1000) % 60);
            let currentMinutes = Math.floor((elapsedTime % 3600000) / 60000);
            if(this.reference.classList.contains('hours')) {
                let currentHours = Math.floor(elapsedTime / 3600000);
                digital.textContent = Stopwatch.addZero(currentHours) + ":" + Stopwatch.addZero(currentMinutes) + ":" + Stopwatch.addZero(currentSeconds);
            } else {
                let currentCentiseconds = Math.round(elapsedTime / 10) % 100;
                digital.textContent = Stopwatch.addZero(currentMinutes) + ":" + Stopwatch.addZero(currentSeconds) + ":" + Stopwatch.addZero(currentCentiseconds);
            }
        }, 10)
    }

    static addZero(number) {
        return (number.toString().length === 1 ? "0" + number : number + "");
    }
}

// Loop through all stopwatches on the page and add the class to get it to function
let stopwatches = document.getElementsByClassName('stopwatch');
for(let i = 0; i < stopwatches.length; i++) {
    new Stopwatch(stopwatches[i]);
}