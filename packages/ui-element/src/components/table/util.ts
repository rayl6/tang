import { _, tpl, formatText, FormatterOptionsContext } from '@zto/zpage'

import type { App, PageContext } from '@zto/zpage'
import type { TableColumn } from './types'

/** 扁平化所有子列
 * @param columns - 所有列
 */
export function flattenChildren(columns: TableColumn[]) {
  const result: TableColumn[] = []

  const childFinder = (columns: TableColumn[]) => {
    for (const child of columns) {
      result.push(child)

      if (!child.children) continue

      childFinder(child.children)
    }
  }

  childFinder(columns)
  return result
}

/**
 * 根据columns合并两个列
 * @param columnsA
 * @param columnsB
 */
export function mergeColumns(target: (TableColumn | string)[], source: TableColumn[]) {
  const result = target.map(it => {
    let _it: any = it
    if (_.isString(it)) _it = { prop: it }

    if (!_it.prop) return _it

    let sIt = source.find(s => s.prop === _it.prop)
    const _sIt = _.omit(sIt, 'children')

    _it = _.deepMerge(_sIt, _it)

    if (sIt) {
      if (!_it.children) {
        _it.children = sIt.children || []
      } else if (sIt.children) {
        _it.children = mergeColumns(_it.children, sIt.children || [])
      }
    }

    return _it
  })

  return result
}

/** 所有子列 的 prop熟悉
 * @param columns - 所有列
 */
export function getChildProps(columns: TableColumn[]) {
  const allColumns = flattenChildren(columns)
  return allColumns.map(c => c.prop)
}

/**  */
export function getColCellStyleFn(app: App, cellStyle: any, columnStyles?: any[]) {
  if (!cellStyle && !columnStyles?.length) return null

  let baseCellStyle: any = {}
  if (_.isObject(cellStyle)) baseCellStyle = { ...cellStyle }

  return (scope: any) => {
    let funcStyle: any = {}
    if (_.isFunction(cellStyle)) funcStyle = cellStyle(scope)

    const colStyle = columnStyles?.find(it => it.prop && it.prop === scope.column?.property)
    const style = app.deepFilter({ ...baseCellStyle, ...funcStyle, ...colStyle?.style }, scope)

    return style
  }
}

/**
 * 获取当前列formatter方法
 * @param column 列
 */
export function getColFormatter(column: TableColumn) {
  let formatter: any = column.formatter
  if (formatter === false) return formatter
  if (typeof formatter === 'function') return formatter

  formatter = formatter || {}

  // @ts-ignore 这里formatter可能为对象
  const formatterType = formatter.type || 'default'

  switch (formatterType) {
    case 'default':
      formatter = getDefaultColFormatterFn(column.formatter)
      break
    default:
      formatter = getDefaultColFormatterFn()
      break
  }

  return formatter
}

/** 默认表格行格式化函数 */
export function getDefaultColFormatterFn(options?: any) {
  return (row: any, col: any, cellValue: any, context: PageContext) => {
    const dataContext = { app: context.app, data: row, column: col, options }

    const text = formatValue(cellValue, options, dataContext)

    return text
  }
}

/** 格式化值 */
export function formatValue(val: any, options: any, dataContext: FormatterOptionsContext) {
  if (typeof options === 'string') options = { name: options }

  options = { prefix: '', postfix: '', ...options }

  if (_.isEmpty(val)) return options.emptyText || '--'

  let valText = String(val)

  if (options.name) {
    valText = formatText(val, options.name, { context: dataContext, ...options })
  }

  const prefix = options.prefix || ''
  const postfix = options.postfix || ''

  let text = `${prefix}${valText}${postfix}` || '--'
  if (dataContext) text = tpl.filter(text, dataContext)

  return text
}
