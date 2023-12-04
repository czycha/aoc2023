export function sum<T = number>(
  arr: number[],
  transform?: (value: T) => number,
): number;
export function sum<T>(
  arr: T[],
  transform: ((value: T) => number)
): number;
export function sum<T>(arr: T[], transform?: (value: T) => number): number {
  let sum = 0;
  for (const v of arr) {
    if (transform == null && typeof v === 'number') {
      sum += v;
    } else {
      sum += transform!(v);
    }
  }

  return sum;
}
