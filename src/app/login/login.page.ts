import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
declare let paypal: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  paypalConfig
  valor = '';

  constructor(public navCtrl: NavController, private storage: Storage,
              public router: Router, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService, public modalController: ModalController) {



      }

  ngOnInit(){
    
  }

  async pagarCred() {
   
  this.paypalConfig ={
    env:'sandbox',
    client:{
      sandbox:'AUL78e1xYqL9BppwbCQWmrVNd46DpEdPI7guKwwC9k8pTqacP608ORZSEwp6jla8jKgx6ZD6ya7CPvld'
    },
    commit: true,
    payment:(data, actions) =>{
      return actions.payment.create({
        payment: {
          transactions: [
            {amount:{total: this.valor, currency: 'BRL'}}
          ]
        }
      })
    },
    onAutorize: (data, actions) =>{
      return actions.payment.execute().then((payment) => {
        console.log('pagamento lindo! foi papai!')
      })
    },
    ngAfterViewChecked():void{
      if(!this.addPaypalScript){
        this.addPaypalScript().then(() =>{
          paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn')
        })
      }
    },
    addPaypalScript() {
      this.addScript = true;
      return new Promise((resolve,reject) =>{
        let scriptagElement= document.createElement('script')
        scriptagElement.src = 'http://www.paypalobjects.com/api/checkout.js'
        scriptagElement.onload = resolve
        document.body.appendChild(scriptagElement)
      })
    }
  }
}
  registrar() {

  	this.navCtrl.navigateForward('/register');
  	console.log('Fine');
   // saudade do meu amor
  }
 async entrar() {
    const{email, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if (res.user) {
        this.storage.set('email', res.user.email);
        this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
        this.navCtrl.navigateRoot('/user');
      }

    } catch (err) {
      console.dir(err);
      if (err.code === 'auth/user-not-found') {
        console.log('password not match');
        this.showalert('Opa!', 'Parece que você ainda não é cadastrado, mas não tem problema! Clique em "Ok" para se cadastrar');
        this.navCtrl.navigateRoot('/register');


      }if (err.code === 'auth/wrong-password'){
          this.showalert('Hmmm...', 'Parece que você digitou a senha errada, tente novamente.');

      }
    }
  }

  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }


}
