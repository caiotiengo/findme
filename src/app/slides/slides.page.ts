import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import * as firebase from 'firebase';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Http, RequestOptions} from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import {HttpHeaders} from '@angular/common/http';
import Azpay from 'azpay';

const azpay = Azpay({
  id: '487',
  key: '4ceb4990a151347494ce06f4ee071bbf',
});
@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  mainuser: AngularFirestoreDocument;
  private API_URL = 'https://api.sandbox.paypal.com';
  constructor(public navCtrl: NavController, public http: Http, public afStore: AngularFirestore) {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      this.navCtrl.navigateRoot('/tabs');
    } else {

    }
  }
  async pagar2() {

  }
  pagar() {
  /*
  * {
    "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer
    * https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller
    * https://uri.paypal.com/services/payments/payment/authcapture openid
    * https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund
    *  https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.*
    * https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.*
    *  https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
    "access_token": "A21AAGn83SAvyldiU7-BwoEy_9OtXDoqc709MT2vvabq-J2VaJB868nOLdF4x4q7g6wJqR5HQVICDkOTC-X4-2RUtktQrdIUg",
    "token_type": "Bearer",
    "app_id": "APP-80W284485P519543T",
    "expires_in": 32400,
    "nonce": "2020-05-20T22:30:57ZAND3SxLICjx5GxpHBz-UcH_AZWKYdxfN-sNYV_sH2Tk"
}
  *
  *
  * */
  return new Promise((resolve, reject) => {
    const headers = new HttpHeaders({
      Authorization: 'A21AAGSiod7nUiwsrGy4CpvQBkQreuMwIhLJokjCetWyJ3-_20jjb4r2Fr7skC7CSQlzvoQjz3HY6EIUcUlrV_oByCIBUXx0A',
      'Content-Type': 'application/json',
      // iss: 'AUL78e1xYqL9BppwbCQWmrVNd46DpEdPI7guKwwC9k8pTqacP608ORZSEwp6jla8jKgx6ZD6ya7CPvld',
      // payer_id: '8P7PHJ5SLRKWC'
    });
    const options: any = { headers } ;
    const dados = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [{
        amount: {
          currency: 'BRL',
          total: '93.00',
          details: {
            shipping: '11',
            subtotal: '75',
            shipping_discount: '1.00',
            insurance: '1.00',
            handling_fee: '1.00',
            tax: '6.00'
          }
        },
        description: 'This is the payment transaction description',
        payment_options: {
          allowed_payment_method: 'IMMEDIATE_PAY'
        },
        item_list: {
          shipping_address: {
            recipient_name: 'PP Plus Recipient',
            line1: 'Gregório Rolim de Oliveira, 42',
            line2: 'JD Serrano II',
            city: 'Votorantim',
            country_code: 'BR',
            postal_code: '18117-134',
            state: 'São Paulo',
            phone: '0800-761-0880'
          },
          items: [{
            name: 'handbag',
            description: 'red diamond',
            quantity: '1',
            price: '75',
            tax: '6',
            sku: 'product34',
            currency: 'BRL'
          }]
        }
      }],
      redirect_urls: {
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      }
    };
    const data = {
      // tslint:disable-next-line:max-line-length
      body: {'transaction-request': {version: '1.0.0', authorize: {order: {reference: '123456789', totalAmount: '10000'}, payment: {acquirer: '1', method: '1', amount: '10000', currency: '986', country: 'BRA', numberOfPayments: '1', flag: 'mastercard', cardHolder: 'Jose Da Silva', cardNumber: '5392947655401104', cardSecurityCode: '438', cardExpirationDate: '201908', saveCreditCard: 'false', generateToken: 'false'}, billing: {customerIdentity: '1', name: 'Fulano de Tal', email: 'fulanodetal@email.com'}, urlReturn: 'http://loja.exemplo.com.br', fraud: 'false'}}}
    };
    this.http.post('http://evaluation-api.azpay.com.br/v1/receiver#creditCardAuthorization', data).subscribe(( result: any ) => {
     resolve(result.json());
     console.log(result.json());
   });
  });
  }
ngOnInit() {
  }
entrar() {
    this.navCtrl.navigateRoot('/login');
  }
}
