import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  user_id:any;
  reviewlist:any;
  imageurl:any;
  starrating:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    private service: ServiceProvider,
    public events:Events,) 
    {
    this.user_id = AuthService.getuserid();
    this.review();
  }


  ionViewDidLoad() 
  {
    this.events.publish('hideFooter', { isHidden: false});
    console.log('ionViewDidLoad ReviewPage');
  }


review()
{
  this.api.post('reviewlist',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log(response);

    if(response.ACK == 1)
    { 
      this.reviewlist=response.products;
      this.imageurl=response.imagepath;      
    }
    else
    {
      this.reviewlist='';     
    }
    }, 
    err => {
      this.service.popup('Alert', 'Something went wrong');
  }
);
}


gotoDetails(id) 
{
  this.navCtrl.push('DetailPage', {id:id});
}

}
