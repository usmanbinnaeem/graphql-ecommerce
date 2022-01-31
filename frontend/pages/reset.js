import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

const resetPage = ({ query }) => {
  if (!query?.token) {
    return (
      <div>
        <p>soory you must apply a token</p>
        <RequestReset />
      </div>
    );
  }

  return (
    <div>
      <p>Reset your password {query.token}</p>
      <Reset token={query.token} />
    </div>
  );
};

export default resetPage;
