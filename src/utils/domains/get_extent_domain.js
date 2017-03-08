import * as d3 from 'd3'

export default function({
  data,
  xCol,
  yCol,
  xExtent,
  yExtent
}) {
  const y = this.col === 'yCol'
  const col = y ? yCol : xCol
  const extent = y ? yExtent : xExtent
  return extent || d3.extent(data, d => d[col])
}
