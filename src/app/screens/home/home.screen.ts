import { Dialog, DialogModule, DialogRef } from "@angular/cdk/dialog";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  signal
} from "@angular/core";
import { AppbarComponent } from "../../layouts/app-bar/app-bar.component";

import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';


type CounterName = "Current Round" | "Total Rounds";

@Component({
  selector: "app-home",
  templateUrl: "home.screen.html",
  styleUrls: ["./home.screen.scss"],
  standalone: true,
  imports: [AppbarComponent, DialogModule],
})
export class HomeScreenComponent implements OnInit {
  private readonly dialog = inject(Dialog);
  private readonly _counter = signal(0);
  private dialogRef: DialogRef | null = null;
  private threshold = 108;
  protected readonly roundCounter = signal(0);
  protected readonly totalRound = signal(0);
  protected readonly counterList: CounterName[] = ["Current Round", "Total Rounds"];

  @ViewChild("resetDialog")
  resetDialog!: TemplateRef<any>;

  async ngOnInit() {
    console.log("ngOnInit fired!");

    await App.addListener("pause", this.onAppPause.bind(this));
    await App.addListener("resume", this.onAppResume.bind(this));
    await App.addListener("appStateChange", this.onAppStateChange.bind(this));

    const data = await Preferences.get({ key: "data" });
    console.log(`data from storage: ${JSON.stringify(data)}`);


  }

  async ngOnDestroy() {
    await Preferences.set({
      key: "data",
      value: JSON.stringify({
        rounderCounter: this.roundCounter(),
        totalRound: this.totalRound()
      })
    });
    console.log("home screen component ngOnDestroy called!");
  }

  onAppPause() {
    console.log("app paused");
  }

  onAppResume() {
    console.log("app resume");
  }

  onAppStateChange(e: any) {
    console.log(`app state changed, state: ${JSON.stringify(e)}`);
  }

  async onRoundCounterClick() {
    this._counter.update((val) => val + 1);
    const reachedThreshold = this.roundCounter() + 1 === this.threshold;
    this.totalRound.update(val => reachedThreshold ? val + 1 : val);
    this.roundCounter.update(_ => this._counter() % this.threshold);

    if (reachedThreshold) {
      await Haptics.vibrate({ duration: 800 });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  showResetDialog() {
    this.dialogRef = this.dialog.open(this.resetDialog, {
      minWidth: "300px",
    });
  }

  onReset(counterName: CounterName) {
    if (counterName === "Total Rounds") {
      this.totalRound.set(0);
    }

    this._counter.set(0);
    this.roundCounter.set(0);

    this.dialogRef?.close();
  }
}
