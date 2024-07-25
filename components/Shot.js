export class Shot {
    constructor(x, y, target, renderer) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
        this.renderer = renderer;
    }

    draw() {
        this.renderer.ctx.fillStyle = 'red';
        this.renderer.ctx.beginPath();
        this.renderer.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        this.renderer.ctx.fill();
    }

    update() {
        if (this.target) {
            const dx = (this.target.x + 40) - this.x;
            const dy = (this.target.y + 30) - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                this.x = this.target.x + 40;
                this.y = this.target.y + 30;
                return true; // Hit the target
            }
        }
        return false;
    }
}
