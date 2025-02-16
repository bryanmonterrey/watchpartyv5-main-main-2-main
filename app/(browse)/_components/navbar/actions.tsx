import { getServerActionData } from './serverActions';
import { ClientActions } from './clientActions';

const Actions = async () => {
  const { user, subscriptionStatus } = await getServerActionData();

  return <ClientActions />;
};

export default Actions;