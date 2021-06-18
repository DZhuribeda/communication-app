
import { AxiosError } from 'axios'

import config from '../config'

export const isString = (x: any): x is string => typeof x === 'string'

// Redirects to the specified URL if the error is an AxiosError with a 404, 410,
// or 403 error code.
export const redirectOnSoftError = (
    err: AxiosError,
    redirectTo: string
) => {
    if (!err.response) {
        // What to do here
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (
        err.response.status === 404 ||
        err.response.status === 410 ||
        err.response.status === 403
    ) {
        return {
            redirect: {
                destination: `${config.kratos.public}${redirectTo}`,
                permanent: false,
            },
        };
    }

    // What to do here
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };
};