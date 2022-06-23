"use strict";
class Pendulum {
    constructor(t1, t2, l1, l2) {
        this.m1 = 10.0;
        this.m2 = 1.0;
        this.G = 1;
        this.t1 = t1;
        this.t2 = t2;
        this.l1 = l1;
        this.l2 = l2;
        this.w1 = .0;
        this.w2 = .0;
        this.previous_time = Date.now();
        this.interval = null;
    }

    accelerations() {
        const { t1, t2, l1, l2, w1, w2, m1, m2, G } = this;

        const p1num1 = -G * ((2 * m1) + m2) * Math.sin(t1);
        const p1num2 = -m2 * G * Math.sin(t1 - (2 * t2));
        const p1num3 = -2 * Math.sin(t1 - t2) * m2;
        const p1num4 = (w2 * w2 * l2) + (w1 * w1 * l1 * Math.cos(t1 - t2));
        const p1den = l1 * ((2 * m1) + m2 - (m2 * Math.cos((2 * t1) - (2 * t2))));
        const a1 = (p1num1 + p1num2 + (p1num3 * p1num4)) / p1den;

        const p2num1 = 2 * Math.sin(t1 - t2);
        const p2num2 = w1 * w1 * l1 * (m1 + m2);
        const p2num3 = G * (m1 + m2) * Math.cos(t1);
        const p2num4 = w2 * w2 * l2 * m2 * Math.cos(t1 - t2);
        const p2den = l1 * ((2 * m1) + m2 - (m2 * Math.cos((2 * t1) - (2 * t2))));
        const a2 = (p2num1 * (p2num2 + p2num3 + p2num4)) / p2den;
        return [ a1, a2 ];
    }
    update() {
        const [ a1, a2 ] = this.accelerations();
        this.w1 += a1;
        this.w2 += a2;
        this.t1 += this.w1;
        this.t2 += this.w2;
        this.draw();
    }
    draw() {
        const x1 = Math.sin(this.t1) * this.l1;
        const y1 = Math.cos(this.t1) * this.l1;
        const x2 = x1 + Math.sin(this.t2) * this.l2;
        const y2 = y1 + Math.cos(this.t2) * this.l2;
        const style = document.documentElement.style;
        style.setProperty("--x1", x1 + "px");
        style.setProperty("--y1", y1 + "px");
        style.setProperty("--l1", this.l1 + "px");
        style.setProperty("--t1", Math.PI - this.t1 + "rad");
        style.setProperty("--x2", x2 + "px");
        style.setProperty("--y2", y2 + "px");
        style.setProperty("--l2", this.l2 + "px");
        style.setProperty("--t2", Math.PI - this.t2 + "rad");
    }
    toggle() {
        if (this.interval === null) {
            this.interval = setInterval(() => this.update(), 20);
            document.querySelector("#toggle").textContent = "Приостановить симуляцию";
        } else {
            clearInterval(this.interval);
            this.interval = null;
            document.querySelector("#toggle").textContent = "Начать симуляцию";
        }
    }
}

let pendulum = new Pendulum(0, 0, 140, 100);
document.querySelector("#toggle").addEventListener("click", () => pendulum.toggle());
document.querySelector("#length1").addEventListener("input", () => {
    pendulum.l1 = parseInt(document.querySelector("#length1").value);
    document.querySelector("#length1-label").textContent = "Длина 1 маятника: " + document.querySelector("#length1").value + "м";
    pendulum.draw();
});
document.querySelector("#length2").addEventListener("input", () => {
    pendulum.l2 = parseInt(document.querySelector("#length2").value);
    document.querySelector("#length2-label").textContent = "Длина 2 маятника: " + document.querySelector("#length2").value + "м";
    pendulum.draw();
});
document.querySelector("#angle1").addEventListener("input", () => {
    pendulum.t1 = 2 * Math.PI * (parseInt(document.querySelector("#angle1").value) / 100.0);
    document.querySelector("#angle1-label").textContent = "Угол 1 маятника: " + pendulum.t1.toFixed(2) + "рад";
    pendulum.draw()
});
document.querySelector("#angle2").addEventListener("input", () => {
    pendulum.t2 = 2 * Math.PI * (parseInt(document.querySelector("#angle2").value) / 100.0);
    document.querySelector("#angle2-label").textContent = "Угол 2 маятника: " + pendulum.t2.toFixed(2) + "рад.";
    pendulum.draw();
});
document.querySelector("#mass1").addEventListener("input", () => {
    pendulum.m1 = parseInt(document.querySelector("#mass1").value);
    document.querySelector("#mass1-label").textContent = "Масса 1 маятника: " + document.querySelector("#mass1").value + "кг";
    pendulum.draw();
});
document.querySelector("#mass2").addEventListener("input", () => {
    pendulum.m2 = parseInt(document.querySelector("#mass2").value);
    document.querySelector("#mass2-label").textContent = "Масса 2 маятника: " + document.querySelector("#mass2").value + "кг";
    pendulum.draw()
});
pendulum.draw();