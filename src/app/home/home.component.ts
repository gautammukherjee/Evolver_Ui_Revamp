import { Component } from '@angular/core';
// import { HeaderComponent } from '../../shared/header/header.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  hideHeader: boolean = false;
  hideFooter: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideHeader = this.router.url === '/login' || this.router.url === '/';
        this.hideFooter = this.router.url === '/login' || this.router.url === '/';
      }
    });
  }

  onApplicationEnter(appName: string) {
    if (appName === 'knowledge') {
      this.router.navigate(['/dashboard']);
    }
  }

}
