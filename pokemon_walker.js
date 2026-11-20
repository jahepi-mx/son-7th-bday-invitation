class PokemonWalker {
    constructor(camera, config) {
        this.camera = camera;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();

        this.name = config.name;
        this.formationOffsetX = config.formationOffsetX;
        this.yLimit = config.yLimit;
        this.walkSpeed = config.walkSpeed || 48;
        this.canAutoHop = Boolean(config.canAutoHop);

        this.position = new Vector();
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.acceleration.y = -340;

        this.size = new Vector();
        this.size.x = config.width;
        this.size.y = config.height;

        this.position.x = 240 + this.formationOffsetX;
        this.position.y = this.yLimit;

        this.walkAnimation = new Animation(4, config.animSpeed || 1.8);
        this.walkAnimation.count = config.startFrame || 0;

        this.hopTimer = 2 + Math.random() * 6;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.sparkles = [];
    }

    hop(force) {
        if (this.position.y <= this.yLimit + 2) {
            this.velocity.y = force || (110 + Math.random() * 45);
            this.sparkles.push({
                x: this.position.x + (Math.random() * 14 - 7),
                y: this.position.y + this.size.y * 0.4,
                vy: 28,
                life: 0.55,
                anim: new Animation(3, 5)
            });
        }
    }

    update(dt, groupX) {
        this.swayPhase += dt * 1.3;
        var targetX = groupX + this.formationOffsetX + Math.sin(this.swayPhase) * 5;
        this.position.x += (targetX - this.position.x) * Math.min(1, dt * 4);

        if (this.canAutoHop) {
            this.hopTimer -= dt;
            if (this.hopTimer <= 0) {
                this.hopTimer = 4 + Math.random() * 7;
                this.hop();
            }
        }

        // Vertical physics for joyful hops
        this.position.y += this.velocity.y * dt;
        this.velocity.y += this.acceleration.y * dt;
        if (this.position.y <= this.yLimit) {
            this.position.y = this.yLimit;
            this.velocity.y = 0;
        }

        this.walkAnimation.update(dt);

        for (var i = 0; i < this.sparkles.length; i++) {
            var sp = this.sparkles[i];
            sp.y += sp.vy * dt;
            sp.life -= dt;
            sp.anim.update(dt);
            if (sp.life <= 0) {
                this.sparkles.splice(i--, 1);
            }
        }
    }

    render(context) {
        var screenX = this.position.x - this.camera.offset.x;
        var groundY = this.camera.offset.y - this.yLimit + this.size.y * 0.44;

        // Soft ground shadow under feet
        var jumpHeight = Math.max(0, this.position.y - this.yLimit);
        var shadowScale = Math.max(0.5, 1 - jumpHeight / 90);
        context.fillStyle = "rgba(0, 0, 0, 0.22)";
        context.beginPath();
        context.ellipse(
            screenX,
            groundY,
            this.size.x * 0.3 * shadowScale,
            4 * shadowScale,
            0, 0, Math.PI * 2
        );
        context.fill();

        var frameName = this.name + "_walk_" + (this.walkAnimation.getFrame() + 1);
        var sprite = this.atlas.sprites[frameName];
        if (sprite) {
            context.drawImage(
                this.assets.spritesAtlas,
                Number(sprite.x), Number(sprite.y), Number(sprite.width), Number(sprite.height),
                Math.floor(screenX - this.size.x * 0.5),
                Math.floor(this.camera.offset.y - this.position.y - this.size.y * 0.5),
                this.size.x,
                this.size.y
            );
        }

        // Sparkles on happy jump
        for (var i = 0; i < this.sparkles.length; i++) {
            var sp = this.sparkles[i];
            var spSprite = this.atlas.sprites["sparkle_" + (sp.anim.getFrame() + 1)];
            if (spSprite) {
                context.drawImage(
                    this.assets.spritesAtlas,
                    Number(spSprite.x), Number(spSprite.y), Number(spSprite.width), Number(spSprite.height),
                    Math.floor(sp.x - this.camera.offset.x - 8),
                    Math.floor(this.camera.offset.y - sp.y - 8),
                    16, 16
                );
            }
        }
    }
}
