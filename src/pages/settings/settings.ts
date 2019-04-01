import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [GooglePlus]
})
export class SettingsPage {

  isexist: any;

  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  user_id: any;

  isLoggedIn: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private AuthService: AuthProvider,
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    private twitter: TwitterConnect,
  ) {
    if (AuthService.getuserid()) {
      this.isexist = 1;
      this.user_id = AuthService.getuserid();
    }
    else {
      this.isexist = 0;
    }
  }



  ionViewDidLoad() 
  {
    this.events.publish('hideFooter', { isHidden: false });
  }



  openPage(page) 
  {
    this.navCtrl.push(page, { para: this.user_id });
  }



  logout() 
  {
    console.log('logintype emaillogin', this.AuthService.getlogintype())
    if (this.AuthService.getlogintype() == 'emaillogin') {
      if (this.AuthService.getremeberme() == 'true') {
        this.navCtrl.push('LoginPage');
        console.log('remberme clicked')
      }
      else if (this.AuthService.getremeberme() == 'false') {
        console.log('remember me not clicked')
        console.log('logintype emaillogin')
        localStorage.removeItem("authID");
        localStorage.removeItem("authTYPE");
        localStorage.removeItem("rememberme");
        localStorage.removeItem("openID");
        localStorage.removeItem("password")
        this.navCtrl.push('LoginPage');
      }
    }

    else if (this.AuthService.getlogintype() == 'googlelogin') {
      console.log('logintype googlelogin')
      this.googlePlus.logout()
        .then(res => {
          console.log('res', res);
          this.displayName = "";
          this.email = "";
          this.familyName = "";
          this.givenName = "";
          this.userId = "";
          this.imageUrl = "";
          this.isLoggedIn = false;
          localStorage.removeItem("authID");
          localStorage.setItem("authID", "");
          localStorage.removeItem("authTYPE");
          this.navCtrl.push('LoginPage');
          localStorage.removeItem("openID");
        })
        .catch(err => console.error(err));
    }

    else if (this.AuthService.getlogintype() == 'fblogin') {
      console.log('logintype fblogin')
      this.facebook.logout()
        .then(res => {
        this.isLoggedIn = false
          localStorage.removeItem("authID");
          localStorage.removeItem("authTYPE");
          this.navCtrl.push('LoginPage');
          localStorage.removeItem("openID");
        })
        .catch(e => console.log('logout from Facebook', e));
    }

    else if (this.AuthService.getlogintype() == 'twitterlogin') 
    {
      console.log('logintype twitterlogin')
      this.twitter.logout().then(res => {
        console.log('res', res);
        this.isLoggedIn = false;
        localStorage.removeItem("authID");
        localStorage.setItem("authID", "");
        localStorage.removeItem("authTYPE");
        this.navCtrl.push('LoginPage');
        localStorage.removeItem("openID");
      }).catch(err => console.error(err));
    }
  }


}
