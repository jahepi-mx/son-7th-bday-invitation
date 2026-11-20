class Butterfree {
    constructor(camera, offsetX, baseY) {
        this.camera = camera;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.position = new Vector();
        this.position.x = offsetX;
        this.baseY = baseY;
        this.position.y = baseY;
        this.size = new Vector();
        this.size.x = 28;
        this.size.y = 22;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 65 + Math.random() * 20;
        this.flapAnimation = new Animation(2, 4);
    }

    update(dt) {
        this.phase += dt * 3.2;
        this.position.x += this.speed * dt;
        this.position.y = this.baseY + Math.sin(this.phase) * 14;

        // Loop back ahead/behind camera viewport
        if (this.position.x - this.camera.offset.x > this.camera.viewPortWidth + 60) {
            this.position.x = this.camera.offset.x - 40 - Math.random() * 80;
            this.baseY = 185 + Math.random() * 75;
        }
        this.flapAnimation.update(dt);
    }

    render(context) {
        var name = "butterfree_" + (this.flapAnimation.getFrame() + 1);
        var sprite = this.atlas.sprites[name];
        if (!sprite) return;
        context.drawImage(
            this.assets.spritesAtlas,
            Number(sprite.x), Number(sprite.y), Number(sprite.width), Number(sprite.height),
            Math.floor(this.position.x - this.camera.offset.x - this.size.x * 0.5),
            Math.floor(this.camera.offset.y - this.position.y - this.size.y * 0.5),
            this.size.x,
            this.size.y
        );
    }
}
