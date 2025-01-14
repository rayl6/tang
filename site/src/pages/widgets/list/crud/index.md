<!-- <CWidgetSchemaViewer name="WCrud" type="desc" /> -->

增删改查微件目前基本上是中后台管理使用最频繁的微件，对应 ui-element 下面 WCrud 组件。其主要作用是对列表类型的数据进行查询、展示、操作等功能。该微件同时也包含部分页面自动布局功能，一般情况必须外部需要套一个容器，通常和 Page 页面配合使用。

## 基本用法

最基本的用法是配置 数据源接口(api) 以及 展示列(columns)

```json
// --- doc-sample:zpage-widget ---
{
  "type": "crud",
  "style": { "height": "400px" },
  "actions": {
    "query": {
      "api": "/fixtures/data/list/crud",
      "mockData": {
        "data": [
          { "code": "10001", "name": "XX门店", "amount": 1000, "remark": "当天入库量" },
          { "code": "CODE2", "name": "名称2", "amount": 20, "remark": "描述xxx" }
        ]
      }
    }
  },
  "search": {
    "items": [
      { "type": "input", "prop": "code", "label": "编号" },
      { "type": "input", "prop": "name", "label": "名称" }
    ]
  },
  "table": {
    "showSummary": true,
    "columns": [
      { "prop": "code", "label": "编号", "width": 160 },
      { "prop": "name", "label": "名称", "width": 200 },
      { "prop": "amount", "label": "数量", "summaryProp": true, "width": 100 },
      { "prop": "remark", "label": "备注" }
    ]
  }
}
```

## 查询接口数据结构

详细请参考：<a href="http://w.ztosys.com/129571592" target="_blank">接口文档规范</a>

### 请求数据结构

- pageIndex: 分页参数，查询当前页标识，从 1 开始
- pageSize: 分页参数，分页大小

```json
{
  "pageIndex": 1, // 当前页
  "pageSize": 15, // 单页条数
  "...": "..." // 其他查询条件
}
```

### 返回数据结构

- result.data: 用于返回查询数据，格式为数组
- result.total: 用于返回查询一共有多少条数据，用于生成分页
- result.sum: 用于返回指定的汇总数据，sum 中字端对应 column 配置中的字端

```json
{
  "result": {
    "data": [
      // 返回数据
      { "code": "CODE1", "name": "名称1", "amount": 10, "remark": "描述..." }, // 每一行数据
      { "code": "CODE2", "name": "名称2", "amount": 20, "remark": "描述xxx" }
    ],
    "pageSize": 15, // 单页条数
    "total": 100, // 这里返回的是查询数据的总条数，用于生成分页组件，如果你不想要分页，把这个可以不返回
    "sum": {
      // 汇总数据
      "amount": 30 // 指定字段的汇总信息
    }
  },
  "message": "操作成功", // 消息（出错后提示）
  "status": true, // 请求状态，true: 成功，false: 失败
  "statusCode": "SYS000" // 错误码
}
```

<!-- ## 操作

<CWidgetSchemaViewer name="WCrud" type="tree" /> -->

## Schema

```json
// --- doc-schema:definition ---
{
  "properties": [
    {
      "name": "actions",
      "desc": "数据结构为map，对象的key未活动项名称，值为活动项配置信息。详细活动项配置可参考基础微件WAction。",
      "type": "map",
      "enum": "",
      "default": "",
      "children": [
        {
          "name": "query",
          "desc": "加载表单数据请求api。",
          "type": "object",
          "children": [
            {
              "name": "api",
              "desc": "",
              "type": "string|object",
              "children": [
                {
                  "name": "url",
                  "desc": "api请求路径。可以写成ns:path, ns为命名空间用于识别特定api",
                  "type": "string"
                }
              ]
            }
          ]
        },
        {
          "name": "export",
          "desc": "一般作为导出全部",
          "type": "object",
          "children": [
            {
              "name": "exportType",
              "desc": "导出类型",
              "type": "object",
              "default": "",
              "required": true
            }
          ]
        },
        {
          "name": "...",
          "desc": "其他活动项",
          "type": "object",
          "default": ""
        }
      ]
    },
    {
      "name": "search",
      "desc": "默认显示的tab的标签值。若未设置或未找到指定的默认项，将默认显示第一个tab页。",
      "type": "string",
      "default": "",
      "required": false
    },
    {
      "name": "toolbar",
      "desc": "默认显示的tab的标签值。若未设置或未找到指定的默认项，将默认显示第一个tab页。",
      "type": "string",
      "default": "",
      "required": false
    },
    {
      "name": "table",
      "desc": "默认显示的tab的标签值。若未设置或未找到指定的默认项，将默认显示第一个tab页。",
      "type": "string",
      "default": "",
      "required": false
    }
  ]
}
```
