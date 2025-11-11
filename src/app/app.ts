import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from '@app/public/presentation/components/navbar-component/navbar-component';
import {AuthenticationService} from '@app/iam/services/authentication.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private authService: AuthenticationService) {}

  protected readonly title = signal('BykerZ');
  ngOnInit(): void {
    this.authService.tryAutoSignIn();
  }
}
