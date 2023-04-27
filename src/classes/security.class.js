export class Security{
    constructor(){
      this.ID = null;
      this.Security_Q = null;
    }
  
    get security_Q(){
      return this.Security_Q;
    }
  
    set security_Q(value){
      this.Security_Q = value;
    }
  
    get id(){ 
      return this.ID;
    }
  
    set id(value){    
      this.ID = value;
    }
  }