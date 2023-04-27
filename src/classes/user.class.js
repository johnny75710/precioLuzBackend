import { House } from "./house.class.js";
import { Security } from "./security.class.js";

export class User {
    constructor() {
      this.Name = null;
      this.UserName = null;
      this.Password = null;
      this.Security_Q = new Security();
      this.Security_A = null;
      this.House = new House();
    }
  
    get name() {
      return this.Name;
    }
  
    set name(value) {
      this.Name = value;
    }
  
    get userName() {
      return this.UserName;
    }
  
    set userName(value) {
      this.UserName = value;
    }
  
    get password() {
      return this.Password;
    }
  
    set password(value) {
      this.Password = value;
    }
  
    get security_Q() {
      return this.Security_Q;
    }
  
    set security_Q(value) {
      this.Security_Q = value;
    }
  
    get security_A() {
      return this.Security_A;
    }
  
    set security_A(value) {
      this.Security_A = value;
    }
  
    get house() {
      return this.House;
    }
  
    set house(value) {
      this.House = value;
    }
  }