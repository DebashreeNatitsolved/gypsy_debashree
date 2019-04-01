import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController,Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { concat } from 'rxjs/operator/concat';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {
  productList:any;
  pet:any;
  user_id:any;
  message:any;
  is_exist:any;
  likelist:any;
  noofcart:any;
  imageurl:any;
  imageurllikelist:any;
  userlikelist:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events:Events,) 
    
    {
      this.user_id = AuthService.getuserid();
      this.pet ="wishlist";
      this.cartcount();
    }


  ionViewDidLoad() 
  {
    this.events.publish('hideFooter', { isHidden: false});
    console.log('ionViewDidLoad WishlistPage');
    this.mywhishList();
  }



  mywhishList()
  {
    this.api.post('mywishlist',{id:this.user_id}).subscribe((response : any)  => {
		console.log(response);
    if(response.Ack === 1)
    {
      this.productList = response.wishlist_details;
      this.is_exist = 1;
      this.likelist = response.likes;
      console.log('likelist',this.likelist)
      this.imageurl=response.imagepath;
      this.message = response.msg;
      console.log('msg',this.message)
    }
    
    else
    {
			this.message = response.msg;
      this.is_exist = 0;
      this.service.popup('', 'Please login');
    }
    }, err => {
    	this.service.popup('Alert', 'Something went wrong');
    });
  }

 

  deletewishList(id) 
  {  
		let alert = this.alertCtrl.create({
			title: 'Confirm Remove',
			message: 'Do you want remove the item from your wishlist?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
					}
				},
				{
					text: 'Remove',
					handler: () => {
						this.api.post('deletewishlist', { id:id }).subscribe((response: any) => {
							console.log(response);
							if (response.Ack == 1) {	
                console.log('remove ack1')						
								this.mywhishList();

							} else {
                console.log('else part')	
							}
						}, () => {
								this.service.popup('Alert', 'Something went Wrong');
							});
					}
				}
			]
		});
		alert.present();  
  }



  addtoCart(proid) 
  {
    this.api.post('addcart',{id:this.user_id,product_id:proid}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        this.cartcount();
        this.service.popup('success',response.msg);
  
      }else{
        this.service.popup('Sorry','Please try again later');
      }
      }, err => {
      	this.service.popup('Alert', 'Something is Wrong');
      });
   }
  


   gotoDetails(productId)
   {
     this.navCtrl.push('DetailPage', {id:productId});
   }
 

  cartcount()
  {
    this.api.post('noOfCart',{user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1)
      {  
        this.noofcart=response.no_cart;       
      }
      else
      {
        this.service.popup('', 'Something went wrong');        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }


  goToCartPage()
  {
    this.navCtrl.push('CartPage')
  }

}
