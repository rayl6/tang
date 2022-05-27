import type { AxiosRequestConfig } from 'axios'
import type { AppApi, AppFsApi, AppPageLoader, AppAuthLoader, AppAuthApi, AppStartOptions } from './app'

import type { PartialPageSchema } from '@zto/zpage-core'
import type { HttpRequest, HttpRequestConfig } from '../utils'
import type { App } from '../app/App'
import type { ApiRequest, RuntimeConfig } from './runtime'

/** 应用配置 */
export interface AppConfig extends RuntimeConfig {
  schema?: AppSchema
  app: AppAppConfig
  api: AppApiConfig
  apis: AppApisConfig
  widgets?: AppWidgetsConfig // 接入的微件配置
  components?: AppComponentsConfig // 接入的组件配置
  assets?: AppAssetsConfig // 接入的资源配置
}

export interface AppAppFrameConfig {
  [prop: string]: any
}

export interface AppAppHeaderConfig {
  extra?: Record<string, any> // 右侧扩展配置
  downloads?: Record<string, any> // 下载按钮配置
}

export interface AppAppApiConfig<T extends AppApi = AppApi> extends AppApiConfig<T> {
  request: ApiRequest
}

export interface AppAppMenuConfig {
  showNav?: boolean
  items?: NavMenuItemConfig[]
}

export interface AppAppPageConfig {
  keepAlive?: boolean
  loader?: string | AppPageLoader
}

export interface AppAppAuthConfig {
  loader?: string | AppAuthLoader
  token?: {
    autoRefresh?: boolean
    refreshDuration?: number
  }
}

export interface AppAppConfig {
  title?: string
  frame?: AppAppFrameConfig
  menu?: AppAppMenuConfig
  header?: AppAppHeaderConfig
  page?: AppAppPageConfig
  auth?: AppAppAuthConfig
  onLoad?: (app: App, options: AppStartOptions) => Promise<void> | void
  onUnload?: (app: App) => Promise<void> | void
}

export type AppFfbsConfig = Record<string, FfbProcessor>

export interface AppApiConfig<T extends AppApi = AppApi> extends HttpRequestConfig {
  request?: ApiRequest
  methods?: (api: T) => Omit<T, keyof typeof HttpRequest>
}

/** 应用Apis */
export interface AppApisConfig {
  app: AppApiConfig
  fs: AppApiConfig<AppFsApi>
  auth: AppApiConfig<AppAuthApi>
  [prop: string]: AppApiConfig
}

export interface AppComponentsConfig {
  cmpt?: {
    prefixs?: string[]
  }
  [prop: string]: any
}

export interface AppWidgetsConfig {
  [prop: string]: any
}

export interface AppAssetImportTemplateColumn {
  prop: string
  type?: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  transform?: Function
  formatter?: Function
  [prop: string]: any
}

export interface AppAssetImportTemplateConfig {
  name: string
  url: string
  fileType: string
  columns: (string | AppAssetImportTemplateColumn)[]
  [prop: string]: any
}

export interface AppAssetsConfig {
  import_templates: Record<string, AppAssetImportTemplateConfig>
  [prop: string]: any
}

export type UseAppConfigMethod<T = any> = (app: App) => T
export type AppConfigMethod<T = any> = (app: App) => T
export type AppConfigDefinition<T = any> = T | AppConfigMethod<T>

export type AppPageDefinition<T extends PartialPageSchema = PartialPageSchema> = T | AppConfigMethod<T>

export type UseApiConfigMethod<T extends AppApi = AppApi> = (app: App) => AppApiConfig<T>
export type AppApiDefinition<T extends AppApi = AppApi> = AppApiConfig<T> | UseApiConfigMethod<T>

/** 应用Apis */
export interface AppApisDefinition {
  app: AppApiDefinition
  fs: AppApiDefinition<AppFsApi>
  auth: AppApiDefinition<AppAuthApi>
  [prop: string]: AppApiDefinition
}