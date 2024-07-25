export class FallingWord {
    constructor(word, canvasWidth, renderer) {
        this.word = word;
        this.x = Math.random() * (canvasWidth - 100);
        this.y = 0;
        this.speed = 0.5 + Math.random() * 1;
        this.amplitude = 20 + Math.random() * 30;
        this.frequency = 0.02 + Math.random() * 0.03;
        this.phase = Math.random() * Math.PI * 2;
        this.renderer = renderer;
    }

    draw() {
        const parachuteWidth = 80;
        const parachuteHeight = 60;
        const gnomeWidth = 60;
        const gnomeHeight = 60;

        // Draw parachute
        this.renderer.ctx.beginPath();
        this.renderer.ctx.moveTo(this.x, this.y);
        this.renderer.ctx.bezierCurveTo(
            this.x - parachuteWidth / 2, this.y - parachuteHeight / 2,
            this.x + parachuteWidth / 2, this.y - parachuteHeight / 2,
            this.x + parachuteWidth, this.y
        );
        this.renderer.ctx.strokeStyle = 'red';
        this.renderer.ctx.lineWidth = 2;
        this.renderer.ctx.stroke();

        // Draw strings
        this.renderer.ctx.beginPath();
        this.renderer.ctx.moveTo(this.x, this.y);
        this.renderer.ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
        this.renderer.ctx.moveTo(this.x + parachuteWidth, this.y);
        this.renderer.ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
        this.renderer.ctx.strokeStyle = 'black';
        this.renderer.ctx.lineWidth = 1;
        this.renderer.ctx.stroke();

        // Draw gnome
        this.renderer.ctx.drawImage(this.renderer.gnomeImg, this.x, this.y + parachuteHeight, gnomeWidth, gnomeHeight);

        // Draw word
        this.renderer.drawText(this.word, this.x + parachuteWidth / 2, this.y + 20, {
            textAlign: 'center'
        });
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * this.frequency + this.phase) * this.amplitude / 20;
    }
}