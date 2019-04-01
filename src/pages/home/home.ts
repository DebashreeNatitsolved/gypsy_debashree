import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController,Events, LoadingController,ToastController,Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { concat } from 'rxjs/observable/concat';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import {MyApp} from '../../app/app.component'

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  newarraivalList:any;
  image_url:any;
  bestseller:any;
  heart=false;
  like=false;
  user_id:any;
  follow_products:any;
  myInput:any;
  noofcart:any;
  recentviewlist:any;
  categoryList:any;
  followinglist:any;
  productmarketing:any;
  MarketingimageUrl:any;
  recommenproductimage:any;
  homePageCategory:any;
  title:any;
  icon:any;
  url:any;
  searchresult:any;
  typeinput:any;
  type:any;
  id:any;
  showSearchbar:boolean=false;
 
  
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
    fullscreen : 'yes',
  }


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private events: Events,
    private loadingCtrl: LoadingController,
    private theInAppBrowser: InAppBrowser,
    private socialSharing: SocialSharing,
    public toastCtrl:ToastController,
    public platform:Platform,
    private myApp:MyApp,
            ) {

    
    this.myApp.footertab();
    this.title="Gypsy";
    this.user_id = AuthService.getuserid();
    console.log('UUUUUSSSSEEERRRRRRRRRRRRR',this.user_id)
    this.myApp.getCategorylist();

if (AuthService.getuserid())   
{
  this.api.post('appopen',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log(response);
    if(response.Ack == 1){
      this.id=response.id;
      localStorage.setItem("openID",response.id);
    }
    else{
      console.log('else part')
    }
  }, err => {
  
    console.log(err)
    this.presentToast ('Something went wrong');
  });
    platform.ready().then(() => {

      if (platform.is('cordova')){

        console.log('cordova')
        this.platform.pause.subscribe(() => {
     
          if (AuthService.getopenid())

          {
            this.id=AuthService.getopenid();

            }

          this.api.post('appclose',{id:this.id}).subscribe((response : any)  => {
            console.log(response);
            if(response.Ack == 1){
              console.log('success')
            }
            else{
              console.log('else part')
            }
          }, err => {
          
            console.log(err)
       
          });
          
        }, err => {
          
          console.log(err)
          
        });
      

        //Subscribe on resume
        this.platform.resume.subscribe(() => {
         
          this.api.post('appopen',{user_id:this.user_id}).subscribe((response : any)  => 
          {
            console.log(response);
            if(response.Ack == 1)
            {
              this.id=response.id;
              localStorage.setItem("openID",response.id);
            }
            else{
              console.log('else part')
                 }
          }, err => {
          
            console.log(err)
            
                    });
          console.log('hello resume');
        }, err => {
              console.log(err)
        
        });
       }
    });
  }

   console.log('userid',this.user_id)
    this.events.publish('hideFooter', { isHidden: false});
    this.newArraival();
    this.bestSeller();
    this.recommendation();
    this.cartcount();
    this.recentView();
    this.productMarketing();
    this.followlist();
    
  }

  ionViewDidLoad() {
    console.log('userid of the user',this.user_id)
    this.cartcount();
    
    this.events.publish('hideFooter', { isHidden: false});
    console.log('ionViewDidLoad HomePage');
  }


  ionViewWillEnter()
  {   
    this.cartcount(); 
    console.log('ionViewWillEnter HomePage');   
  }


  gotoDetails(id) 
  {
    this.navCtrl.push('DetailPage', {id:id});
  }


  productMarketing(){
    console.log(this.user_id);
    this.api.post('category_follow_list',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log('productMarketing',response);
  
    if(response.Ack === 1)
    {      
      this.productmarketing= response.products;
      this.MarketingimageUrl = response.image_url;     
    }

    else
    {
      this.productmarketing=''; 
    }
    },

    err => 
    {
      console.log(err)
      this.presentToast ('Something went wrong');
    }
  );
  }


  followlist(){
    console.log(this.user_id);
    if (this.AuthService.getuserid())
    {
    this.api.post('userwise_category_follow_list',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log('category_follow_list',response);
  
    if(response.Ack === 1)
    {      
      this.followinglist= response.category;
    }
    else
    {
      this.homepagecategory();     
    }
    }, 
    err => {
      console.log(err)
      this.presentToast ('Something went wrong');
    }
  );
}
else
{
  this.homepagecategory();
}
 }


 homepagecategory()
 {
  this.api.post('homepagecategory',{}).subscribe((response : any)  => {
    console.log('homepagecategory',response);
  
    if(response.Ack === 1)
    {      
      this.followinglist= response.category;  
    }else
    {
      this.followinglist='';    
    }
    }, 
    err => {
      console.log(err)
      this.presentToast ('Something went wrong');
    }
  );
 }

  
  gotoproductlist(id)
  {
    console.log(id)
    this.navCtrl.push('ProductListPage', {id:id});
  }

  underPriceProdctList(name)
  {
    this.navCtrl.push('ProductListPage', {cattype:name});
  }


  newArraival(){
    console.log(this.user_id);
    this.api.post('newarraival',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log('new',response);

    if(response.ACK === 1){      
      this.newarraivalList = response.products;
      this.image_url = response.image_url;
      
    }else{
      this.newarraivalList='';
    }
    }, err => {
      console.log(err)
      this.presentToast ('Something went wrong');
    });
  }


  recentView(){
    console.log(this.user_id);
    this.api.post('recentview',{user_id:this.user_id}).subscribe((response : any)  => {
    console.log(response);
  
    if(response.ACK === 1)
    {      
      this.recentviewlist = response.products;
      this.image_url = response.image_url;         
    }
    
    else{
      this.recentviewlist='';     
      }
    }, 
    
    err => 
    {
      console.log(err)
      this.presentToast ('Something went wrong');
    });
  }


  bestSeller()
  {   
        this.api.post('bestseller',{user_id:this.user_id}).subscribe((response : any)  => {
        console.log('best seller',response);
          if(response.Ack === 1)
          { 
          this.bestseller = response.best_seller;          
          console.log(this.bestseller);   
          }
        else
        {
          this.bestseller='';
        }
        }, err => {
          console.log(err)
          this.presentToast ('Something went wrong');
        });    
  }


  recommendation()
  {
    this.api.post('category_follow_list',{user_id:this.user_id}).subscribe((response : any)  => {      
      console.log('recommendation',response);
        if(response.Ack === 1)
        {                  
          this.follow_products = response.products;             
          this.recommenproductimage=response.image_url;
        }
        else
        {
          this.follow_products='';
        }
      }, err => {
        console.log(err)
        this.presentToast ('Something went wrong');
      });
  }


  gotoviewCart() 
  {
    this.navCtrl.push("CartPage");
  }


  addWishList(id, index,type){
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      duration: 3000
    });
    loading.present();
    this.api.post('addwishlist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);

      if(response.Ack === 1){
        loading.dismiss();
              
       if (type=="newarraival")
        {
          console.log(type)
          this.newarraivalList[index].wishlist = 1;
          this.newarraivalList[index].total_wishlist = this.newarraivalList[index].total_wishlist+1;      
        }         
        else if (type=="category_follow_list")
        {
          console.log(type)
          
        this.follow_products[index].wishlist = 1; 
        this.follow_products[index].total_wishlist = this.follow_products[index].total_wishlist+1;     
        } 

        else if (type=="best_seller")
        {
          console.log(type)
          console.log('bestseller index',this.bestseller[index])
        this.bestseller[index].wishlist = 1; 
        this.bestseller[index].countwishlist = this.bestseller[index].countwishlist+1;     
        } 

        else if (type=="recent_view")
        {
          console.log(type)
        this.recentviewlist[index].wishlist = 1; 
        this.recentviewlist[index].total_wishlist = this.recentviewlist[index].total_wishlist+1;     
        }            
      }

      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }
      else{
        loading.dismiss();
       
      
        if (type=="newarraival")
        {
          console.log(this.type)
          this.newarraivalList[index].wishlist = 0;
          this.newarraivalList[index].total_wishlist = this.newarraivalList[index].total_wishlist-1;  
        } 
        
        else if (type=="best_seller")
        {
          console.log(type)
          console.log(this.bestseller[index])
        this.bestseller[index].wishlist = 0; 
        this.bestseller[index].countwishlist = this.bestseller[index].countwishlist-1;     
        } 


        else if (type=="category_follow_list")
        {
          console.log(type)
          
        this.follow_products[index].wishlist = 0; 
        this.follow_products[index].total_wishlist = this.follow_products[index].total_wishlist-1;     
        } 

        else if (type=="recent_view")
        {
          console.log(this.type)
        this.recentviewlist[index].wishlist = 0; 
        this.recentviewlist[index].total_wishlist = this.recentviewlist[index].total_wishlist-1;     
        } 
      
      
      }     
    }, err => {
      console.log(err)
      this.presentToast ('Something went wrong');
    });
  }


  addLikelLst(id, index,type){    
    let loading = this.loadingCtrl.create({
         content: 'Loading...',
      duration: 3000
    });
    loading.present();
    this.api.post('addlike',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);

      
      if(response.Ack === 1){
        loading.dismiss();

        if (type=="newarraival")
        {
          console.log(type)
        this.newarraivalList[index].like = 1; 
        this.newarraivalList[index].total_like = this.newarraivalList[index].total_like+1;     
        } 
        

        else if (type=="category_follow_list")
        {
          console.log(type)
          
        this.follow_products[index].like = 1; 
        this.follow_products[index].total_like = this.follow_products[index].total_like+1;     
        } 

        else if (type=="best_seller")
        {
          console.log(type)
          console.log('bestseller index',this.bestseller[index])
        this.bestseller[index].like = 1; 
        this.bestseller[index].countlike = this.bestseller[index].countlike+1;     
        } 

        else if (type=="recent_view")
        {
          console.log(type)
        this.recentviewlist[index].like = 1; 
        this.recentviewlist[index].total_like = this.recentviewlist[index].total_like+1;     
        } 
      }
      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }
      else{
        loading.dismiss();
         


        if (type=="newarraival")
        {
          console.log(this.type)
          this.newarraivalList[index].like = 0;
          this.newarraivalList[index].total_like = this.newarraivalList[index].total_like-1;      
        } 
        

        else if (type=="best_seller")
        {
          console.log(type)
          console.log(this.bestseller[index])
        this.bestseller[index].like = 0; 
        this.bestseller[index].countlike = this.bestseller[index].countlike-1;     
        } 


        else if (type=="category_follow_list")
        {
          console.log(type)
          
        this.follow_products[index].like = 0; 
        this.follow_products[index].total_like = this.follow_products[index].total_like-1;     
        } 

        else if (type=="recent_view")
        {
          console.log(this.type)
        this.recentviewlist[index].like = 0; 
        this.recentviewlist[index].total_like = this.recentviewlist[index].total_like-1;     
        } 

      }
    }, err => {
      loading.dismiss();
      console.log(err)
      this.presentToast ('Something went wrong');
    });
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
        console.log('else')      
      }
      }, err => {
        this.presentToast ('Something went wrong');
    });
  }


  facebookShare(image,fblink) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
 });
 loading.present();
    this.socialSharing.shareViaFacebook(this.title,image,fblink).then(() => {   
      console.log("shareSheetShare: Success");
      loading.dismiss();
    }).catch(() => {
      loading.dismiss();
      console.error("shareSheetShare: failed");
    });  
  }


  twitterShare(image,twitterlink) {
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


  public openWithInAppBrowser(url : string,image){
    let target = "_system";
    let browserInst = new InAppBrowser();
    let browser = browserInst.create(url, '_system', this.options)
	}


  gotosearchpage()
  {
    this.navCtrl.push('SearchPage')
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  

  gotoProductList(cat)
  {
    this.navCtrl.push('HomeProductListPage',{para:cat})
  }

}

