import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, NavController} from '@ionic/angular';
import Azpay from 'azpay';
import {Produtos} from '../item/item.page';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import * as _ from 'lodash';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase';

declare let paypal: any;
const azpay = Azpay({
  id: '487',
  key: '4ceb4990a151347494ce06f4ee071bbf',
});
export interface Produtos {
  nome?: string;
  valor?: number;
  qtd?: number;
  email?: string;
  itemId?: any;
  itemNumber?: any;
  dia?: number;
}
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})

export class CarrinhoPage implements OnInit {
  produtin;
  carrinho;
  loja;
  valor;
  valores;
  valorCompra;
  pagar;
  pagamento = '';
  moip: any;
  pubKey: any;
  hash: string;
  produtos: Array<Produtos> = [];
  nome;
  endereco;
  cidade;
  bairro;
  telefone;
  zona;
  like: number;
  disklike: number;
  email;
  paypalConfig
  mainuser: AngularFirestoreDocument;
  sub;
  lojaUID;
  produtinz;
  constructor(private payPal: PayPal, public afStore: AngularFirestore,
              public navCtrl: NavController, public alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('carrinhoUser').then((data) => {
      this.carrinho =  JSON.parse(data);
      console.log(this.carrinho);
    });
    this.storage.get('loja').then((data) => {
      this.loja =  data;
      console.log(this.loja);
    });
    this.storage.get('valorFinal').then((data) => {
      this.valor =  data + 8;
      console.log(this.valor);
    });

    console.log(this.moip);
    this.hash = 'Gerando hash...';


    this.pubKey = `-----BEGIN PUBLIC KEY-----
                     MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAodkPNhEFaP90CU2z6zKZ
                     kyPb98kI3NA4C/j9lJnzUNsqgPzfx0xdHxk0rvQvqH/shJIm76EXGBtsWuUjyO8n
                     UMrq9l/8lWPY5OsOmpHiiBZ7oLjfPN1tSs3CgNMqMyWay8F82zowXOdwZk4hY+aa
                     mkkZcg8Sou3Wo7pIcInNXy9cLClp+qhrTR9LlrMcxT7oMDwxw8CFzX7SK9EEnBz0
                     H5T1BRSXVd3VXjC75I1w6RFk9AzbDfSKgj2b6Ladf0PKm4XdruiA+C7Gad8mg7Wu
                     ZBBwoPkwFHnKFtCs+P84OqNjAyEqxOc3oGgCi6LkFRWL43DfFPcPj6QkOMZM64WO
                     DQIDAQAB
                    -----END PUBLIC KEY-----`;

  }

  ngOnInit() {

  }

  deletaItem(items) {
    console.log(items);
    console.log(this.carrinho);

    _.remove(this.carrinho, n => n.itemNumber === items.itemNumber);
    console.log(this.carrinho);
    this.storage.remove('carrinhoUser').then(() => {
        this.storage.set('carrinhoUser', JSON.stringify(this.carrinho)).then((data) => {
          this.carrinho = JSON.parse(data);
        });
      });
    this.valores = this.carrinho.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
    this.storage.remove('valorFinal').then(() => {
        this.storage.set('valorFinal', this.valorCompra).then((data) => {
          this.valor =  data + 8;
          console.log(this.valor);
        });
      });
  }
  async pagarDin() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
    this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"');
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.like = event.LikeValue;
      this.disklike = event.DislikeValue;

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      this.valores = this.carrinho.map(res => res.valor);
      this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
      this.storage.get('valorFinal').then((data) => {
        this.valor =  data + 8;
        console.log(this.valor);
      });
      this.storage.get('carrinhoUser').then((data) => {
        this.produtos =  JSON.parse(data);
        console.log(this.produtos);
        this.afStore.collection('vendas').add({
          nomeComprador: this.nome,
          endereco: this.endereco + ', ' + this.bairro + ', ' + this.cidade,
          nomeLoja: this.loja.nome,
          valor: this.valor,
          dia,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Aprovado',
          statusEnt: 'Loja informada'
        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/status');
          });        });
      });
    });

  }

  async pagarCred2() {

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


  home() {

   // this.showalert('Atenção', 'Ao sair dessa pagina');
    this.storage.remove('carrinhoUser').then(() => {
      this.navCtrl.navigateRoot('/tabs/tab1');
    });

  }
  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }


paypal(){
   this.payPal.init({
      PayPalEnvironmentProduction: 'AQEv75SGaLlQt6HIwYB2jwf7pVPcnNF_GN4Cnt_13YQlFGNOA71GNr1SRxxHlKah9Fn9SUHGa3dj2p7n',
      PayPalEnvironmentSandbox: 'AUL78e1xYqL9BppwbCQWmrVNd46DpEdPI7guKwwC9k8pTqacP608ORZSEwp6jla8jKgx6ZD6ya7CPvld'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        // payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        const payment = new PayPalPayment(this.valor, 'USD', 'Axé Delivery - ' + this.loja.nome, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid
          const user = firebase.auth().currentUser;
          if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
            console.log(user);
          } else {}
          this.sub = this.mainuser.valueChanges().subscribe(event => {
            this.nome = event.nome;
            this.endereco = event.endereco;
            this.cidade = event.cidade;
            this.email = event.email;
            this.bairro = event.bairro;
            this.telefone = event.telefone;
            this.zona = event.zona;
            this.like = event.LikeValue;
            this.disklike = event.DislikeValue;
            // tslint:disable-next-line:no-shadowed-variable
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
            console.log(dia);
            this.valores = this.carrinho.map(res => res.valor);
            this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
            this.storage.get('valorFinal').then((data) => {
              this.valor =  data + 8;
              console.log(this.valor);
            });
            this.storage.get('carrinhoUser').then((data) => {
              this.produtos =  JSON.parse(data);
              console.log(this.produtos);

              this.afStore.collection('vendas').add({
                nomeComprador: this.nome,
                endereco: this.endereco + ', ' + this.bairro + ', ' + this.cidade,
                nomeLoja: this.loja.nome,
                valor: this.valor,
                likeLoja: this.like,
                dislikeLoja: this.disklike,
                dia,
                lojaUID: this.produtos[0].lojaUID,
                produtos: this.produtos,
                emailComprador: this.email,
                emailLoja: this.produtos[0].emailLoja,
                statusPag: 'Aprovado',
                statusEnt: 'Loja informada'
              }).then(() => {
                this.showalert('Obrigado pela compra!', 'A loja foi informada e você pode acompanhar o seu pedido pela aba "Seus Pedidos"');
                this.storage.remove('carrinhoUser').then(() => {
                  this.navCtrl.navigateRoot('/status');
                });
              });
            });
          });

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          this.showalert('Hmmm...', 'Verifique o seu cartão, provavelmente houve algum problema com ele.' +
              'Tente novamente mais tarde.');

          // Error or render dialog closed without being successful
        });
      }, () => {
        // tslint:disable-next-line:max-line-length
        this.showalert('Erro na configuração!', 'Estamos verificando o que aconteceu. Pode ficar tranquilo, nada será debitado do seu cartão!');

        // Error in configuration
      });
    }, () => {
      // tslint:disable-next-line:max-line-length
      this.showalert('Erro na inicialização!', 'Estamos verificando o que aconteceu. Pode ficar tranquilo, nada será debitado do seu cartão!');

      // Error in initialization, maybe PayPal isn't supported or something else
    });
}

}
