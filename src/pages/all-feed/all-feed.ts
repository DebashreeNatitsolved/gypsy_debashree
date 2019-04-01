import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';
import { Content } from 'ionic-angular/components/content/content';
import { concat } from 'rxjs/observable/concat';
import { HttpClient } from '@angular/common/http';

import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the AllFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-feed',
  templateUrl: 'all-feed.html',
})
export class AllFeedPage {
  
  image_url:any;
  list:any;
  categoryList:any;

  page = 0;
  maximumPages = 1;
  users=[];

  feedlist = [];
  feedlist1:any;
  user_id:any;

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
    
    constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient,
    public api:ApiProvider,
    private service: ServiceProvider,
    private theInAppBrowser: InAppBrowser,
    public loadingctrl:LoadingController,
    private AuthService: AuthProvider,) {
    this.allfeed();  
  }

 

  allfeed(infiniteScroll?) {
    
    let loading = this.loadingctrl.create({
      content: 'Loading...',    
    });
    loading.present();

    this.api.post('allcompanyfeedlisttemp',{array_pocket:this.page})
    .subscribe(res => {
      console.log('allfeed',res)
      loading.dismiss();
      this.feedlist = this.feedlist.concat(res['feed_list']);
      console.log('allfeed')
      console.log(this.feedlist)
      this.page=res['array_pocket'];
     this.maximumPages=res['maxfieldcount']
   
      console.log(res);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    },
    err => {
      loading.dismiss();
      console.log(err)
      this.service.popup('Alert', 'Something went wrong');
    });
  }
 

  doInfinite(infiniteScroll) {
    this.page++;
    this.allfeed(infiniteScroll);
    console.log('doinfinite')
 console.log(this.feedlist)
    if (this.page === this.maximumPages) {
      infiniteScroll.complete();
    }
  }


  ionViewDidLoad() 
  {  
    console.log('ionViewDidLoad AllFeedPage');
  }
  

  public openWithInAppBrowser(url : string)
  {    
    let target = "_blank";
    let browserInst = new InAppBrowser();
    let browser = browserInst.create(url, '_blank', this.options)
	}


  public openWithInAppBrowserPinterest(url : string,image)
  {
    let target = "_system";
    let browserInst = new InAppBrowser();
    this.theInAppBrowser.create(url,'_system',this.options);
    
	}

}
