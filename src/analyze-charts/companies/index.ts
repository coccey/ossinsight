import {dataset, itemTooltip, title, utils} from '../options';
import {withChart} from '../chart';
import {d3Hierarchy, D3HierarchyItem} from '../options/custom/d3-hierarchy';

// lines of code
export type CompanyData = {
  company_name: string
}

export const CompaniesChart = withChart<CompanyData, { valueIndex: string }>(({
  title: propsTitle,
  data,
}, chartProps) => {
  const {dataset: ds, series} = utils.aggregate<CompanyData>((all) => {
    let index = 0
    const res = all.flatMap((data, i) =>
      transformCompanyData(data.data?.data ?? [], chartProps.valueIndex)
        .map(item => {
          item.value;
          item.id = `${i}-${item.name}`
          item.index = index++
          item.color = ['#dd6b66', '#759aa0'][i];
          return item;
        }),
    ).concat([{
      id: 'root',
      name: '',
      depth: 0,
      value: 0,
      index: -1,
      parentId: '',
    }]);
    const series = d3Hierarchy(res, 1);
    return {
      dataset: dataset(undefined, res),
      series: series,
    };
  });
  return {
    title: title(propsTitle),
    dataset: ds,
    legend: {
      show: true,
      left: 8,
      top: 8,
      data: utils.template(({name}, i) => ({
        name,
        itemStyle: {
          color: ['#dd6b66', '#759aa0'][i]
          // color: '#dd6b66'
        }
      }))
    },
    tooltip: itemTooltip({
      formatter: params => `${params.value.name}: ${params.value.value}`
    }),
    hoverLayerThreshold: Infinity,
    series,
  };
}, {
  aspectRatio: 16 / 9,
});

function transformCompanyData(data: CompanyData[], valueIndex: string): D3HierarchyItem[] {
  return data.flatMap((item, index) => ({
    id: '',
    name: item.company_name,
    depth: 1,
    value: item[valueIndex],
    index: 0,
    parentId: 'root',
  }));
}
