import { Component, OnInit, inject} from '@angular/core';
import { Header } from "../../components/header/header";
import { LucideAngularModule } from 'lucide-angular';
import { Cpu, Zap, Headphones, Star, Truck, HandHelping, ShieldCheck } from 'lucide-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-about',

  imports: [Header, LucideAngularModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {

  private router: Router = inject(Router);

  constructor() {}

  cpu = Cpu;
  flash = Zap;
  headphones = Headphones;
  star = Star;
  truck = Truck;
  help = HandHelping;
  shield = ShieldCheck

  theme: string = ``

  ngOnInit(): void {
    this.loadTheme()
  }

  loadTheme(): void {
    const theme:string =  localStorage.getItem(`theme`) || `light`
    if (theme === `dark`) {
      this.theme = `/images/logo-about-dark.webp`
    } else {
      this.theme = `/images/logo-about-white.webp`
    }
  }

  goToHome(): void {
    this.router.navigate([`/shop`])
  }
}
