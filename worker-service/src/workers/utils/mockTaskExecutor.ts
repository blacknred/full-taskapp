import { BaseLabel, NewTaskDto } from '../dto/new-task.dto';

export function mockTaskExecutor(task: NewTaskDto): any {
  let duration = 0;

  switch (task.label) {
    case BaseLabel.ROUTINE:
      duration = 70;
      break;
    case BaseLabel.MINOR:
      duration = 50;
      break;
    case BaseLabel.CRITICAL:
      duration = 30;
      break;
    default:
      duration = 30;
  }

  function fibonacci(n: number) {
    if (n < 2) return n;
    return fibonacci(n - 2) + fibonacci(n - 1);
  }

  // function factorial(n: number) {
  //   if (n === 1 || n === 0) return 1;
  //   return factorial(n - 1) * n;
  // }

  return fibonacci(duration);
}
