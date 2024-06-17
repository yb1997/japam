import {
  Component,
  TemplateRef,
  ViewChild,
  computed,
  model,
  signal,
} from "@angular/core";
import { AppbarComponent } from "../../layouts/app-bar/app-bar.component";
import { Dialog, DialogModule } from "@angular/cdk/dialog";
@Component({
  selector: "app-home",
  templateUrl: "home.screen.html",
  styleUrls: ["./home.screen.scss"],
  standalone: true,
  imports: [AppbarComponent, DialogModule],
})
export class HomeScreenComponent {
  @ViewChild("resetDialog")
  resetDialog!: TemplateRef<any>;

  constructor(public dialog: Dialog) {}

  readonly roundCounter = computed(() => this._counter() % this.threshold());

  readonly totalRound = computed(() =>
    Math.floor(this._counter() / this.threshold())
  );

  private readonly _counter = signal(0);

  threshold = model(5); // acting like input() + signal

  onRoundCounterClick() {
    this._counter.update((val) => val + 1);
  }

  onReset() {
    this.dialog.open(this.resetDialog, {
      minWidth: "300px",
    });
  }
}
