import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {AlertController} from '@ionic/angular';
import {ServiceService} from '../service.service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import {Observable} from 'rxjs'
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import {finalize} from 'rxjs/operators';
export interface Foto {
    fotoN: string;
    link?: any;
}

@Component({
  selector: 'app-add-proc',
  templateUrl: './add-proc.page.html',
  styleUrls: ['./add-proc.page.scss'],
})
export class AddProcPage implements OnInit {
    nomePrd = '';
    email = '';
    tellme = '';
    valor: number;
    nomeLoja = '';
    LikeValue: number;
    DislikeValue: number;
    autor: string;
    type = '';
    resumo = '';
    mainuser;
    sub;
    name;
    nome = '';
    boss;
    procUser: any ;
    que;
    url
    public donwloadUrl: Observable<string>;
    public uploadPercent: Observable<number>;
    private formulario : FormGroup;
    photos: Array<Foto> = [];


  constructor(public navCtrl: NavController, public afStore: AngularFirestore,
              public alertCtrl: AlertController,
              public services: ServiceService,
              private platform: Platform,private camera: Camera,
              private formBuilder: FormBuilder, private afStorage: AngularFireStorage,
              private mediaCapture: MediaCapture,
              private file: File,
              private media: Media) {
     // this.procUser = this.services.getProc(this.que);
      const user = firebase.auth().currentUser;
      console.log(user.email);
      if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);

            } else {
    // No user is signed in.
      }
      this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.email = event.email;
      this.nome = event.nome;
      this.boss = event.boss;
    });
     this.formulario = this.formBuilder.group({
      valor: ['', Validators.required],
      nomePrd: ['', Validators.required],
      resumo: ['', Validators.required]      

    });
  }

  ngOnInit() {
  }

  async abrirGaleria1(){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        //mediaType: this.camera.MediaType.PICTURE
    }
    try{
      const fileUri: string = await this.camera.getPicture(options)
      let file: string

      if(this.platform.is('ios')){
        file = fileUri.split('/').pop();
      }else{
        file = fileUri.substring(fileUri.lastIndexOf('/')+1, fileUri.indexOf('?'))
      }
      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
      const blob: Blob = new Blob([buffer],{type:'image/jpeg'})
      this.uploadPicture(blob)
    }catch(error){
      console.error(error)
    }

  }
  async abrirGaleria2(){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        //mediaType: this.camera.MediaType.PICTURE
    }
    try{
      const fileUri: string = await this.camera.getPicture(options)
      let file: string

      if(this.platform.is('ios')){
        file = fileUri.split('/').pop();
      }else{
        file = fileUri.substring(fileUri.lastIndexOf('/')+1, fileUri.indexOf('?'))
      }
      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
      const blob: Blob = new Blob([buffer],{type:'image/jpeg'})
      this.uploadPicture(blob)

    }catch(error){
      console.error(error)
    }

  }
    async abrirGaleria3(){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        //mediaType: this.camera.MediaType.PICTURE
    }
    try{
      const fileUri: string = await this.camera.getPicture(options)
      let file: string

      if(this.platform.is('ios')){
        file = fileUri.split('/').pop();
      }else{
        file = fileUri.substring(fileUri.lastIndexOf('/')+1, fileUri.indexOf('?'))
      }
      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
      const blob: Blob = new Blob([buffer],{type:'image/jpeg'})
      this.uploadPicture(blob)
    }catch(error){
      console.error(error)
    }

  }
    async abrirGaleria4(){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        //mediaType: this.camera.MediaType.PICTURE
    }
    try{
      const fileUri: string = await this.camera.getPicture(options)
      let file: string

      if(this.platform.is('ios')){
        file = fileUri.split('/').pop();
      }else{
        file = fileUri.substring(fileUri.lastIndexOf('/')+1, fileUri.indexOf('?'))
      }
      const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
      const blob: Blob = new Blob([buffer],{type:'image/jpeg'})
      this.uploadPicture(blob)
    }catch(error){
      console.error(error)
    }

  }
  uploadPicture(blob:Blob){
    var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    console.log(seq);
    const ref = this.afStorage.ref(seq +'.jpeg');
    const task = ref.put(blob)
    const don = this.afStorage.ref(seq+'.jpeg');
    const task2 = don.put(blob)
    this.uploadPercent = task.percentageChanges();
    task2.snapshotChanges().pipe(
        finalize(() => {

          this.donwloadUrl = don.getDownloadURL();
          this.donwloadUrl.subscribe(res => {
            this.url = res;
             this.photos.push({fotoN:'ionic.fotoSUB',
                            link:String(this.url)})
            this.showalert('Opa!', 'Concluido! Se quiser, já pode publicar!');

          })
         
        })
      ).subscribe();
  }
  create() {
        console.log()

    const user = firebase.auth().currentUser;
    if (user) {
     var valorN
     var valorS
     valorN = this.formulario.value.valor.replace(',','')
     valorS = this.formulario.value.valor.replace(',','.')
      this.afStore.collection('produto').add({
         nome: this.formulario.value.nomePrd,
         email: user.email,
         valor: Number(valorS),
         tipoPrd: this.type,
         resumo: this.formulario.value.resumo,
         product: this.formulario.value.nomePrd,
         quantity: 1,
         detail:  this.resumo,
         price: Number(valorN),
         fotos: this.photos
      });
    }
    this.showalert('Obrigado!', 'Seu produto estará disponível em breve!');
    this.navCtrl.navigateForward('/user');
    this.photos = []
    console.log('aqui foi');
  }
async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  photo() {
   this.showalert('Sorry', 'Photos upload will be available in our next version.');

  }
  enviar() {
  	this.navCtrl.navigateForward('/user');
  	// ele vai fazer o processo de registar no firebase e depois joga para uma lista que vai estar na pagina do user.
  }
}
