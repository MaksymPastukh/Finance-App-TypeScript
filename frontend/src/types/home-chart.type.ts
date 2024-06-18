export type HomeChart = {
  labels: any[],
  datasets: Array<ChartDatasets>
}

export type ChartDatasets = {
  data: any[],
  backgroundColor: Array<string>
}