/**
 * Created by willchen on 2017/8/21.
 */
export default {
    state: {
        oneKeying: [],
    },
    getters: {
        hasOneKey(state, getters, rootState){
            return state.oneKeying.length > 0;
        }
    },
    mutations: {
        setOneKey(state,payload) {
            if (payload.isOneKeyPublish) {
                state.oneKeying.push(payload.isOneKeyPublish);
            } else {
                state.oneKeying.shift(payload.isOneKeyPublish);
            }

        }
    },

    actions: {

    }


}