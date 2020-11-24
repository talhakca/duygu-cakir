import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload/public-api';
import { HttpClient } from '@angular/common/http';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileList = [];
  metadata: UploadMetadata = {
    contentType: 'ck1',
    customMetadata: {
      imageType: 'surprised'
    }
  };
  storage = this.firebase.storage();
  previewImage: string | undefined = '';
  previewVisible = false;
  constructor(
    private http: HttpClient,
    private firebase: FirebaseApp) { }

  ngOnInit(): void {
  }


  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  onFileChange(fileData: NzUploadChangeParam) {
    const file = fileData.file.originFileObj;
    const storageRef = this.storage.ref();
    const imageRef = storageRef.child(`${file.name}.jpg`);
    const surpisedImagesRef = storageRef.child(`images/${file.name}.jpg`);

    surpisedImagesRef.put(file, this.metadata).then(function (snapshot) {
    });
  }

}
