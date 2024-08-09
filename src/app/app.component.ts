import { Component } from '@angular/core';
import { UserService } from './shared/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  darkMode = false;
  constructor(private userService: UserService){
    this.userService.autoLogin();
    this.darkMode = this.userService.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
  } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
  }
  }
}
