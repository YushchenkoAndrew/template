import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const config = new KubeConfig();
config.loadFromOptions({
  clusters: [
    {
      name: serverRuntimeConfig.K3S_CLUSTER,
      server: serverRuntimeConfig.K3S_SERVER,
      caData: serverRuntimeConfig.K3S_CA_DATA,
    },
  ],
  users: [
    {
      name: serverRuntimeConfig.K3S_USER,
      certData: serverRuntimeConfig.K3S_CERT_DATA,
      keyData: serverRuntimeConfig.K3S_KEY_DATA,
    },
  ],
  contexts: [
    {
      name: serverRuntimeConfig.K3S_CONTEXT,
      user: serverRuntimeConfig.K3S_USER,
      cluster: serverRuntimeConfig.K3S_CLUSTER,
    },
  ],

  currentContext: serverRuntimeConfig.K3S_CONTEXT,
});

export default config.makeApiClient(CoreV1Api);
