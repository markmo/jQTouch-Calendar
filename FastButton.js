// http://code.google.com/mobile/articles/fast_buttons.html

function FastButton(element, handler) {
    this.element = element;
    this.handler = handler;

    element.addEventListener('touchstart', this, false);
    element.addEventListener('click', this, false);
};

FastButton.prototype.handleEvent = function(event) {
    switch (event.type) {
    case 'touchstart':
        this.onTouchStart(event);
        break;
    case 'touchmove':
        this.onTouchMove(event);
        break;
    case 'touchend':
        this.onClick(event);
        break;
    case 'click':
        this.onClick(event);
        break;
    }
};

FastButton.prototype.onTouchStart = function(event) {
    event.stopPropagation();

    this.element.addEventListener('touchend', this, false);
    document.body.addEventListener('touchmove', this, false);

    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
};

FastButton.prototype.onTouchMove = function(event) {
    if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
    Math.abs(event.touches[0].clientY - this.startY) > 10) {
        this.reset();
    }
};

FastButton.prototype.onClick = function(event) {
    event.stopPropagation();
    this.reset();
    this.handler(event);

    if (event.type == 'touchend') {
        ClickBuster.preventGhostClick(this.startX, this.startY);
    }
};

FastButton.prototype.reset = function() {
    this.element.removeEventListener('touchend', this, false);
    document.body.removeEventListener('touchmove', this, false);
};

function ClickBuster() {}

ClickBuster.preventGhostClick = function(x, y) {
    ClickBuster.coordinates.push(x, y);
    window.setTimeout(ClickBuster.pop, 2500);
};

ClickBuster.pop = function() {
    ClickBuster.coordinates.splice(0, 2);
};

ClickBuster.onClick = function(event) {
    for (var i = 0; i < ClickBuster.coordinates.length; i += 2) {
        var x = ClickBuster.coordinates[i];
        var y = ClickBuster.coordinates[i + 1];
        if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
};

// document.addEventListener('click', ClickBuster.onClick, true);
// ClickBuster.coordinates = [];