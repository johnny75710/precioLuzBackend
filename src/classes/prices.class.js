export class Prices {
    constructor() {
      this.date = null;
      this.hour = null;
      this.price = null;
      this.isMin = null;
      this.isMax = null;
    }
    get date() {
      return this.Date;
    }
    set date(value) {
      this.Date = value;
    }
    get hour() {
      return this.Hour;
    }
    set hour(value) {
      this.Hour = value;
    }
    get price() {
      return this.Price;
    }
    set price(value) {
      this.Price = value;
    }
    get isMin() {
      return this.IsMin;
    }
    set isMin(value) {
      this.IsMin = value;
    }
    get isMax() {
      return this.IsMax;
    }
    set isMax(value) {
      this.IsMax = value;
    }
  }