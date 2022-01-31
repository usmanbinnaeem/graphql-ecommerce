import { gql, useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

const SignOut = () => {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
      },
    ],
  });
  return (
    <div>
      <button type="button" onClick={signout}>
        Sign Out!
      </button>
    </div>
  );
};

export default SignOut;
