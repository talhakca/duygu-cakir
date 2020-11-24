import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { ListResult } from '@angular/fire/storage/interfaces';
import { TimeHolder } from 'ng-zorro-antd/time-picker/time-holder';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'duygu-cakir';

  numberOfImages = 599;
  storage = this.firebase.storage();
  database = this.firebase.database();
  imageRef: string;
  imagePath: string;
  imageType: string;
  ckFirstEmotionGroup = ['surprised', 'sadness', 'neutral', 'happiness', 'fear', 'disgust', 'contempt', 'anger'];
  radioOptions = [];
  radioValue: string;
  timePassed = 0;
  isStarted = false;
  datasetType: string;

  constructor(
    private firebase: FirebaseApp
  ) { }

  ngOnInit(): void {
    this.startTimer();
  }

  /**
   * gets random image from storage
   *
   * @memberof AppComponent
   */
  getRandomImage() {
    /* creating local storagaRef */
    const storageRef = this.storage.ref('images');
    /* getting storage ref (images) list */
    storageRef.list().then((storageList: ListResult) => {
      /* takes items length and creating random index */
      const randomIndex = Math.floor(Math.random() * storageList.items.length);
      /* gets random image's metadata */
      storageList.items[randomIndex].getMetadata().then(metadata => {
        /* takes type of image */
        this.imageType = metadata.customMetadata.imageType;
        this.datasetType = metadata.contentType;

        if (this.datasetType === 'ck1') {
          this.radioOptions = this.ckFirstEmotionGroup;
        }
      });
      /* takes imageref */
      this.imageRef = storageList.items[randomIndex].name;
      /* takes imagepath */
      this.storage.ref().child(`images/${this.imageRef}`).getDownloadURL().then(imagePath => {
        this.imagePath = imagePath;
        this.timePassed = 0;
        this.radioValue = null;
      });
    });
  }

  startTimer() {
    setInterval(() => {
      this.timePassed++;
    }, 1000);
  }

  onRadioChange() {
    const imageData = {
      imageRef: this.imageRef,
      timePassed: this.timePassed,
      imageType: this.imageType,
      userSelection: this.radioValue
    };

    const imageName = this.imageRef.split('.', 1);
    const refPath = `images/${imageName}`;

    this.database.ref().push(imageData);
    this.getRandomImage();
  }

  onStartButtonClicked() {
    this.getRandomImage();
    this.isStarted = true;
  }
}
