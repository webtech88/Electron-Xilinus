import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';



@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  animations: [
    trigger('tooltipState', [
      state('in', style({opacity: 1})),
      transition('void => in', [
        style({opacity: 0}),
        animate(200)
      ]),
      transition('in => void', [
        animate(200, style({opacity: 0}))
      ])
    ])
  ]
})
export class TooltipComponent {
	@Input() ip       = '';
	@Input() network  = '';
  @Input() size     = '';
  @Input() px       = 20;
  @Input() py       = 60;

  state = 'in';
}
