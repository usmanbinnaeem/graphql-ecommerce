import CreateProduct from '../components/CreateProduct';
import PleaseSignIn from '../components/PleaseSignIn';

const SellPage = () => (
  <>
    <PleaseSignIn>
      <CreateProduct />
    </PleaseSignIn>
  </>
);

export default SellPage;
