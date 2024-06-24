import {
  Component,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from "@angular/core";
import { AppbarTemplateDirective } from "../../directives/appbar-template.directive";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: "app-bar-layout",
  templateUrl: "app-bar.component.html",
  styleUrls: ["./app-bar.component.scss"],
  standalone: true,
  imports: [AppbarTemplateDirective, NgTemplateOutlet],
})
export class AppbarComponent {
  @ContentChildren(AppbarTemplateDirective)
  templateRefs!: QueryList<AppbarTemplateDirective>;

  mainContentTemplate!: TemplateRef<any>;
  navContentTemplate!: TemplateRef<any>;

  ngAfterContentInit() {
    this.mainContentTemplate = this.templateRefs?.find(
      (refs) => refs.name === "mainContent"
    )?.templateRef!;

    this.navContentTemplate = this.templateRefs?.find(
      (ref) => ref.name === "navbarContent"
    )?.templateRef!;
  }
}
