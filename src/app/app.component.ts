import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface Section {
  rules: Map<number, Array<number>>;
  orders: Array<Array<number>>;
}
@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Sum of middle page numbers: ' + sumOfMiddlePageNumbers() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/5-1-test.txt';
  DATA_FILE_PATH = '/assets/5-1.txt';

  sections = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n\n')))
  );

  sumOfMiddlePageNumbers = computed(() => {
    if (this.sections()) {
      const section = this.prepareSections(this.sections()!);
      return this.checkUpdates(section);
    } else {
      return 0;
    }
  });

  prepareSections(sections: Array<string>): Section {
    if (!sections)
      return { rules: new Map<number, Array<number>>(), orders: [] };
    const rules = this.prepareRules(sections[0]);
    const orders = this.prepareOrder(sections[1]);
    return { rules, orders };
  }

  prepareRules(ruleSection: string): Map<number, Array<number>> {
    const rules = new Map<number, Array<number>>();
    const rulesInput = ruleSection.split('\n').map((rule) => rule.split('|'));
    rulesInput.forEach((rule) => {
      const newRule = +rule[0];

      if (rules.has(newRule)) {
        rules.get(newRule)!.push(+rule[1]);
      } else {
        rules.set(+rule[0], [+rule[1]]);
      }
    });
    return rules;
  }

  prepareOrder(orderSection: string): Array<Array<number>> {
    return orderSection
      .split('\n')
      .map((order) => order.split(',').map((page) => +page));
  }

  checkUpdates(section: Section): number {
    let updateNumber = 0;
    section.orders.forEach((order) => {
      updateNumber += this.checkUpdate(order, section.rules);
    });
    return updateNumber;
  }

  checkUpdate(order: Array<number>, rules: Map<number, Array<number>>): number {
    for (let i = 0; i < order.length; i++) {
      const page = +order[i];
      const orderToThisPage = order.slice(0, i);
      const pagesThatShouldBeBefore = rules.get(page) ?? [];
      if (
        pagesThatShouldBeBefore.find(
          (pageThatShouldBeBefore) =>
            orderToThisPage.indexOf(pageThatShouldBeBefore) !== -1
        )
      ) {
        return 0;
      }
    }
    return order[(order.length - 1) / 2];
  }
}
