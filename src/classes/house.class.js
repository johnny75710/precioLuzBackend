export class House{
    constructor(){
      this.ID = null;
      this.Wats = null;
    }
  
    get id(){
      return this.ID;
    }
  
    set id(value){
      this.ID = value;
    }
  
    get wats(){
      return this.Wats;
    }
  
    set wats(value){
      this.Wats = value;
    }
  }