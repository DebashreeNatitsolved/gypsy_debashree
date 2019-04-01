import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';


/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
	user_id: any;
	productList: any;
	message: any;
	url:any;
	imageurl:any;
	getcart:any;


	options : InAppBrowserOptions = {
		location : 'yes',//Or 'no' 
		hidden : 'no', //Or  'yes'
		clearcache : 'yes',
		clearsessioncache : 'yes',
		zoom : 'yes',//Android only ,shows browser zoom controls 
		hardwareback : 'yes',
		mediaPlaybackRequiresUserAction : 'no',
		shouldPauseOnSuspend : 'no', //Android only 
		closebuttoncaption : 'Close', //iOS only
		disallowoverscroll : 'no', //iOS only 
		toolbar : 'yes', //iOS only 
		enableViewportScale : 'no', //iOS only 
		allowInlineMediaPlayback : 'no',//iOS only 
		presentationstyle : 'pagesheet',//iOS only 
		fullscreen : 'yes',//Windows only    
	};

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public api: ApiProvider,
		public alertCtrl: AlertController,
		private AuthService: AuthProvider,
		private service: ServiceProvider,
		public loadingCtrl:LoadingController,
		private theInAppBrowser: InAppBrowser, ) {

			this.getcart=1;

		this.user_id = AuthService.getuserid();
		this.url = "http://111.93.169.90/";
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CartPage');
		this.fetchProduct();
	}


	strip(html: string) {
		return html.replace(/<(?:.|\n)*?>/gm, '');
	}

	br2nl(html: string) {
		return html.replace(/<br( \/|\/|)>/gm, '\r\n');
	}


	fetchProduct() {

		let loading = this.loadingCtrl.create({		
			content: 'Loading...',
		  });
		  loading.present();

		this.api.post('viewcart', { user_id: this.user_id}).subscribe((response : any) => {
			console.log(response);
			if(response.Ack === 1) {
				this.getcart=1;
				loading.dismiss();
				this.productList = response.cart_details;
				console.log(this.productList);
				this.imageurl=response.imagepath;

			} else {
				this.getcart=0;
				loading.dismiss()
				this.productList = '';
				
			}
			
		}, err => {
			loading.dismiss();
			this.service.popup('Alert', 'Something went wrong');
		});
	}


	removeItem(id) {
		let alert = this.alertCtrl.create({
			title: 'Confirm Remove',
			message: 'Do you want remove the item from your Cart?',
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
						this.api.post('deletecart', { cart_id: id}).subscribe((response : any) => {
							
					
							console.log(response);
							if (response.Ack === 1) {
								
								this.fetchProduct();

							} else {
								this.service.popup('', 'Please try again later');
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


	
	public openWithInAppBrowser(url : string){

		this.api.post('appbuy', {user_id:this.user_id}).subscribe((response : any) => {
			console.log(response);
			if (response.Ack==1)
			{
				console.log('user clicked on the buy')
			}
			else{
				console.log('elsepart')
			}
		},
			err=>
			{
				console.log(err)
			}
		)

		let target = "_blank";
		this.theInAppBrowser.create(url,target,this.options);
	}
	

	gotoDetails(id) 
	{   
        this.navCtrl.push('DetailPage', {id:id});
      }

}
