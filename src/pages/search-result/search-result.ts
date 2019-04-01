import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';
import { concat } from 'rxjs/observable/concat';
import {FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  
  searchkeyword:any;
productlist:any;
user_id:any;
imageurl:any;
searchdata:any;
searchdataSet:any;
isShow:any;
maxvalue:any;
minvalue:any;
checkvalue:any;
formGroup: FormGroup;
searchedkeyword:any;

title:any;
  icon:any;
  url:any;


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
    private AuthService: AuthProvider,
    public loadingCtrl:LoadingController, 
    private fb: FormBuilder,
    private socialSharing: SocialSharing,
    private theInAppBrowser: InAppBrowser,
    ) {
   
      this.title="Gypsy";
    this.icon="http://111.93.169.90/team6/randal_crystal/logo/logo.png";
    this.url="https://bossasound.com/";
      this.checkvalue=1;  
    this.user_id = AuthService.getuserid();
  this.searchdata=JSON.parse(this.navParams.get('parameter'));

console.log('searchdata',this.searchdata)

this.searchdataSet=
  {
    'keywords':this.searchdata.keywords,
    'max':this.searchdata.max,
    'min':this.searchdata.min,
    'user_id':this.user_id
  }

console.log(this.searchdataSet)
this.searchresult();

  }

searchresult()
{
  let loading = this.loadingCtrl.create({
    content: 'Loading...',
  });
  loading.present();
  console.log('parameter',this.searchdataSet)
  this.api.post('pricesearch',this.searchdataSet).subscribe((response : any)  => {
    console.log('response',response);

    if(response.ACK == 1){
      loading.dismiss();
      this.productlist = response.products;
      this.imageurl=response.image_url;
    
      console.log(this.productlist)

    }else{
      loading.dismiss();
      this.productlist='';
    
    }
    }, err => {
      loading.dismiss();
      this.service.popup('Alert', 'Something went wrong');
  });
}


gotoDetails(productId)
{
  this.navCtrl.push('DetailPage', {id:productId});
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
      this.service.popup('Sorry','Please try again later');
    
    }
    }, err => {
      this.service.popup('Alert', 'Something went wrong');
  });
}


  ionViewDidLoad() 
  {
    
    console.log('ionViewDidLoad SearchResultPage');
  }


  showfilter()
  {
    this.isShow=1;
  }

  gotosearchresult(data)

  {
    this.checkvalue=data;
console.log(data)


this.isShow=0;
if (this.navParams.get('parameter'))
{
  this.searchdata=JSON.parse(this.navParams.get('parameter'));
console.log('searchdata',this.searchdata)

this.maxvalue=this.searchdata.max,
this.minvalue=this.searchdata.min,
this.searchedkeyword=

console.log('maxval',this.maxvalue)
console.log('minval',)

this.searchdataSet=
  {
    'keywords':this.searchdata.keywords,
    'filterdata':data,
    'max':this.maxvalue,
    'min':this.minvalue,
  }
  this.searchresult();
}
}

  hidelist()
  {
    this.isShow=0;
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
        this.productlist[index].like = 1; 
        this.productlist[index].total_like = this.productlist[index].total_like+1;}

        else if (response.Ack == 2)
  {
    loading.dismiss();
    this.service.popup('', response.msg);
  }

      else{
        loading.dismiss();
        this.productlist[index].like = 0; 
        this.productlist[index].total_like = this.productlist[index].total_like-1;   
      }
    }, err => {
      loading.dismiss();
      console.log(err)
    });
  }


  addWishList (id, index){    
    let loading = this.loadingCtrl.create({
         content: 'Loading...',
    
    });
    loading.present();
    this.api.post('addwishlist',{product_id:id,user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);

      if(response.Ack === 1){
        loading.dismiss();
        this.productlist[index].wishlist = 1; 
        this.productlist[index].total_wishlist = this.productlist[index].total_wishlist+1;             }
     
     
        else if (response.Ack == 2)
  {
    loading.dismiss();
    this.service.popup('', response.msg);
  }
        else{
        loading.dismiss();
        this.productlist[index].wishlist = 0; 
        this.productlist[index].total_wishlist = this.productlist[index].total_wishlist-1;   
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
