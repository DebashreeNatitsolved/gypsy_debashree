import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  user_id:any;
  userdata:any;
  likelistdata:any;
  wishlistdata:any;
  username:any;
  parameter:any;
  useremail:any;
  userphone:any;
  imageurl:any;
  userimagepath:any;
  productImageUrl:any;
  followinglist:any;
  followerlist:any;
  followkey:any;
  address:any;
  signinUser:any;
  recommendedList:any;
  loginUserid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private loadingCtrl: LoadingController,)
    
    {
      this.user_id = AuthService.getuserid();      
      this.parameter=this.navParams.get('para');
      console.log('userid',this.parameter);

      if (AuthService.getuserid()==this.navParams.get('para'))
       {
        console.log('me')
        this.signinUser=1;
       }
       else
       {
         console.log('others')
         this.signinUser=0;
       }     
       this.userprofile(this.parameter);
  }

 
  
  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad UserProfilePage');
    this.recommendation();
  }


  userprofile(id)
  {
    if (id==this.user_id)
    {
      console.log('me')
      this.signinUser=1;
     }
     else{
       console.log('others')
       this.signinUser=0;
     }

    let loading = this.loadingCtrl.create({
      content: 'Loading...',  
    });
    loading.present();

    this.api.post('UserDetails',{user_id:id,login_user:this.user_id}).subscribe((response : any)  => {
      console.log(response);

      if(response.ACK === 1)
      {  
      loading.dismiss();
      this.userdata=response.user_details;
      this.followkey=response.is_follow;
      this.likelistdata=response.likes;
      this.wishlistdata=response.wishlist;
      this.followinglist=response.following_details;
      this.followerlist=response.follower_details;      
      this.username=this.userdata.User.first_name +''+this.userdata.User.last_name;
      this.userimagepath=this.userdata.UserImage;     
      this.useremail=this.userdata.User.email_address;
      this.userphone=this.userdata.User.phoneno;
      this.address=this.userdata.User.address;
      this.loginUserid=this.userdata.User.id;
      this.imageurl=response.image_url;
      this.productImageUrl=response.prod_imgurl;

      console.log('imageurl',this.userimagepath)      
      console.log('userdata',this.userdata)
      console.log('username',this.username)
      }
      
      else
      {
        console.log('else part')
        loading.dismiss();
      }
      }, err => {
        loading.dismiss();
      	this.service.popup('Alert', 'Something is Wrong');
      });
  }



  recommendation()
  {
    this.api.post('user_recommend',{user_id:this.user_id}).subscribe((response : any)  => {    
      console.log(response); 
      if(response.Ack == 1)
      {
        this.recommendedList=response.rusers;
      }
      else
      {
        this.recommendedList='';
      }
    });
  }



  follow(id,index)
  {
    console.log('userid',this.user_id)
    console.log('userid2',id)
    this.api.post('followuser',{followed_by:this.user_id,follower_to:id}).subscribe((response : any)  => {     
      console.log(response); 
      if(response.Ack == 1)
      {
        console.log('follow')       
        this.service.popup('',response.msg);
        this.recommendedList[index].follow=response.followed;  
      }
  
      else if (response.Ack == 2)
      {       
        this.service.popup('', 'Please login');
      }
      else
      {
        this.service.popup('', response.msg);
        this.recommendedList[index].follow=response.followed;     
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }
  


  otheruserfollow(id,index)
  {
    console.log('userid',this.user_id)
    console.log('userid2',id)
    this.api.post('followuser',{followed_by:this.user_id,follower_to:id}).subscribe((response : any)  => {   
      console.log(response);

      if(response.Ack == 1)
      {
        console.log('follow')       
        this.service.popup('',response.msg);
        this.followkey=response.followed;   
      }
  
      else if (response.Ack == 2)
      {       
        this.service.popup('', 'Please login');
      }

      else
      {
        this.service.popup('', response.msg);
        this.followkey=response.followed;       
      }
      }, err => {
        this.service.popup('Alert', 'Something went wrong');
    });
  }

 
  gotodetails(id) 
  { 
    this.navCtrl.push('DetailPage', {id:id});
  }


}
