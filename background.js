class Background {
    constructor(camera, image, ratio, y, height, fillTopColor) {
        this.camera = camera;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.image = image;
        this.ratio = ratio;
        this.y = y;
        this.height = height;
        this.tileWidth = 480;
        this.fillTopColor = fillTopColor || null;

        this.positionA = new Vector();
        this.sizeA = new Vector();
        this.sizeA.x = this.tileWidth;
        this.sizeA.y = height;
        this.positionA.x = this.tileWidth * 0.5;
        this.positionA.y = y;

        this.positionB = new Vector();
        this.sizeB = new Vector();
        this.sizeB.x = this.tileWidth;
        this.sizeB.y = height;
        this.positionB.x = this.tileWidth + this.tileWidth * 0.5;
        this.positionB.y = y;
    }

    update(dt) {
        // Parallax offset is derived directly from camera.offset.x * ratio in render
    }

    render(context) {
        var sprite = this.atlas.sprites[this.image];
        if (!sprite) return;

        var drawY = this.camera.offset.y - this.y - this.height * 0.5;

        if (this.fillTopColor && drawY > 0) {
            context.fillStyle = this.fillTopColor;
            context.fillRect(0, 0, this.camera.viewPortWidth, Math.ceil(drawY) + 2);
        }

        var tileW = this.tileWidth;
        var scrollX = (this.camera.offset.x * this.ratio) % tileW;
        if (scrollX < 0) scrollX += tileW;

        for (var x = -scrollX; x < this.camera.viewPortWidth + tileW; x += tileW) {
            context.drawImage(
                this.assets.spritesAtlas,
                Number(sprite.x), Number(sprite.y), Number(sprite.width), Number(sprite.height),
                Math.floor(x), Math.floor(drawY), tileW + 1, this.height
            );
        }
    }
}
