import { Component,ViewChild,ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController,MenuController, LoadingController,ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})


export class DetailPage {
  @ViewChild('slides') slides: Slides;
  id:any;
  user_id:any;
  prolikeList:any;
  userlikelist:any;
  url:any;
  israting:any;
  likeCount:any;
  userimagepath:any;
  productDetails: any = {};
  prolikeCount:any;
  heart = false;
  like = false;
  productimages:any;
  imageurl:any;
  currency:any;
  isShow:any;
  showList:any;
  product:any;
  rate:any;
  ratingArray:any;
  noofcart:any;
  starrating:any;
  title:any;
  followed:any;
  videolink:any;
  wishlistcount:any;
  videoUrl:any;
  video_link:any;
  filename:any;
  detailfound:any;
  likelistfound:any;


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
    private loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
   private toastCtrl:ToastController,
    private youtube: YoutubeVideoPlayer,
    private sanitizer: DomSanitizer,
    private theInAppBrowser: InAppBrowser,    
    ) {
  
      this.title="Gypsy";;
    this.id = this.navParams.get('id');
    console.log('product id',this.id)


   if (AuthService.getuserid())
   {
    this.user_id = AuthService.getuserid();
   }
   else
   {
     this.user_id="";
   }

    this.alsolikeList(this.id);
    this.detailsProduct(this.id);
    this.cartcount();
  }


  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad DetailPage');
  }


  alsolikeList(id) {
    console.log('productid',id,'userid',this.user_id)
    this.api.post('alsolikelist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log('productid',id)
      console.log(response);
      
      if(response.Ack === 1)
      {
        this.likelistfound=1;
        this.prolikeList = response.like_details;
        this.url = "http://111.93.169.90/";
        console.log(this.prolikeList);
      }
      else
      {
        this.likelistfound=0;
        this.prolikeList='';
      }
    }, err => {
      console.log(err)
    });    
  }


  detailsProduct(id) {

    let loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loading.present();

    this.api.post('productdetails',{product_id:id, user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        this.detailfound=1;
        this.likeCount=response.likecount;
        this.videolink=response.video_url;
        this.wishlistcount=response.wishlistcount;
        this.ratingArray=response.product_details.Rating
        console.log(this.ratingArray)
        if (this.ratingArray.length>0)
        {
          this.israting=1;   
          console.log(this.ratingArray.length)
          this.starrating=response.product_details.Rating[0].Rating[0].average
          
        }
        else
        {
          this.israting=0;
          console.log('rating length',this.ratingArray.length,this.israting)
          this.starrating=0;
        }
               
        this.productDetails = response.product_details.Product;
        this.productimages= response.product_details.ProductImage;
        this.imageurl=response.image_url;
        console.log('videoUrl',this.productDetails.video)

        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.video);
        console.log('videourl',this.videoUrl)
   
        if(response.like >= 1){
          this.like = true;   
        }

        if(response.wishlist >= 1){
          this.heart = true;  
        }

        console.log(this.productDetails);
        console.log('images',this.productimages);
        console.log('imageurl',this.imageurl);
        this.prolikeCount = response.product_details.Like.length;

        this.url = "http://111.93.169.90/";

      }
      else{
        this.detailfound=0;
        loading.dismiss();
        console.log('else part')
      }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
    });    
  }


  addWishList(id){
    let loading = this.loadingCtrl.create({
      content: 'Loading...',    
    });
    loading.present();

    this.api.post('addwishlist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1)
      {
        loading.dismiss();
        this.heart = true;  
        this.detailsProduct(id);     
      }

      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }
      else
      {
        loading.dismiss();
        this.heart = false; 
        this.detailsProduct(id); 
      }     
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
    });
  }


  addLikelLst(id,index){

    let loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loading.present();

    this.api.post('addlike',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1)
      {
        loading.dismiss();
        this.like = true; 
        this.detailsProduct(id);
      }

      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }

      else
      {
        loading.dismiss();
        this.like = false; 
        this.detailsProduct(id);
      }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
    });
  }


  goToCartPage()
  {
    this.navCtrl.push('CartPage')
  }


  show(prodId)
  {
    console.log('cartuserid',this.AuthService.getuserid())
    if (this.AuthService.getuserid()=='')
    {
      this.isShow =0;
      this.service.popup('', 'Please Register/Sign in to provide rating');
    }

    else
    {
    this.isShow =1;
    console.log(prodId);
    this.product=prodId
    }
  }


  showlist(prodId)
  {
    this.showList =1;
    console.log('prodid',prodId);
    this.product=prodId

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    loading.present();

    this.api.post('productlikelist',{product_id:prodId,user_id:this.user_id}).subscribe((response : any)  => {
    console.log('productlikelist',response);
       
      if(response.ACK == 1){    
        this.userimagepath=response.userimagepath;
        loading.dismiss();
       this.userlikelist=response.products;

       if(response.follow_list==0)
       {
         for(var i=0;i<this.userlikelist.length;i++)
         {
        this.userlikelist[i].User.is_follow=0;
         }
       }
      }
      else
      {
        loading.dismiss();
        this.userlikelist='';  
      }
      }, err => {
        loading.dismiss();
        this.service.popup('Alert', 'Something went wrong');
    });    
  }


  hide() 
  {
    this.isShow =0;
    this.rate='';
  }


  hidelist()
  {
    this.showList =0;
  }


  submit() 
  {  
    console.log(this.rate);
    console.log(this.product)
    this.isShow =0;
    this.api.post('addrating',{user_id:this.user_id, product_id:this.product, rating:this.rate}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){         
        this.service.popup('',response.msg);
        this.detailsProduct(this.product)
        
      }else{
     
        this.service.popup('',response.msg);
      }
      }, err => {
      
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


  cartcount()
  {
    this.api.post('noOfCart',{user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
  
      if(response.Ack == 1){
    
        this.noofcart=response.no_cart;
        
      }else{
        this.service.popup('', 'Something went wrong');
        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }


  feed(id)
  {
    this.navCtrl.push('ProductFeedPage',{param:id})
  }


  addtoCart(proid) 
  {

    if (this.AuthService.getuserid()=='')
    {
console.log('cartuserid',this.AuthService.getuserid())
this.service.popup('', 'Please login');
    }

    else
    {
    this.api.post('addcart',{id:this.user_id,product_id:proid}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        this.cartcount();
        this.service.popup('success',response.msg);
      }else{
        console.log('elsepart on add cart')
      }
      }, err => {
      	this.service.popup('Alert', 'Something is Wrong');
      });
    }
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
		let target = url;
		this.theInAppBrowser.create(target,image,this.options);
	}


  follow(id,index)
  {
    console.log('userid',this.user_id)
    console.log('userid2',id)
    this.api.post('followuser',{followed_by:this.user_id,follower_to:id}).subscribe((response : any)  => {
     
      console.log(response);
  
      if(response.Ack == 1){
        console.log('follow')
        console.log('isfollow',this.userlikelist[index])        
        this.service.popup('',response.msg);
this.userlikelist[index].User.is_follow=response.followed;
console.log(this.userlikelist[index].User.is_follow);     
      }

      else if (response.Ack == 2)
      {        
        this.service.popup('', 'Please login');
      }
      else
      {
        this.service.popup('', response.msg);        
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }



  userprofile(id) 
  {    
  console.log('id',id);
    this.navCtrl.push('UserProfilePage',{para:id});    
  }


  gotoDetails(id)
  {
    this.navCtrl.push('DetailPage', {id:id});
  }
  

  peopleaddWishList(id,index)
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',     
    });
    loading.present();
    this.api.post('addwishlist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();
        this.prolikeList[index].wishlist = 1; 
        this.prolikeList[index].total_wishlist = this.prolikeList[index].total_wishlist+1; 
      }

      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }
      else
      {
        loading.dismiss();            
        this.prolikeList[index].wishlist = 0; 
        this.prolikeList[index].total_wishlist = this.prolikeList[index].total_wishlist-1; 
      }     
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
    });
  }


  peopleaddLikelLst(id,index)
  {    
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loading.present();
    this.api.post('addlike',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){
        loading.dismiss();            
        this.prolikeList[index].like = 1; 
        this.prolikeList[index].total_like = this.prolikeList[index].total_like+1;     
      }
      else if (response.Ack == 2)
      {
        loading.dismiss();
        this.service.popup('', response.msg);
      }

      else{
        loading.dismiss();
               
        this.prolikeList[index].like = 0; 
        this.prolikeList[index].total_like = this.prolikeList[index].total_like-1;
      }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
    });
  }


  next()
  {
    console.log('slidenext')
    console.log(this.slides)
    this.slides.slideNext();   
  }


  prev()
  {
    console.log('slidenext')
    console.log(this.slides)
    this.slides.slidePrev();      
  }

 
}
