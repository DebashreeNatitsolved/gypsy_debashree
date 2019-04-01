import { Component,ViewChild } from '@angular/core';
import { Platform,Nav,MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { ServiceProvider } from '../providers/service/service';



import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any;
  @ViewChild(Nav) nav: Nav;

  public footerIsHidden: boolean = false;


  username:any;
  user_image:any;
  categoryList:any;
  image_url:any;
  user_id:any;
  catType:any;


  activehome:boolean=true;
  activemyactivity:boolean=false;
  activesocial:boolean=false;
  activesettings:boolean=false;

  constructor(
    platform: Platform,
    
    public events: Events, 
    public api: ApiProvider,
    private service: ServiceProvider,
    public menuCtrl: MenuController,
    public loadingCtrl:LoadingController, 
    statusBar: StatusBar,
    splashScreen: SplashScreen, 
    
    private AuthService: AuthProvider) {

      this.getCategorylist();
     if ( AuthService.getuserid()!='') 
     {
       this.user_id = AuthService.getuserid();
       console.log('APPPPPCCCCCMMMMM',this.user_id)
     }
     else
     {
      this.user_id='';
      console.log('MMMMMMMMMMM',this.user_id)
     }
      platform.ready().then(() => {
          
          events.subscribe('hideFooter', (data) => {
            this.footerIsHidden = data.isHidden;
          })

          console.log(AuthService.getuserid());      
          if( AuthService.getuserid() ){
            this.rootPage = 'HomePage';
            

          }else{
            events.publish('hideFooter', {isHidden: true});
            this.rootPage = 'LoginPage';
           
          }
          statusBar.styleDefault();
          splashScreen.hide();
          this.getCategorylist();
      });

  AuthService.user$.subscribe( (response :any ) => {

   console.log(response);
   
      if(response.first_name){
        
          this.username = response.first_name+' '+response.last_name;
          this.user_image = response.user_image;
  
          localStorage.setItem('login_user_image',this.user_image );
         
      }else{
          this.username = '';
      }  
  })
  }


  footertab()
  {
  this.activehome=true;
  this.activemyactivity=false;
  this.activesocial=false;
  this.activesettings=false; 
  }


  getCategorylist(){   
    console.log('GGGGEEEEETTTTTCCCCAAAATTT',this.AuthService.getuserid()) 
    this.user_id=this.AuthService.getuserid();
    this.api.post('categoryList',{user_id:this.user_id}).subscribe((response : any)  => {
      console.log(response);
      if(response.Ack === 1){     
          this.categoryList = response.categories;  
          this.image_url = response.image_url;   
      }
    }, err => {
      this.service.popup('Alert', 'No Category');
    });    
      }


logout(){
  localStorage.removeItem("authID");
  localStorage.setItem("authID", "");
  localStorage.removeItem("authTYPE");
  this.nav.setRoot('LoginPage');
}


openPage(page,number){
  console.log('click on',number)
  if (number==1)
  {
    this.activehome=true;
    this.activemyactivity=false;
    this.activesocial=false;
    this.activesettings=false;   
    this.nav.setRoot(page);
  }

  else if (number==2)
  {
    this.activehome=false;
    this.activemyactivity=true;
    this.activesocial=false;
    this.activesettings=false;   
    this.nav.push(page);
  }

  else if (number==3)
  {
    this.activehome=false;
    this.activemyactivity=false;
    this.activesocial=true;
    this.activesettings=false; 
    this.nav.push(page);  
  }

  else if (number==4)
  {
    this.activehome=false;
    this.activemyactivity=false;
    this.activesocial=false;
    this.activesettings=true;   
    this.nav.push(page);
  }
}


productList(id,name){ 
  console.log('cattype',name)
    this.nav.push("ProductListPage", {id:id, cattype:name});  
  }
  
  
goFollow(id, index){
  let loading = this.loadingCtrl.create({   
    content: 'Loading...',    
  });
  loading.present();

  if (this.AuthService.getuserid()=='')
  {
    loading.dismiss();
console.log('cartuserid',this.AuthService.getuserid())
this.service.popup('', 'Please login');
  }
  else{
    console.log('logged user')
    this.user_id = this.AuthService.getuserid();
  this.api.post('category_follow',{user_id:this.user_id, category_id:id}).subscribe((response : any)  => {
    console.log(response);

    if(response.ACK == 1){   
      loading.dismiss();  
      this.categoryList[index].is_follow = 1; 
      console.log('if',this.categoryList[index].is_follow)
           
    }
    else{
      loading.dismiss();
      this.categoryList[index].is_follow = 0; 
      console.log('else',this.categoryList[index].is_follow)
    }
  }, err => {
    loading.dismiss();
    console.log(err)
  });
}

}





}


