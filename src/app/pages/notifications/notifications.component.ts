import { Component, OnInit } from '@angular/core';

import { CardService } from 'src/app/shared/services/card/card.service';
import { RequestsModel } from 'src/app/shared/services/requests/requests.model';
import { RequestsService } from 'src/app/shared/services/requests/requests.service';
import { TranslationService } from 'src/app/shared/services/translation.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  requests: RequestsModel[] = [];

  constructor(private requestService: RequestsService, 
    private cardsService: CardService,
    private translate: TranslationService
  ){
    this.translate.useTranslation('statistics');
  }

  ngOnInit(){
    this.requestService.getRequestsByIdUser().subscribe(res => this.requests = res);
  }
  doAccept(request: RequestsModel){
    this.cardsService.getMoneyOnAnArbitraryCard(request.amount).subscribe(() => {
      request.closed = true;
      request.status = 'A';
      this.requestService.updateRequests(request).subscribe();
    })
  }
  doDecline(request: RequestsModel){
    request.closed = true;
    request.status = 'D';
    this.requestService.updateRequests(request).subscribe();
  }
}
