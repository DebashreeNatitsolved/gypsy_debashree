import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,MenuController,ToastController,LoadingController } from 'ionic-angular';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Loading } from 'ionic-angular/components/loading/loading';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect,TwitterConnectResponse} from '@ionic-native/twitter-connect';




@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})

export class LoginPage {
  data: any = {};
  deviceinfo : any;
  isValidEmail = true;  
  submitted = false;
  loginForm: FormGroup;
  isLoggedIn:boolean = false;
  users: any;
  fb_id:any;  
  displayName: any;
  gplusemail: any;
  familyName: any;
  givenName: any;
  gplususerId: any;
  imageUrl: any;
  isLogIn:boolean = false;
  userProfile: any = null;
  twitterUserId:any;
  twitterName:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events: Events,
    private fb: FormBuilder,
    public toastCtrl:ToastController,
    private facebook: Facebook,
    public loadingCtrl:LoadingController,
    private googlePlus: GooglePlus,
  
    private twitter: TwitterConnect,
  ) {
    this.loginForm = fb.group({           
      'email_address':[null, Validators.required],
      'password': [null, Validators.required],
      'rememberme':[null, null]     
    });
   this.loginForm.controls['rememberme'].setValue(false);
    }


   facebooklogin() 
   {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      });
    loading.present();
    this.facebook.login(['public_profile', 'email'])
    .then(res => {
      console.log("FBDATA",res);
      if(res.status === "connected") {
        loading.dismiss();
        this.getUserDetail(res.authResponse.userID);

        this.fb_id = res.authResponse.userID;
            var fb_token = res.authResponse.accessToken;
      } else {
        loading.dismiss();
      }
    }, 
    err => {
      loading.dismiss();
      this.service.popup('', 'Login Failed');     
    });
  }

  


  getUserDetail(userid) {
    this.facebook.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
    .then(res => {
      console.log("FBDATA",res);
      this.users = res;
      
      var gender    = res.gender;
      var birthday  = res.birthday;
      var name      = res.name;
      var email     = res.email;

      console.log("=== USER INFOS ===");
      console.log("Gender : " + gender);
      console.log("Birthday : " + birthday);
      console.log("Name : " + name);
      console.log("Email : " + email);
     
      let loading = this.loadingCtrl.create({
        content: 'Loading...',
        });
      loading.present();
      this.api.post('fblogin',{id:this.fb_id,email:email,name:name}).subscribe((response : any)  => {
        console.log(response);

      
      if(response.Ack == 1){
          loading.dismiss();
          console.log("Successfully Login",response.details.User.id,'eee',response.details.User.email_address);
          localStorage.setItem("authID", response.details.User.id);
          localStorage.setItem("authTYPE", response.details.User.email_address);
          localStorage.setItem("loginTYPE",'fblogin');
          this.navCtrl.setRoot('HomePage')
      }else{
        loading.dismiss();
        this.service.popup('', 'Wrong EmailId & Password');
      }
    }, 
    err => {
      loading.dismiss();
      this.service.popup('', 'Login Failed');     
    });
    })
  }

   
public checkEmail(values: Object): void 
{
  if (values != '' ) {
    this.isValidEmail = this.validateEmail(values);      
   } 
}


