import { Component, Input } from '@angular/core';

import { Card } from '../../services/card/card.model';

@Component({
  selector: 'app-card-mastercard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card!: Card;

  constructor(){
  }
}
