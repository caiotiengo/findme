import { Component, OnInit, ViewChild } from '@angular/core';
import {NavController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore'
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import {AlertController} from '@ionic/angular'

export interface User {
  name: string 
  role: string 
    boss:string 
    company:string
    email: string
}
export interface Processo {
    name?: string 
    role?: string 
    boss?:string 
    company?:string
    LikeValue?: number;
    DislikeValue?: number;
    tellme?:string;
    email?:string;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})

export class ItemPage implements OnInit {
  @ViewChild('mySlider', {static: true})  slides: IonSlides;

	item: any =[]
	mainuser: AngularFirestoreDocument
    name: string ;
    role: string ;
    boss:  string ;
    company:  string ;
    email: string;
    sub
    proc
    procUser: any ;
    LikeValue: number;
    DislikeValue: number;
    likes: number;
    dislikes:number
    public  proccesso: Processo = {};
    private que: string = null;
    private loading: any;
    private productSubscription: Subscription;
    qualquer
    slideOpts = {
       initialSlide: 1,
       speed: 400
       };
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,private route: ActivatedRoute, private storage: Storage,
    public afStore:AngularFirestore,  public services: ServiceService,
    public modalController: ModalController) {
   
	 this.que = 	this.route.snapshot.paramMap.get('id');
     this.modalController.dismiss({
      'dismissed': true
    });
   console.log(this.que)
	    this.proc = this.afStore.collection('proccess').valueChanges().subscribe(data =>{
          this.item = data;
           console.log(this.item)
          
      })
      this.procUser = this.services.getProc(this.que);
      console.log(this.services.getProc(this.que));
      
      if(this.que){
        this.loadProduct();
      }
      console.log(       this.services.getLikes(this.que)       

        )
   }

  ngOnInit() {


  }
   loadProduct() {
    this.productSubscription = this.services.getProc(this.que).subscribe(data => {
      this.proccesso = data;
      this.likes = data.LikeValue
      this.dislikes = data.LikeValue
      console.log(this.proccesso)
      console.log(this.likes)
      console.log(this.dislikes)
    });
  }
      nextSlide(mySlider){
        console.log(mySlider)
            mySlider.slideNext(mySlider);
      }
      slidePrev(mySlider){
                console.log(mySlider)
        mySlider.slidePrev(mySlider);
      }
  async handleLike(){
       this.likes++;
         try{
           await this.services.like(this.que, this.proccesso)
           this.showalert('Thanks for your feedback!', "We hope this helps you.")
         }catch(e){
           console.log('Erro' + e)
         }
  }
 async handleDislike(){
       this.dislikes++;
         try{
           await this.services.dislike(this.que, this.proccesso)
           this.showalert('Thanks for your feedback!', "We'll fix things up!")
         }catch(e){
           console.log('Erro' + e)
         }
  }
 back(){
      this.navCtrl.navigateRoot('/list')
   }

  home(){
    this.navCtrl.navigateForward('/tabs/tab1')
  }
  pesquisa(){
    this.navCtrl.navigateForward('/list')
  }
    addProc(){
     let user = firebase.auth().currentUser;

    if(user){
      this.navCtrl.navigateForward('/add-proc');
      console.log('Fine')
  }else{
    this.navCtrl.navigateForward('/login');
  }
  }

    async showalert(header:string, message:string){
        const alert = await this.alertCtrl.create({
          header,
          message,
          buttons: ['Ok']
        });

        await alert.present();
      }
  perfilPage(){
      let user = firebase.auth().currentUser;

    if(user){
      this.navCtrl.navigateForward('/user')
    }else{
      this.navCtrl.navigateForward('/login')
    }
  }

 like(){
   

  }
}
