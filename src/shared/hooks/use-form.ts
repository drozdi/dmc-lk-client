import { debounce } from '../utils'
const validation = (value: any, rules: Function[] = []) => {
	return rules.map(rule => rule(value)).filter(v => v !== true)
}

export function useFormAction({ data, rules }) {
	const [errors, setErrors] = useState(validation(value, rules))
	const checkValue = useCallback(
		debounce((value: any) => {
			setErrors(validation(value, rules))
		}, 200),
		[rules]
	)
}

/*
import { ref, computed, reactive, nextTick, shallowRef } from "vue"
import { isArray, isObject, isString, isBoolean, isFunction, isUndefined, isNullOrUndefined, isEmptyObject, isFieldElement } from '../utils/is'
import { set, get, unset } from '../utils/_'
import BaseRepository from '../apps/core/utils/BaseRepository'

import { createInjectionState } from "./utils/createInjectionState"
import { provideAppForm } from './provide'

export function stateForm (defaultValue = {}, options = {}) {
    if (defaultValue instanceof BaseRepository) {
        options = { ...options, repository: defaultValue }
        defaultValue = {}
    }
    if (options instanceof BaseRepository) {
        options = { repository: options }
    }

    const state = {
        name: null,
        mode: 'JSON',
        action: null,
        readonly: false,
        disabled: false,
        repository: null,
        rules: {},
        default: defaultValue || {},
        checkExist: (value) => !!value.id,
        el: ref(null),
        ...options
    }

    const inputName = (name) => {
        name = isArray(name)? name: name.split('.');
        return name.reduce((accum, path) => {
            if (accum) {
                return accum+'['+path+']'
            }
            return path
        }, state.name);
    }

    const data = ref(state.default)
    const errors = ref({})
    const exist = computed(() => state.checkExist(data.value))
    const canAccess = computed(() => {
        return exist.value? 'can_update': 'can_create'
    })
    const attrs = computed(() => {
       return {
           method: exist.value? 'PUT': 'POST',
           action: isFunction(state.action)? state.action(exist, data): state.action,
           ref: state.el
       }
    })
    const subs = {}

    const setValue = (fieldName, value) => {
        clearErrors(fieldName)
        set(data.value, fieldName, value)
    }
    const getValue = (fieldName) => {
        return get(data.value, fieldName)
    }

    const setError = (fieldName, error) => {
        set(errors.value, fieldName, error)
    }
    const getError = (fieldName) => {
        return get(errors.value, fieldName)
    }

    const setRules = (fieldName, rules) => {
        set(state.rules, fieldName, rules)
    }
    const getRules = (fieldName) => {
        return get(state.rules, fieldName)
    }

    const clearErrors = (fieldName) => {
        if (isUndefined(fieldName)) {
            errors.value = {}
        } else {
            if (!isArray(fieldName)) {
                fieldName = fieldName.split(/\s+/)
            }
            fieldName.forEach((name) => {
                unset(errors.value, name)
            })
        }
    }

    const register = (fieldName, options = {required: false, disabled: false, readonly: false}) => {
        if (isObject(fieldName)) {
            return Object.entries(fieldName).reduce((accum, [key, opt]) => {
                return {
                    ...accum,
                    ...register(key, {...options, ...opt})
                }
            }, {})
        }
        let isModelValue = false
        const { vModel = 'modelValue' } = options
        if (isBoolean(options.disabled)) {
            options.disable = options.disabled
        }
        unset(options,'vModel')
        unset(options,'disabled')
        if (isArray(get(data.value, fieldName))) {
            options.multiple = true
        }
        return {
            ...options,
            ...(vModel === 'modelValue' && {
                name: inputName(fieldName),
                value: get(data.value, fieldName),
                onInput: (e) => {
                    queueMicrotask(() => {
                        if (!isModelValue) {
                            set(data.value, fieldName, e.target.value)
                        }
                    })
                },
            }),
            rules: get(state.rules, fieldName),
            errorMessages: get(errors.value, fieldName),
            [vModel]: get(data.value, fieldName),
            [`onUpdate:${vModel}`]: (value) => {
                isModelValue = true
                set(data.value, fieldName, value)
            }
        }
    }
    const component = (fieldName, options = {}) => {
        if (isObject(fieldName) && !isArray(fieldName)) {
            return Object.entries(fieldName).reduce((accum, [key, opt]) => {
                return {
                    ...accum,
                    ...component(key, {...options, ...opt})
                }
            }, {})
        }
        const { vModel = 'modelValue' } = options
        unset(options, 'vModel')
        if (isArray(get(data.value, fieldName))) {
            options.multiple = true
        }
        return {
            ...options,
            ...(vModel === 'modelValue' && {
                name: inputName(fieldName)
            }),
            [vModel]: get(data.value, fieldName),
            [`onUpdate:${vModel}`]: (value) => {
                set(data.value, fieldName, value)
            }
        }
    }
    const hidden = (fieldName, options = {}) => {
        const { vModel = 'modelValue' } = options
        unset(options, 'vModel')
        return {
            ...options,
            ...(vModel === 'modelValue' && {
                value: get(data.value, fieldName),
                name: inputName(fieldName)
            }),
            [vModel]: get(data.value, fieldName),
            type: 'hidden'
        }
    }
    const reset = (defaultValue) => {
        if (isObject(defaultValue) && !isEmptyObject(defaultValue)) {
            state.default = {...defaultValue}
        }
        clearErrors()
        state.el.value?.resetValidation()
        data.value = {...state.default}
    }

    const submit = () => {

    }

    return {
        subs,
        attrs,
        state,
        data,
        errors,
        exist,
        canAccess,
        register,
        component,
        hidden,
        reset,
        clearErrors,
        setValue,
        getValue,
        setError,
        getError
    }
}
export function useForm (...args) {
    let state = injectForm()
    if (!state) {
        state = provideForm(...args)
    } else {
        state.reset(args[0])
    }
    return state
}
export function useSubForm (name) {
    let state = injectForm()
    if (!state) {
        return null
    }
    name = name
        .replaceAll('[', '.')
        .replaceAll(']', '')
        .replace(state.state.name+'.', '')
    if (!state.subs[name]) {
        state.subs[name] = {
            name,
            register: (...args) => {
                args[0] = name+'.'+args[0]
                return state.register(...args)
            },
            component: (...args) => {
                args[0] = name+'.'+args[0]
                return state.component(...args)
            },
            hidden: (...args) => {
                args[0] = name+'.'+args[0]
                return state.hidden(...args)
            }
        }
    }
    return state.subs[name]
}
const [provideForm, injectForm] = createInjectionState(stateForm, {
    injectionKey: provideAppForm
});

export {
    provideForm,
    injectForm
}

*/
