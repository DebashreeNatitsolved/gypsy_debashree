
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

// const apiUrl = "http://111.93.169.90/team4/gypsy/webservice";
const apiUrl = "http://www.mygypsy.co/webservice";

// const mediaUrl ="http://111.93.169.90/team4/gypsy/";
const mediaUrl ="http://www.mygypsy.co/webservice";

const url ="http://111.93.169.90";

// const baseurl="http://111.93.169.90/team4/gypsy/api";
const baseurl="http://www.mygypsy.co/webservice/api";



@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
  }



  post(link,data){

    console.log(data);

  	return this.http.post(apiUrl+'/'+link, data).map(response => {

      console.log(data)
      	return response;
    });
  }

  likelist(link,data){
  console.log(data);
	return this.http.post(baseurl+'/'+link, data).map(response => {
   
      	return response;
    });

  }
}

