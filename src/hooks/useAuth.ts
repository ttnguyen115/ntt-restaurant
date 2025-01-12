import { use } from 'react';

import { AuthContext } from '@/contexts';

function useAuth() {
    return use(AuthContext);
}

export default useAuth;
