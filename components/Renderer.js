export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.backgroundImg = new Image();
        this.backgroundImg.src = 'https://as2.ftcdn.net/v2/jpg/07/74/59/31/1000_F_774593110_JqF5VoFkHpEG39ux6ngEY6OVJJ6RT3lN.jpg';
        this.gnomeImg = new Image();
        this.gnomeImg.src = 'gnome3.png';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawShip() {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(this.canvas.width / 2 - 25, this.canvas.height - 30, 50, 30);
    }

    drawText(text, x, y, options = {}) {
        this.ctx.font = options.font || 'bold 20px Arial';
        this.ctx.fillStyle = options.fillStyle || 'white';
        this.ctx.strokeStyle = options.strokeStyle || 'black';
        this.ctx.lineWidth = options.lineWidth || 3;
        this.ctx.textAlign = options.textAlign || 'left';
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    drawGameOver(score) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawText('Game Over', this.canvas.width / 2, this.canvas.height / 2, {
            font: 'bold 40px Arial',
            textAlign: 'center'
        });
        this.drawText(`Final Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 40, {
            font: 'bold 20px Arial',
            textAlign: 'center'
        });
    }
}
