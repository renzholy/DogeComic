import { ParamListBase } from '@react-navigation/native'

export interface ParamList extends ParamListBase {
  Home: {}
  Search: { q: string }
  Detail: { id: string; title: string }
  Comic: { id: string; title: string }
}
