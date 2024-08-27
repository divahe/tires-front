import {ref} from 'vue'
import {defineStore} from 'pinia'
import type { SnackbarInfo, SnackbarState, Errors } from '@/model/index'

export const useSnackbarStore = defineStore('snackbar', () => {
    const bookingSnackbar = ref<SnackbarState>({
        show: false,
        time: '',
        name: '',
        address: '',
        id: '',
        info: '',
        type: ''

    })
    const listLoadingError = ref({
        show: false,
        errors: {}
    })

    function setBookingMessage(snackbarInfo: SnackbarInfo) {
        bookingSnackbar.value = {
            ...snackbarInfo
            , show: true
        }
    }

    function setListLoadingError(errors: Errors) {
        listLoadingError.value = {
            errors
            , show: true
        }
    }

    return {
        bookingSnackbar,
        listLoadingError,
        setBookingMessage,
        setListLoadingError
    }
})