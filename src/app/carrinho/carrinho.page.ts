import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, NavController} from '@ionic/angular';
import Azpay from 'azpay';

import jsencrypt from 'jsencrypt';
import { MoipCreditCard } from 'moip-sdk-js';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import * as _ from 'lodash';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import moipSdk from 'moip-sdk-node'

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
  lojaUID?:any;
  emailLoja?:string;
  price?:number;
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
  userCPF
  produtinz;
  numeroCard = "";
  nomeCartao = "";
  CVV = "";
  mesValidade = "";
  anoValidade = "";
  DOB
  CEP
  estado
  numeroEND
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
      this.valor =  Number(data.toFixed(2));
      console.log(this.valor);
    });
    const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {

    }
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
      this.userCPF = event.cpf;
      this.DOB = event.DOB;
      this.numeroEND = event.numeroEND;
      this.CEP = event.CEP;
      this.estado = event.estado
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

  this.moip = moipSdk({
    //accessToken: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
        // production: false
    production: false
  })

  }

teste(){
  MoipCreditCard
    .setEncrypter(jsencrypt, 'ionic')
    .setPubKey(this.pubKey)
    .setCreditCard({
        number: this.numeroCard, //'4012001037141112',
        cvc: this.CVV, //'123',
        expirationMonth: this.mesValidade ,//'05',
        expirationYear: this.anoValidade//'22'
    })
    .hash()
    .then(hash => {
      console.log('hash', hash)
      this.hash = hash;
        this.moip.order.create({
            ownId: this.userCPF,
            amount: {
                currency: 'BRL',
                subtotals: {
                    shipping: 800
                }
            },
            items: this.carrinho,
            customer: {
                ownId: this.userCPF,
                fullname: this.nome,
                email: this.email,
                birthDate: '1980-01-02',
                taxDocument: {
                    type: 'CPF',
                    number: this.userCPF
                },
                phone: {
                    countryCode: '55',
                    areaCode: '21',
                    number: this.telefone
                },
                shippingAddress: {
                    street: this.endereco,
                    streetNumber: this.numeroEND,
                    complement: 8,
                    district: this.bairro,
                    city: this.cidade,
                    state: this.estado,
                    country: 'BRA',
                    zipCode: this.CEP
                }
            }
        }).then((response) => {
            console.log(response.body)
            this.moip.payment.create(response.body.id, {
            installmentCount: 1,
            fundingInstrument: {
                method: 'CREDIT_CARD',
                creditCard: {
                    hash: this.hash,
                    holder: {
                        fullname: this.nome,
                        birthdate: '1980-01-02',
                        taxDocument: {
                            type: 'CPF',
                            number: this.userCPF
                        },
                        phone: {
                            countryCode: '55',
                            areaCode: '11',
                            number: this.telefone
                        }
                    }
                }
            }
        }).then((response) => {

          if(response.body.status === 'IN_ANALYSIS'){

              const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
               this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"')
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
        var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        console.log(seq);
        this.afStore.collection('vendas').add({
          nPedido:Number(seq),
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
            this.navCtrl.navigateRoot('/tabs/tab3');
          });        
        });
      });
    });
          }
        }).catch((err) => {
            console.log(err)
        })
        }).catch((err) => {
            console.log(err)
        })

  });

}

  ngOnInit() {

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
        var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        console.log(seq);
        this.afStore.collection('vendas').add({
          nPedido:Number(seq),
          nomeComprador: this.nome,
          endereco: this.endereco + ', ' + this.bairro + ', ' + this.cidade,
          nomeLoja: this.loja.nome,
          valor: this.valor,
          dia,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Em dinheiro',
          statusEnt: 'Loja informada'
        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/tabs/tab3');
          });        
        });
      });
    });

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




}
