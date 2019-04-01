import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
/**
 * Generated class for the ProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {
  cid:any;
  productList:any;
  image_url: any;
  user_id:any;

  title:any;
  icon:any;
  url:any;
  cattype:any;
  price:any;

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
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private events: Events,
    public loadingCtrl:LoadingController,
    private socialSharing: SocialSharing,
    private theInAppBrowser: InAppBrowser,
  ) 
  {
    this.cid = this.navParams.get('id');
    this.cattype=this.navParams.get('cattype')
    console.log('cattype on productlist',this.cattype);
    if (this.cattype=='Under $50')
    {
      this.price='50';
    }
    else if (this.cattype=='Under $100')
    {
      this.price='100';
    }
   else if (this.cattype=='Under $500')
    {
      this.price='500';
    }
    this.user_id = AuthService.getuserid();
    this.getProductlist(this.cid);

    this.title="Gypsy";
    console.log('userid',this.user_id)
  }


  ionViewDidLoad() 
  {
    this.events.publish('hideFooter', { isHidden: false});
    console.log('ionViewDidLoad ProductListPage');
  }


  getProductlist(cid)
  {     
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
 });
 loading.present();
 if (this.cattype=='Under $50' || this.cattype=='Under $100'||this.cattype=='Under $500')
  {
 console.log('PPPRRRIIICCEEE',this.price)

    this.api.post('special_product_list',{price:this.price,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.ACK === 1){  
        loading.dismiss();
        this.productList = response.products;  
        this.image_url = response.link;
        console.log(this.image_url)
      }else{
        loading.dismiss();
        this.productList=='';
        this.service.popup('', 'Product Not Found');
      }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Error');
    });
  }

  else 
  {
    
  console.log('userid',this.user_id)
  this.api.post('product_list',{cid:cid,user_id:this.user_id}).subscribe((response : any)  => {
    console.log(response);
    if(response.ACK === 1){  
      loading.dismiss();
      this.productList = response.products;  
      this.image_url = response.link;
      console.log(this.image_url)
    }else{
      loading.dismiss();
      this.productList=='';
      this.service.popup('Alert', 'Product Not Found');
    }
  }, err => {
    loading.dismiss();
    this.service.popup('Alert', 'Error');
  });
}
      }


 addToCart(productId)
{
  console.log(productId);
  this.api.post('addcart',{id:this.user_id,product_id:productId}).subscribe((response : any)  => {
    console.log(response);

    if(response.Ack == 1){
     
      this.service.popup('success',response.msg);

    }
    else{
      this.service.popup('Sorry',response.msg);
    
    }
    }, err => {
      this.service.popup('Alert', 'Something went wrong');
  });
}


      gotoDetails(id) 
      {   
        this.navCtrl.push('DetailPage', {id:id});
      }



      addLikelLst(id, index)
      {    
        let loading = this.loadingCtrl.create({
             content: 'Loading...',
          
        });
        loading.present();
        this.api.post('addlike',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
          console.log(response);

          if(response.Ack === 1){
            loading.dismiss();
            this.productList[index].like = 1; 
            this.productList[index].total_like = this.productList[index].total_like+1;}

            else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }

          else{
            loading.dismiss();
            this.productList[index].like = 0; 
            this.productList[index].total_like = this.productList[index].total_like-1;   
          }
        }, err => {
          loading.dismiss();
          console.log(err)
        });
      }



      addWishList (id, index)
      {    
        let loading = this.loadingCtrl.create({
             content: 'Loading...',
        
        });
        loading.present();
        this.api.post('addwishlist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
          console.log(response);

          if(response.Ack === 1){
            loading.dismiss();
            this.productList[index].wishlist = 1; 
            this.productList[index].total_wishlist = this.productList[index].total_wishlist+1;             }
         
         
            else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }
            else{
            loading.dismiss();
            this.productList[index].wishlist = 0; 
            this.productList[index].total_wishlist = this.productList[index].total_wishlist-1;   
          }
        }, err => {
          loading.dismiss();
          console.log(err)
        });
      }



      facebookShare(image,fblink) 
      {
        let loading = this.loadingCtrl.create({
          content: 'Loading...',
     });
     loading.present();
        this.socialSharing.shareViaFacebook(this.title,null,fblink).then(() => {
          console.log("shareSheetShare: Success");
          loading.dismiss();
        }).catch(() => {
          console.error("shareSheetShare: failed");
          loading.dismiss();
        });      
      }
    

      twitterShare(image,twitterlink) 
      {
        let loading = this.loadingCtrl.create({
          content: 'Loading...',
     });
     loading.present();
        this.socialSharing.shareViaTwitter(this.title,image,twitterlink).then(() => {
          console.log("shareSheetShare: Success");
          loading.dismiss();
        }).catch(() => {
          console.error("shareSheetShare: failed");
          loading.dismiss();
        });
      }


      public openWithInAppBrowser(url : string,image)
      {
        let target = "_system";
        this.theInAppBrowser.create(url,target,this.options);
      }

}
