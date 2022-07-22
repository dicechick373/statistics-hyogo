declare namespace EstatResponse {
  export interface RESULT {
    STATUS: number
    ERROR_MSG: string
    DATE: Date
  }

  export interface NARROWINGCOND {
    CODE_CAT01_SELECT: string
    CODE_AREA_SELECT: string
  }

  export interface PARAMETER {
    LANG: string
    STATS_DATA_ID: string
    NARROWING_COND: NARROWINGCOND
    DATA_FORMAT: string
    START_POSITION: number
    METAGET_FLG: string
    EXPLANATION_GET_FLG: string
    ANNOTATION_GET_FLG: string
    REPLACE_SP_CHARS: number
    CNT_GET_FLG: string
    SECTION_HEADER_FLG: number
  }

  export interface RESULTINF {
    TOTAL_NUMBER: number
    FROM_NUMBER: number
    TO_NUMBER: number
  }

  export interface STATNAME {
    '@code': string
    $: string
  }

  export interface GOVORG {
    '@code': string
    $: string
  }

  export interface TITLE {
    '@no': string
    $: string
  }

  export interface MAINCATEGORY {
    '@code': string
    $: string
  }

  export interface SUBCATEGORY {
    '@code': string
    $: string
  }

  export interface STATISTICSNAMESPEC {
    TABULATION_CATEGORY: string
    TABULATION_SUB_CATEGORY1: string
  }

  export interface DESCRIPTION {
    TABULATION_CATEGORY_EXPLANATION: string
  }

  export interface TITLESPEC {
    TABLE_NAME: string
  }

  export interface TABLEINF {
    '@id': string
    STAT_NAME: STATNAME
    GOV_ORG: GOVORG
    STATISTICS_NAME: string
    TITLE: TITLE
    CYCLE: string
    SURVEY_DATE: number
    OPEN_DATE: string
    SMALL_AREA: number
    COLLECT_AREA: string
    MAIN_CATEGORY: MAINCATEGORY
    SUB_CATEGORY: SUBCATEGORY
    OVERALL_TOTAL_NUMBER: number
    UPDATED_DATE: string
    STATISTICS_NAME_SPEC: STATISTICSNAMESPEC
    DESCRIPTION: DESCRIPTION
    TITLE_SPEC: TITLESPEC
  }

  export interface CLASSOBJ {
    '@id': string
    '@name': string
    CLASS: any
  }

  export interface CLASSINF {
    CLASS_OBJ: CLASSOBJ[]
  }

  export interface NOTE {
    '@char': string
    $: string
  }

  export interface VALUE {
    '@tab': string
    '@cat01': string
    '@area': string
    '@time': string
    '@unit': string
    $: string
  }

  export interface DATAINF {
    NOTE: NOTE[]
    VALUE: VALUE[]
  }

  export interface STATISTICALDATA {
    RESULT_INF: RESULTINF
    TABLE_INF: TABLEINF
    CLASS_INF: CLASSINF
    DATA_INF: DATAINF
  }

  export interface GETSTATSDATA {
    RESULT: RESULT
    PARAMETER: PARAMETER
    STATISTICAL_DATA: STATISTICALDATA
  }

  export interface RootObject {
    GET_STATS_DATA: GETSTATSDATA
  }
}

export = EstatResponse
export as namespace EstatResponse
