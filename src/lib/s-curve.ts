import { levenbergMarquardt } from "ml-levenberg-marquardt";

export interface SCurveFitResult {
  x0: number;
  k: number;
  fittedY: number[];
  projectedY: number[];
  historicalDates: string[];
  futureDates: string[];
}

const N_FUTURE_MONTHS = 187;

function logistic([x0, k]: number[]): (x: number) => number {
  return (x: number) => 100 / (1 + Math.exp(-k * (x - x0)));
}

export function fitAndProject(
  bevValues: number[],
  totalValues: number[],
  startDate: string,
  rollingWindow: number
): SCurveFitResult {
  // Rolling mean of BEV share
  const y: number[] = [];
  for (let i = rollingWindow - 1; i < bevValues.length; i++) {
    let bevSum = 0;
    let totalSum = 0;
    for (let j = i - rollingWindow + 1; j <= i; j++) {
      bevSum += bevValues[j];
      totalSum += totalValues[j];
    }
    y.push(totalSum > 0 ? (bevSum / totalSum) * 100 : 0);
  }

  const x = y.map((_, i) => i);

  const result = levenbergMarquardt(
    { x, y },
    logistic,
    {
      initialValues: [50, 0.1],
      minValues: [-20, 0],
      maxValues: [100, 2],
      maxIterations: 1000,
      errorTolerance: 1e-8,
    }
  );

  const [x0, k] = result.parameterValues;
  const fn = logistic([x0, k]);

  const fittedY = x.map(fn);
  const futureX = Array.from(
    { length: N_FUTURE_MONTHS },
    (_, i) => x[x.length - 1] + 1 + i
  );
  const projectedY = futureX.map(fn);

  // Generate date ranges
  const start = new Date(startDate);
  start.setMonth(start.getMonth() + rollingWindow - 1);

  const historicalDates = x.map((_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    return d.toISOString().slice(0, 10);
  });

  const futureDates = futureX.map((_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + x.length + i);
    return d.toISOString().slice(0, 10);
  });

  return { x0, k, fittedY, projectedY, historicalDates, futureDates };
}
