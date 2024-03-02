import { Component, OnInit } from '@angular/core';
import * as forge from 'node-forge';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  publicKey: string = `-----BEGIN PUBLIC KEY-----
  MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOPcAvYCm4TXSuoqNN3MIXEC+i4R7qa0
  lmEdDHt3BW+emCr4dhsF0UxYZ1pwtvhg3j1swKvvV5OKsV276wDb+fcCAwEAAQ==
  -----END PUBLIC KEY-----`;

  userPass:string = "test@123";  
  encryptedPassword:string = '';
  Iframe_URL = 'http://150.136.91.243:8886/login/';

  constructor() {
    var rsa = forge.pki.publicKeyFromPem(this.publicKey); //Gautam
    console.log("In Bytes:- "+rsa.encrypt(this.userPass));
    this.encryptedPassword = window.btoa(rsa.encrypt(this.userPass)); //Gautam
    console.log("Encrypted using base64:-"+this.encryptedPassword);
    this.Iframe_URL +=  this.encryptedPassword;
    //this.Iframe_URL +="?username=hsharma&password=test@123";
  }

  ngOnInit(): void {
    
  }

  childURL(){

  }

}
