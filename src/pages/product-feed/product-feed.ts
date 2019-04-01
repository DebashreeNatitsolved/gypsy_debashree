import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
/**
 * Generated class for the ProductFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-feed',
  templateUrl: 'product-feed.html',
})
export class ProductFeedPage {
  parameter:any;
  feedlist:any;
  target:any;


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


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private service: ServiceProvider,
  public loadingCtrl:LoadingController,
  private theInAppBrowser: InAppBrowser,
private toastCtrl:ToastController,) 
    {
this.parameter=this.navParams.get ('param');
console.log(this.parameter);
this.productfeed();
  }

  
  productfeed()
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
   
    });
    loading.present();

    this.api.post('productfeedlist',{product_id:this.parameter}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        
        if (response.feed_list.length>0)
        {
       this.feedlist=response.feed_list;
        }
        else
        {         
          this.feedlist='';

          if (this.feedlist=='')
          {
            this.service.popup('', 'No Feed List for this product'); 
          }
        }
  
      }else{
        loading.dismiss();
        
        this.service.popup('Sorry','Please try again later');
      }
      }, err => {
        loading.dismiss();
        this.presentToast ('Something went wrong');
      });
  }


  private presentToast(text) 
  {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  public openWithInAppBrowser(url : string,social)
  {
    if (social=='P')
    {
      console.log('social',social)
    this.target = "_system";
    }
    else if (social=='T'||social=='F')
    {
      console.log('social',social)
      this.target = "_blank";
    }

		this.theInAppBrowser.create(url,this.target,this.options);
	}


  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad ProductFeedPage');
  }

}
