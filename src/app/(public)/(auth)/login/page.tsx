import { Suspense } from 'react';

import { LoginFormContainer } from '@/containers';

function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={null}>
                <LoginFormContainer />
            </Suspense>
        </div>
    );
}

export default Login;
