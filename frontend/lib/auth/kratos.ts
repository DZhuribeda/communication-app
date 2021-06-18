import { Configuration, PublicApi } from '@ory/kratos-client';
import { GetServerSidePropsContext } from 'next';
import config from '../config';

export const kratos = new PublicApi(new Configuration({ basePath: config.kratos.public }));

export const getCurrentUser = async (context: GetServerSidePropsContext) => {
    try {
        const { data: session } = await kratos.whoami(
            context.req.headers.cookie,
            context.req.headers.authorization,
        );
        return session;
    } catch (e) {
    }
    return null;
}

export const getCurrentUserIdentity = async (context: GetServerSidePropsContext) => {
    const user = await getCurrentUser(context);
    return user?.identity ?? null;
}