import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the HomeProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-product-list',
  templateUrl: 'home-product-list.html',
})
export class HomeProductListPage {
  id:any;
  homeProductList:any;
  image_url:any;
  title:any;
  user_id:any;
  icon:any;
  url:any;
  header:any;

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
    private service: ServiceProvider,
    private theInAppBrowser: InAppBrowser,
    public loadingCtrl:LoadingController,
    private AuthService: AuthProvider,
    private socialSharing: SocialSharing,
    public api:ApiProvider,) {
    this.id = this.navParams.get('para');
    console.log('id',this.id);
    this.user_id = AuthService.getuserid();
    this.productlist(this.id);

    this.title="Gypsy";
    this.icon="http://111.93.169.90/team6/randal_crystal/logo/logo.png";
    this.url ="https://bossasound.com/";
    
  }
  

  productlist(id)
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',  
 });
 loading.present();

    console.log('homeid',id)
  if (id=='newarrival')
  {
    this.header='New Arrival'

      this.api.post('allnewarraival',{user_id:this.user_id}).subscribe((response : any)  => {
        console.log(response);
        if(response.ACK == 1){  
          loading.dismiss();
          this.homeProductList = response.products;  
      
        }else{
          loading.dismiss();
          this.homeProductList=='';
          this.service.popup('Alert', 'Product Not Found');
        }
      }, err => {
        loading.dismiss();
        this.service.popup('Alert', 'Error');
      });
      
        
    }

   else if (id=='bestseller')
    {
      
      this.header='Best Seller';
        this.api.post('allbestseller',{user_id:this.user_id}).subscribe((response : any)  => {
          console.log(response);
          if(response.Ack == 1){  
            loading.dismiss();
            this.homeProductList = response.best_seller;  
        
          }else{
            loading.dismiss();
            this.homeProductList=='';
            this.service.popup('Alert', 'Product Not Found');
          }
        }, err => {
          loading.dismiss();
          this.service.popup('Alert', 'Error');
        });
        
          
      }

      else if (id=='recentview')
      {
        this.header='Recent View ';
          this.api.post('allrecentview',{user_id:this.user_id}).subscribe((response : any)  => {
            console.log(response);
            if(response.ACK == 1){  
              loading.dismiss();
              this.homeProductList = response.products;  
          
            }else{
              loading.dismiss();
              this.homeProductList=='';
              this.service.popup('Alert', 'Product Not Found');
            }
          }, err => {
            loading.dismiss();
            this.service.popup('Alert', 'Error');
          });                      
        }  
        else if (this.id='recommendation')
        {
          this.header='Product Recommendation';

            this.api.post('allcategory_follow_list',{user_id:this.user_id}).subscribe((response : any)  => {
              console.log(response);
              if(response.Ack == 1){  
                loading.dismiss();
                this.homeProductList = response.products;  
            
              }else{
                loading.dismiss();
                this.homeProductList=='';
                this.service.popup('Alert', 'Product Not Found');
              }
            }, err => {
              loading.dismiss();
              this.service.popup('Alert', 'Error');
            });            
          }
  }


  public openWithInAppBrowser(url : string,image)
  {
		let target = "_system";
		this.theInAppBrowser.create(url,target,this.options);
  }
  

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad HomeProductListPage');
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
        this.homeProductList[index].like = 1; 
        console.log('TOTAL LIKE',this.homeProductList[index].total_like)
        this.homeProductList[index].total_like = (this.homeProductList[index].total_like) + 1;
        console.log('TOTAL LIKE',this.homeProductList[index].total_like + 1)
      }

        else if (response.Ack == 2)
  {
    loading.dismiss();
    this.service.popup('', response.msg);
  }

      else{
        loading.dismiss();
        this.homeProductList[index].like = 0; 
        this.homeProductList[index].total_like = this.homeProductList[index].total_like-1;   
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
        this.homeProductList[index].wishlist = 1; 
        this.homeProductList[index].total_wishlist = this.homeProductList[index].total_wishlist+1;             }
     
     
        else if (response.Ack == 2)
  {
    loading.dismiss();
    this.service.popup('', response.msg);
  }
        else{
        loading.dismiss();
        this.homeProductList[index].wishlist = 0; 
        this.homeProductList[index].total_wishlist = this.homeProductList[index].total_wishlist-1;   
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
    this.socialSharing.shareViaFacebook(this.title,image,fblink).then(() => {
      console.log("shareSheetShare: Success");
      loading.dismiss();
    }).catch(() => {
      console.error("shareSheetShare: failed");
      loading.dismiss();
    });
  
  }


  twitterShare(image,twitterlink)
   {
    this.socialSharing.shareViaTwitter(this.title,image,twitterlink).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }


  gotoDetails(id) 
  {   
    this.navCtrl.push('DetailPage', {id:id});
  }


}
