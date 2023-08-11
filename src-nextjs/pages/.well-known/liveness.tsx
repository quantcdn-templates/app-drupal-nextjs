import * as healthchecks from "../../lib/healthchecks"

export default function Healthz() {
  return (<></>);
}

export const getServerSideProps = async ({ req, res, resolvedUrl }) => {
  const data = {status: "success", checks: {}}
  let status = 200

  for (const healthcheck in healthchecks) {
    data.checks[healthcheck] = await healthchecks[healthcheck].alive()
    if (data.checks[healthcheck] === false) {
      status = 400
    }
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = status
  res.write(JSON.stringify(data));
  res.end();
  
  return {
      props: {},
  };
}