class Camera {

    constructor() {
        this.viewPortWidth = 480;
        this.viewPortHeight = 400;
        this.worldWidth = 2000;
        this.worldHeight = 400;
        this.infinite = true;
        this.bottomMargin = 0;
        this.offset = new Vector();
        this.offset.x = 0;
        this.offset.y = this.viewPortHeight;
        this.position = new Vector();
    }

    resize(windowWidth, windowHeight) {
        var aspect = windowWidth / Math.max(1, windowHeight);
        if (aspect >= 1.15) {
            this.viewPortHeight = 400;
            this.viewPortWidth = Math.max(460, Math.min(720, Math.round(400 * aspect)));
            this.bottomMargin = 0;
        } else {
            this.viewPortWidth = 400;
            this.viewPortHeight = Math.max(400, Math.min(740, Math.round(400 / Math.max(0.45, aspect))));
            this.bottomMargin = 48;
        }
        this.offset.y = this.viewPortHeight - this.bottomMargin;
    }

    update() {
        var offsetX = this.position.x - this.viewPortWidth * 0.5;
        if (this.infinite) {
            this.offset.x = offsetX < 0 ? 0 : offsetX;
            return;
        }
        var leftLimit = 0;
        var rightLimit = (this.worldWidth - this.viewPortWidth * 0.5) - this.viewPortWidth * 0.5;
        if (offsetX <= leftLimit) {
            this.offset.x = leftLimit;
        } else if (offsetX >= rightLimit) {
            this.offset.x = rightLimit;
        } else {
            this.offset.x = offsetX;
        }
    }
}
