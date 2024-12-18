import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Sum of middle page numbers: ' + sumOfGoodLines() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/7-1-test.txt';
  DATA_FILE_PATH = '/assets/7-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  sumOfGoodLines = computed(() => {
    let sum = 0;
    if (this.lines()) {
      this.lines()!.forEach((line) => {
        sum += this.testLine(line);
      });
      return sum;
    } else {
      return 0;
    }
  });

  testLine(line: string): number {
    let [tempResult, tempOperands] = line.split(': ');
    let operands = tempOperands.split(' ').map((operand) => +operand);
    const result = +tempResult;
    const operatorsArray: Array<any> = this.getOperators(operands.length - 1);
    for (let j = 0; j < operatorsArray.length; j++) {
      let total = operands[0];
      for (let i = 0; i < operands.length - 1; i++) {
        total = operatorsArray[j][i](total, operands[i + 1]);
      }
      if (total === result) {
        return result;
      }
    }
    return 0;
  }

  getOperators(numberOfOperatorsRequired: number): Array<Array<any>> {
    const operators = [this.add, this.multiply, this.combine];
    let operatorsArray = Array<Array<any>>();
    for (
      let index = 0;
      index < operators.length ** numberOfOperatorsRequired;
      index++
    ) {
      operatorsArray.push(
        index
          .toString(operators.length)
          .padStart(numberOfOperatorsRequired, '0')
          .split('')
          .map((operator) => operators[+operator])
      );
    }
    return operatorsArray;
  }

  add(a: number, b: number): number {
    return a + b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  combine(a: number, b: number): number {
    return +(a.toString() + b.toString());
  }
}
