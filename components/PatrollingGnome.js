export class PatrollingGnome {
    constructor(x, canvasWidth, canvasHeight, renderer, gnomeImage) {
        this.x = x;
        this.y = canvasHeight - 30;
        this.speed = 1;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.canvasWidth = canvasWidth;
        this.renderer = renderer;
        this.gnomeImage = gnomeImage;
    }

    draw() {
        if(this.direction > 0){
            this.renderer.drawImage(`${this.gnomeImage}-flipped`, this.x, this.y - 30, 60, 60);
        }else{
            this.renderer.drawImage(`${this.gnomeImage}`, this.x, this.y - 30, 60, 60);
        }
        
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x < 0 || this.x > this.canvasWidth - 30) {
            this.direction *= -1;
        }
    }
}