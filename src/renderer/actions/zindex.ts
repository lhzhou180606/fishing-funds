import { ThunkAction } from '@/reducers/types';
import * as Utils from '@/utils';
import * as CONST from '@/constants';
import * as Helpers from '@/helpers';

export const SET_ZINDEXS_LOADING = 'SET_ZINDEXS_LOADING';
export const SYNC_ZIDNEX_CONFIG = 'SYNC_ZIDNEX_CONFIG';
export const SYNC_ZIDNEXS = 'SYNC_ZIDNEXS';

export function addZindexAction(zindex: Zindex.SettingItem): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();
      const cloneZindexConfig = Utils.DeepCopy(zindexConfig);
      const exist = cloneZindexConfig.find((item) => zindex.code === item.code);
      if (!exist) {
        cloneZindexConfig.push(zindex);
      }
      dispatch(setZindexConfigAction(cloneZindexConfig));
    } catch (error) {
      console.log('添加指数配置出错', error);
    }
  };
}

export function deleteZindexAction(code: string): ThunkAction {
  return (dispatch, getState) => {
    try {
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();

      zindexConfig.forEach((item, index) => {
        if (code === item.code) {
          const cloneZindexSetting = JSON.parse(JSON.stringify(zindexConfig));
          cloneZindexSetting.splice(index, 1);
          dispatch(setZindexConfigAction(cloneZindexSetting));
        }
      });
    } catch (error) {
      console.log('删除指数出错', error);
    }
  };
}

export function setZindexConfigAction(zindexConfig: Zindex.SettingItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      Utils.SetStorage(CONST.STORAGE.ZINDEX_SETTING, zindexConfig);
      dispatch(syncZindexConfigAction());
    } catch (error) {
      console.log('设置指数配置出错', error);
    }
  };
}

export function syncZindexConfigAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const config = Helpers.Zindex.GetZindexConfig();
      dispatch({ type: SYNC_ZIDNEX_CONFIG, payload: config });
    } catch (error) {
      console.log('同步指数配置出错', error);
    }
  };
}

export function toggleZindexCollapseAction(zindex: Zindex.ResponseItem & Zindex.ExtraRow): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();

      const cloneZindexs = Utils.DeepCopy(zindexs);
      cloneZindexs.forEach((_) => {
        if (_.code === zindex.code) {
          _.collapse = !zindex.collapse;
        }
      });
      dispatch(syncZindexsStateAction(cloneZindexs));
    } catch (error) {
      console.log('指数展开/折叠出错', error);
    }
  };
}

export function toggleAllZindexsCollapseAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const cloneZindexs = Utils.DeepCopy(zindexs);
      const expandAllZindexs = zindexs.every((_) => _.collapse);
      cloneZindexs.forEach((_) => {
        _.collapse = !expandAllZindexs;
      });
      dispatch(syncZindexsStateAction(cloneZindexs));
    } catch (error) {
      console.log('全部指数展开/折叠出错', error);
    }
  };
}

export function sortZindexsAction(): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const sortZindexs = Helpers.Zindex.SortZindexs(zindexs);
      dispatch(syncZindexsStateAction(sortZindexs));
    } catch (error) {
      console.log('指数排序错误', error);
    }
  };
}

export function sortZindexsCachedAction(responseZindexs: Zindex.ResponseItem[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      const {
        zindex: { zindexs },
      } = getState();
      const { zindexConfig } = Helpers.Zindex.GetZindexConfig();
      const zindexsCodeToMap = zindexs.reduce((map, zindex) => {
        map[zindex.code] = zindex;
        return map;
      }, {} as any);

      const zindexsWithCollapseChached = responseZindexs.map((_) => ({
        ...(zindexsCodeToMap[_.code] || {}),
        ..._,
      }));

      const zindexWithChachedCodeToMap = zindexsWithCollapseChached.reduce((map, zindex) => {
        map[zindex.code] = zindex;
        return map;
      }, {} as any);

      zindexConfig.forEach((zindex) => {
        const responseZindex = zindexWithChachedCodeToMap[zindex.code];
        const stateZindex = zindexsCodeToMap[zindex.code];
        if (!responseZindex && stateZindex) {
          zindexsWithCollapseChached.push(stateZindex);
        }
      });

      const sortZindexs = Helpers.Zindex.SortZindexs(zindexsWithCollapseChached);
      dispatch(syncZindexsStateAction(sortZindexs));
    } catch (error) {
      console.log('指数带缓存排序出错', error);
    }
  };
}

export function syncZindexsStateAction(zindex: (Zindex.ResponseItem & Zindex.ExtraRow)[]): ThunkAction {
  return (dispatch, getState) => {
    try {
      dispatch({ type: SYNC_ZIDNEXS, payload: zindex });
    } catch (error) {
      console.log('同步指数状态出错', error);
    }
  };
}
