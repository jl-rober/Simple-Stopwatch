class Stopwatch {
    constructor(reference) {
        //Reference to a specific stopwatch
        this.reference = reference;
        this.running = false;
        this.timeModifier = 0;
        let elements = [];

        //Create analog stopwatch elements
        elements.push(this.createAnalog());

        //Create digital stopwatch elements
        elements.push(this.createDigital());

        //Create buttons
        elements.push(this.createButtons());

        //Append everything to the root stopwatch element
        this.appendElements(elements);
    }

    createAnalog() {
        let analog = document.createElement('div');
        analog.className = 'analog-cnt';
        let stopwatchImage = document.createElement('img');
        stopwatchImage.src = "https://www.vectordiary.com/isd_tutorials/058-stopwatch/27.gif";
        let hand = document.createElement('div');
        hand.className = 'analog-hand seconds';
        analog.append(stopwatchImage);
        analog.append(hand);
        return analog;
    }

    createDigital() {
        let digital = document.createElement('div');
        digital.className = 'digital-cnt';
        let span = document.createElement('span');
        span.innerText = "00:00:00";
        digital.append(span);
        return digital;
    }

    createButtons() {
        let btnCnt = document.createElement('div');
        btnCnt.className = 'btn-cnt';
        btnCnt.append(this.createButton('Start', this.start, this));
        btnCnt.append(this.createButton('Stop', this.stop, this));
        btnCnt.append(this.createButton('Reset', this.reset, this));
        return btnCnt;
    }

    createButton(text, onclick) {
        let btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'btn ' + text.toLowerCase();
        btn.onclick = () => { onclick.call(this) };
        return btn;
    }

    appendElements(elements) {
        elements.forEach((e) => {
            this.reference.append(e);
        });
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
            let elapsedTime = Date.now() - this.startTime + this.timeModifier;
            this.updateAnalogClock(elapsedTime);
            this.updateDigitalClock(elapsedTime);
        }, 10)
    }

    updateAnalogClock(elapsedTime) {
        let secondsHand = this.reference.querySelector('.analog-hand.seconds');
        let rotation = (Math.floor(elapsedTime / 10)) * 0.06;
        secondsHand.style.transform = 'rotateZ(' + rotation + 'deg)';
    }

    updateDigitalClock(elapsedTime) {
        let digital = this.reference.querySelector('.digital-cnt span');
        let currentSeconds = (Math.floor(elapsedTime / 1000) % 60);
        let currentMinutes = Math.floor((elapsedTime % 3600000) / 60000);
        if(this.reference.classList.contains('hours')) {
            let currentHours = Math.floor(elapsedTime / 3600000);
            digital.textContent = Stopwatch.addZero(currentHours) + ":" + Stopwatch.addZero(currentMinutes) + ":" + Stopwatch.addZero(currentSeconds);
        } else {
            let currentCentiseconds = Math.round(elapsedTime / 10) % 100;
            digital.textContent = Stopwatch.addZero(currentMinutes) + ":" + Stopwatch.addZero(currentSeconds) + ":" + Stopwatch.addZero(currentCentiseconds);
        }
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