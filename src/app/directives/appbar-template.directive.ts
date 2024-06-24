import { Directive, Input, TemplateRef, inject } from "@angular/core";

@Directive({
  selector: "[appTemplate]",
  standalone: true,
})
export class AppbarTemplateDirective {
  @Input("appTemplate")
  name!: string;

  templateRef = inject(TemplateRef<any>);
}
