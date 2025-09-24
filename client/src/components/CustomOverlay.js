export class CustomOverlay extends window.google.maps.OverlayView {
  constructor(position, content, map) {
    super();
    this.position = position;
    this.content = content;
    this.div = null;
    this.setMap(map);
  }

  onAdd() {
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.zIndex = 999;
    this.div.innerHTML = this.content;

    const panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div);
  }

  draw() {
    if (!this.div) return;
    const projection = this.getProjection();
    const point = projection.fromLatLngToDivPixel(this.position);
    if (point) {
      this.div.style.left = `${point.x}px`;
      this.div.style.top = `${point.y - 120}px`; // Adjust to sit above the marker
    }
  }

  onRemove() {
    if (this.div && this.div.parentNode) {
      this.div.parentNode.removeChild(this.div);
    }
    this.div = null;
  }

  hide() {
    if (this.div) this.div.style.display = "none";
  }

  show() {
    if (this.div) this.div.style.display = "block";
  }

  toggle() {
    if (this.div) {
      this.div.style.display = this.div.style.display === "none" ? "block" : "none";
    }
  }
}
