import { Component } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { RequestsService } from '../../services/requests/requests.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  dat = '';
  notifications = 0;
  constructor(private translate: TranslationService, private requestsService: RequestsService){
    this.translate.useTranslation('home');
    this.requestsService.getNumberOpened().subscribe(res => this.notifications = res);
  }
}
