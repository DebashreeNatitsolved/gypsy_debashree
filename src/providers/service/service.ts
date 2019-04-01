import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ServiceProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
    
  }

  popup(title, message){
  	let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
