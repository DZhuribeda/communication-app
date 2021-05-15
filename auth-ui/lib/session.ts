import { GetServerSidePropsContext } from 'next';

export async function withSession(next: (GetServerSidePropsContext) => void) {
    return (context: GetServerSidePropsContext) => {
        
    }
}