validateEmail(email_address) 
{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email_address);
}


  login(data){
    this.api.post('loginuser',data).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack == 1)
      {
          this.afloginsuccess(response);
         console.log("Successfully Login");
         localStorage.setItem("loginTYPE",'emaillogin');

         localStorage.setItem("authID", response.user_details.User.id);
         localStorage.setItem("authTYPE", response.user_details.User.email_address);
         if (data.rememberme==true)
     {
       console.log('true');
       localStorage.setItem("rememberme",data.rememberme);
       localStorage.setItem("password",data.password);

       }
      else if (data.rememberme==false)
      {
        console.log('false')
        localStorage.setItem("rememberme",data.rememberme);
      }
         
      }else{
        this.service.popup('', 'Wrong EmailId & Password');
      }
    }, err => {
      this.service.popup('', 'Login Failed');
    });

  }

  afloginsuccess(response)
  {
    console.log(response);
    localStorage.setItem("authID", response.user_details.User.id);
    localStorage.setItem("authTYPE", response.user_details.User.email_address);
    this.navCtrl.setRoot('HomePage');
    this.AuthService.initializeUserData({id: response.user_details.User.id, first_name: response.user_details.User.first_name, last_name: response.user_details.User.last_name, user_image: response.user_image});
    this.presentToast ('Successfully Login');
  }



  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  
  ionViewWillEnter()
  {
    this.events.publish('hideFooter', { isHidden: true});

console.log('authtype',localStorage.getItem('authTYPE'));
    if (this.AuthService.getremeberme()=='true')
    
    {
      console.log('remember me true')
      this.loginForm.controls ['rememberme'].setValue ('true');
      this.loginForm.controls ['email_address'].setValue (localStorage.getItem('authTYPE'));
      this.loginForm.controls ['password'].setValue (localStorage.getItem('password'));
    }
    else if (this.AuthService.getremeberme()=='false')
    {
      console.log('remember me false')
      this.loginForm.controls ['rememberme'].setValue ('false');
      this.loginForm.controls ['email_address'].setValue ('');
      this.loginForm.controls ['password'].setValue ('');
    }
  }


  onSignup() 
  {
   this.navCtrl.push("SignupPage");
  }


  gotoHome() 
  {
    localStorage.setItem("authID", "");
    this.navCtrl.setRoot('HomePage');
  }


  goForgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }


  googlepluslogin()
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      });
    loading.present();
    this.googlePlus.login({})
      .then(res => {
        
        console.log(res);
        this.displayName = res.displayName;
        this.gplusemail = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.gplususerId = res.userId;
        this.imageUrl = res.imageUrl;

        this.isLogIn = true;

       
        this.api.post('googlelogin',{id:this.gplususerId,email:this.gplusemail,name:this.givenName}).subscribe((response : any)  => {
          console.log(response);
  
        
        if(response.Ack == 1)
        {
            loading.dismiss(); 
            localStorage.setItem("authID", response.details.User.id);
            localStorage.setItem("authTYPE", response.details.User.email_address);
            this.navCtrl.setRoot('HomePage')
            localStorage.setItem("loginTYPE",'googlelogin');
        }
        else
        {
          loading.dismiss();
          this.service.popup('', response.message);
        }
      }, 
      err => {
        loading.dismiss();
        this.service.popup('', 'Something went wrong');
        
      });
        
      }, 
      err => {
        loading.dismiss();
        this.service.popup('', 'Login Failed');     
      });
  }


  twitterlogin()
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      });
    loading.present();
    this.twitter.login().then( response => {

      this.twitterUserId=response.userId;
      this.twitterName=response.userName;
      console.log('   this.twitterUserId',   this.twitterUserId,  this.twitterName)

      this.api.post('twitterlogin',{id:this.twitterUserId,name:this.twitterName}).subscribe((response : any)  => {
        console.log(response);

      
      if(response.Ack == 1)
      {
          loading.dismiss();         
          localStorage.setItem("authID", response.details.User.id);
          // localStorage.setItem("authTYPE", response.details.User.email_address);
          this.navCtrl.setRoot('HomePage')
          localStorage.setItem("loginTYPE",'twitterlogin');
      }
      else
      {
        loading.dismiss();
        this.service.popup('', response.message);
      }
    }, 
    err => {
      loading.dismiss();
      this.service.popup('', 'Something went wrong');
      
    });

     
      // console.log('login to twitter')
      // console.log(response);
      // localStorage.setItem("loginTYPE",'twitterlogin');
      // this.navCtrl.setRoot('HomePage')

    }, error => {
      loading.dismiss();
      console.log("Error connecting to twitter: ", error);
    });    
  }


}



